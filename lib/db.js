import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if we're in production (Vercel) or development
const isProduction = process.env.VERCEL === '1'

// Database adapter that works with multiple storage backends
class Database {
  constructor() {
    this.dataDir = path.join(__dirname, '../public/data')
    this.kv = null
    this.redis = null
    this.storageType = 'file' // Default to file storage
    
    // Initialize storage backend if in production
    if (isProduction) {
      this.initStorage()
    }
  }

  async initStorage() {
    // Try Vercel KV / Upstash Redis first (via @vercel/kv)
    if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const { kv } = await import('@vercel/kv')
        this.kv = kv
        this.storageType = 'kv'
        console.log('✓ Using Vercel KV / Upstash Redis for data storage')
        return
      } catch (error) {
        console.warn('⚠ Vercel KV not available:', error.message)
      }
    }

    // Try native Redis client (for custom Redis servers)
    if (process.env.REDIS_URL) {
      try {
        const { createClient } = await import('redis')
        this.redis = createClient({
          url: process.env.REDIS_URL
        })
        await this.redis.connect()
        this.storageType = 'redis'
        console.log('✓ Using Redis for data storage')
        return
      } catch (error) {
        console.warn('⚠ Redis connection failed:', error.message)
      }
    }

    // Fallback to file system (not recommended for production)
    console.warn('⚠ No database configured, using file system (data will not persist)')
    this.storageType = 'file'
  }

  async read(filename) {
    const key = filename.replace('.json', '')
    
    // Try Vercel KV / Upstash first
    if (this.kv) {
      try {
        const data = await this.kv.get(key)
        if (data) {
          console.log(`✓ Read from KV: ${key}`)
          return data
        }
      } catch (error) {
        console.error('KV read error:', error)
      }
    }

    // Try native Redis
    if (this.redis) {
      try {
        const data = await this.redis.get(key)
        if (data) {
          console.log(`✓ Read from Redis: ${key}`)
          return JSON.parse(data)
        }
      } catch (error) {
        console.error('Redis read error:', error)
      }
    }
    
    // Fallback to file system
    try {
      const filePath = path.join(this.dataDir, filename)
      const data = fs.readFileSync(filePath, 'utf8')
      console.log(`✓ Read from file: ${filename}`)
      return JSON.parse(data)
    } catch (error) {
      console.error('File read error:', error)
      return null
    }
  }

  async write(filename, data) {
    const key = filename.replace('.json', '')
    
    // Write to Vercel KV / Upstash if available
    if (this.kv) {
      try {
        await this.kv.set(key, data)
        console.log(`✓ Saved to KV: ${key}`)
      } catch (error) {
        console.error('KV write error:', error)
      }
    }

    // Write to native Redis if available
    if (this.redis) {
      try {
        await this.redis.set(key, JSON.stringify(data))
        console.log(`✓ Saved to Redis: ${key}`)
      } catch (error) {
        console.error('Redis write error:', error)
      }
    }
    
    // Always write to file system in development
    if (!isProduction) {
      try {
        const filePath = path.join(this.dataDir, filename)
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
        console.log(`✓ Saved to file: ${filename}`)
      } catch (error) {
        console.error('File write error:', error)
      }
    }
    
    return data
  }

  async close() {
    // Close Redis connection if exists
    if (this.redis) {
      await this.redis.quit()
    }
  }
}

export const db = new Database()

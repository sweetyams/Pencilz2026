import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if we're in production (Vercel) or development
const isProduction = process.env.VERCEL === '1'

// Database adapter that works both locally and on Vercel
class Database {
  constructor() {
    this.dataDir = path.join(__dirname, '../public/data')
    this.kv = null
    
    // Initialize Vercel KV if in production
    if (isProduction && process.env.KV_REST_API_URL) {
      this.initKV()
    }
  }

  async initKV() {
    try {
      // Dynamically import Vercel KV only in production
      const { kv } = await import('@vercel/kv')
      this.kv = kv
      console.log('Using Vercel KV for data storage')
    } catch (error) {
      console.warn('Vercel KV not available, falling back to file system')
    }
  }

  async read(filename) {
    const key = filename.replace('.json', '')
    
    // Try Vercel KV first if available
    if (this.kv) {
      try {
        const data = await this.kv.get(key)
        if (data) return data
      } catch (error) {
        console.error('KV read error:', error)
      }
    }
    
    // Fallback to file system
    try {
      const filePath = path.join(this.dataDir, filename)
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('File read error:', error)
      return null
    }
  }

  async write(filename, data) {
    const key = filename.replace('.json', '')
    
    // Write to Vercel KV if available
    if (this.kv) {
      try {
        await this.kv.set(key, data)
        console.log(`Saved to KV: ${key}`)
      } catch (error) {
        console.error('KV write error:', error)
      }
    }
    
    // Always write to file system in development
    if (!isProduction) {
      try {
        const filePath = path.join(this.dataDir, filename)
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
        console.log(`Saved to file: ${filename}`)
      } catch (error) {
        console.error('File write error:', error)
      }
    }
    
    return data
  }
}

export const db = new Database()

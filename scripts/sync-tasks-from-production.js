#!/usr/bin/env node

/**
 * Sync tasks from production to local development
 * Usage: node scripts/sync-tasks-from-production.js [production-url]
 * Example: node scripts/sync-tasks-from-production.js https://pencilz.vercel.app
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const productionUrl = process.argv[2] || process.env.PRODUCTION_URL

if (!productionUrl) {
  console.error('❌ Error: Production URL required')
  console.log('Usage: node scripts/sync-tasks-from-production.js <production-url>')
  console.log('Example: node scripts/sync-tasks-from-production.js https://pencilz.vercel.app')
  process.exit(1)
}

async function syncTasks() {
  try {
    console.log(`📡 Fetching tasks from ${productionUrl}...`)
    
    const response = await fetch(`${productionUrl}/api/tasks/export`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    console.log(`✅ Received ${data.tasks.length} tasks from ${data.source}`)
    console.log(`📅 Exported at: ${new Date(data.exportedAt).toLocaleString()}`)
    
    // Write to local tasks.json
    const tasksPath = path.join(__dirname, '..', 'public', 'data', 'tasks.json')
    const tasksData = { tasks: data.tasks }
    
    fs.writeFileSync(tasksPath, JSON.stringify(tasksData, null, 2))
    
    console.log(`💾 Saved to ${tasksPath}`)
    console.log('✨ Sync complete!')
    
    // Show summary
    const statusCounts = data.tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    }, {})
    
    console.log('\n📊 Task Summary:')
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`)
    })
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message)
    process.exit(1)
  }
}

syncTasks()

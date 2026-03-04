#!/usr/bin/env node

/**
 * Sync task status from local to production
 * - Marks completed local tasks as completed on production
 * - Optionally removes completed tasks from production
 * Usage: node scripts/sync-task-status.js [production-url] [--remove-completed]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)
const productionUrl = args.find(arg => !arg.startsWith('--')) || process.env.PRODUCTION_URL
const removeCompleted = args.includes('--remove-completed')

if (!productionUrl) {
  console.error('❌ Error: Production URL required')
  console.log('Usage: node scripts/sync-task-status.js <production-url> [--remove-completed]')
  console.log('Example: node scripts/sync-task-status.js https://pencilz2026.vercel.app')
  console.log('Example: node scripts/sync-task-status.js https://pencilz2026.vercel.app --remove-completed')
  process.exit(1)
}

async function readLocalTasks() {
  const filePath = path.join(__dirname, '..', 'public', 'data', 'tasks.json')
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

async function fetchProductionTasks() {
  try {
    console.log('📥 Fetching tasks from production...')
    const response = await fetch(`${productionUrl}/api/tasks/export`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`✅ Fetched ${data.tasks.length} tasks from production`)
    return data.tasks
    
  } catch (error) {
    console.error('❌ Failed to fetch production tasks:', error.message)
    throw error
  }
}

async function pushTasksToProduction(tasks) {
  try {
    console.log('📤 Pushing updated tasks to production...')
    
    const response = await fetch(`${productionUrl}/api/tasks/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const result = await response.json()
    console.log(`✅ Tasks pushed successfully (${result.count} tasks)`)
    return result
    
  } catch (error) {
    console.error('❌ Failed to push tasks:', error.message)
    throw error
  }
}

async function syncTaskStatus() {
  console.log(`🚀 Syncing task status to ${productionUrl}\n`)
  
  // Read local tasks
  const localData = await readLocalTasks()
  const localTasks = localData.tasks || []
  
  // Fetch production tasks
  const productionTasks = await fetchProductionTasks()
  
  // Create a map of local task statuses by ID
  const localTaskMap = new Map()
  localTasks.forEach(task => {
    localTaskMap.set(task.id, {
      status: task.status,
      fixedBy: task.fixedBy,
      updatedAt: task.updatedAt
    })
  })
  
  // Update production tasks based on local status
  let updatedCount = 0
  let removedCount = 0
  
  const updatedTasks = productionTasks.filter(prodTask => {
    const localStatus = localTaskMap.get(prodTask.id)
    
    if (localStatus) {
      // Task exists locally
      if (localStatus.status === 'completed' && prodTask.status !== 'completed') {
        // Mark as completed on production
        prodTask.status = 'completed'
        prodTask.fixedBy = localStatus.fixedBy || 'kiro'
        prodTask.updatedAt = localStatus.updatedAt || new Date().toISOString()
        updatedCount++
        console.log(`✓ Marking task ${prodTask.id} as completed`)
      }
      
      // Remove completed tasks if flag is set
      if (removeCompleted && localStatus.status === 'completed') {
        removedCount++
        console.log(`🗑️  Removing completed task ${prodTask.id}`)
        return false // Filter out this task
      }
    }
    
    return true // Keep this task
  })
  
  // Push updated tasks back to production
  if (updatedCount > 0 || removedCount > 0) {
    await pushTasksToProduction(updatedTasks)
  } else {
    console.log('ℹ️  No task status changes to sync')
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Sync Summary')
  console.log('='.repeat(50))
  console.log(`✅ Tasks marked as completed: ${updatedCount}`)
  if (removeCompleted) {
    console.log(`🗑️  Tasks removed: ${removedCount}`)
  }
  console.log(`📋 Total tasks on production: ${updatedTasks.length}`)
  console.log('\n✨ Sync complete!')
}

syncTaskStatus().catch(error => {
  console.error('\n❌ Sync failed:', error)
  process.exit(1)
})

#!/usr/bin/env node

/**
 * Mark specific tasks as completed in local tasks.json
 * Usage: node scripts/mark-tasks-completed.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Task IDs that have been fixed
const completedTaskIds = [
  'ZUWFZU', // Scroll to top on page change - Fixed in Layout.jsx
  'OW6XOW', // Terms page alignment - Fixed in Terms.jsx
  'S30GS3', // Hero links to services - Fixed (Button component handles routing)
  '4CMH4C', // Email link in nav - Fixed in Navigation.jsx
  'AZZ2AZ', // Close other cards when opening one - Fixed in Home.jsx (single state)
]

const tasksFilePath = path.join(__dirname, '..', 'public', 'data', 'tasks.json')

try {
  // Read current tasks
  const tasksData = JSON.parse(fs.readFileSync(tasksFilePath, 'utf-8'))
  
  let updatedCount = 0
  
  // Update tasks
  tasksData.tasks = tasksData.tasks.map(task => {
    if (completedTaskIds.includes(task.id) && task.status !== 'completed') {
      updatedCount++
      console.log(`✓ Marking task ${task.id} as completed`)
      console.log(`  Comment: ${task.comment}`)
      return {
        ...task,
        status: 'completed',
        fixedBy: 'kiro',
        updatedAt: new Date().toISOString()
      }
    }
    return task
  })
  
  // Write updated tasks back to file
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasksData, null, 2))
  
  console.log(`\n✨ Updated ${updatedCount} tasks to completed status`)
  console.log(`📝 File saved: ${tasksFilePath}`)
  
} catch (error) {
  console.error('❌ Error updating tasks:', error.message)
  process.exit(1)
}

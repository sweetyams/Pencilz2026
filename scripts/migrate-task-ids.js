#!/usr/bin/env node

/**
 * Migrate task IDs from UUIDs to 6-character alphanumeric IDs
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const generateShortId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const randomBytes = crypto.randomBytes(4)
  for (let i = 0; i < 6; i++) {
    result += chars[randomBytes[i % 4] % chars.length]
  }
  return result
}

const tasksFile = path.join(__dirname, '..', 'public', 'data', 'tasks.json')

try {
  const data = JSON.parse(fs.readFileSync(tasksFile, 'utf-8'))
  const tasks = data.tasks || []
  
  console.log(`📋 Found ${tasks.length} tasks to migrate`)
  
  const usedIds = new Set()
  const idMap = {}
  
  tasks.forEach((task, index) => {
    if (task.id.includes('-')) {
      // Generate unique 6-character ID
      let newId = generateShortId()
      while (usedIds.has(newId)) {
        newId = generateShortId()
      }
      usedIds.add(newId)
      idMap[task.id] = newId
      task.id = newId
      console.log(`✅ Task ${index + 1}: ${Object.keys(idMap)[Object.keys(idMap).length - 1].substring(0, 8)}... → ${newId}`)
    } else {
      console.log(`⏭️  Task ${index + 1}: Already has short ID (${task.id})`)
    }
  })
  
  fs.writeFileSync(tasksFile, JSON.stringify(data, null, 2))
  console.log(`\n✨ Migration complete! Updated ${Object.keys(idMap).length} task IDs`)
  
} catch (error) {
  console.error('❌ Migration failed:', error.message)
  process.exit(1)
}

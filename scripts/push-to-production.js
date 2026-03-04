#!/usr/bin/env node

/**
 * Push all local content to production
 * Migrates: users, projects, news, pages, settings (excludes tasks)
 * Usage: node scripts/push-to-production.js [production-url]
 * Example: node scripts/push-to-production.js https://pencilz.vercel.app
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const productionUrl = process.argv[2] || process.env.PRODUCTION_URL

if (!productionUrl) {
  console.error('❌ Error: Production URL required')
  console.log('Usage: node scripts/push-to-production.js <production-url>')
  console.log('Example: node scripts/push-to-production.js https://pencilz.vercel.app')
  process.exit(1)
}

// Data files to migrate
const dataFiles = [
  { name: 'users', path: 'users.json', endpoint: '/api/users/import' },
  { name: 'projects', path: 'projects.json', endpoint: '/api/projects/import' },
  { name: 'news', path: 'news.json', endpoint: '/api/news/import' },
  { name: 'team', path: 'team.json', endpoint: '/api/team/import' },
  { name: 'pages', path: 'pages.json', endpoint: '/api/pages/import' },
  { name: 'settings', path: 'settings.json', endpoint: '/api/settings/import' },
  { name: 'tasks', path: 'tasks.json', endpoint: '/api/tasks/import' }
]

async function readLocalData(filename) {
  const filePath = path.join(__dirname, '..', 'public', 'data', filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

async function pushData(endpoint, data, dataName) {
  try {
    console.log(`📤 Pushing ${dataName}...`)
    
    const response = await fetch(`${productionUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const result = await response.json()
    console.log(`✅ ${dataName} pushed successfully`)
    return result
    
  } catch (error) {
    console.error(`❌ Failed to push ${dataName}:`, error.message)
    throw error
  }
}

async function migrateAll() {
  console.log(`🚀 Starting migration to ${productionUrl}\n`)
  
  const results = {
    success: [],
    failed: []
  }
  
  for (const file of dataFiles) {
    try {
      const data = await readLocalData(file.path)
      await pushData(file.endpoint, data, file.name)
      results.success.push(file.name)
    } catch (error) {
      results.failed.push({ name: file.name, error: error.message })
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary')
  console.log('='.repeat(50))
  
  if (results.success.length > 0) {
    console.log(`\n✅ Successfully migrated (${results.success.length}):`)
    results.success.forEach(name => console.log(`   - ${name}`))
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed to migrate (${results.failed.length}):`)
    results.failed.forEach(({ name, error }) => {
      console.log(`   - ${name}: ${error}`)
    })
    process.exit(1)
  }
  
  console.log('\n✨ Migration complete!')
}

migrateAll()

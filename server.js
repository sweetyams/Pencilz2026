import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from './lib/db.js'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true
    : 'http://localhost:5173',
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed. Received: ${file.mimetype} (${ext})`))
  }
}

const upload = multer({ storage, fileFilter })

const projectsFile = path.join(__dirname, 'public/data/projects.json')
const newsFile = path.join(__dirname, 'public/data/news.json')
const settingsFile = path.join(__dirname, 'public/data/settings.json')
const pagesFile = path.join(__dirname, 'public/data/pages.json')
const usersFile = path.join(__dirname, 'public/data/users.json')

// Helper functions for user management
const readUsers = async () => {
  try {
    const data = await db.read('users.json')
    return data?.users || []
  } catch (error) {
    return []
  }
}

const writeUsers = async (users) => {
  await db.write('users.json', { users })
}

const hashPassword = async (password) => {
  return bcrypt.hashSync(password, 10)
}

const verifyPassword = async (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

// Generate a 6-character alphanumeric ID
const generateShortId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const randomBytes = crypto.randomBytes(4)
  for (let i = 0; i < 6; i++) {
    result += chars[randomBytes[i % 4] % chars.length]
  }
  return result
}

// Helper functions for task management
const readTasks = async () => {
  try {
    const data = await db.read('tasks.json')
    return data?.tasks || []
  } catch (error) {
    return []
  }
}

const writeTasks = async (tasks) => {
  await db.write('tasks.json', { tasks })
}

// Export tasks endpoint for syncing from production
app.get('/api/tasks/export', async (req, res) => {
  try {
    const tasks = await readTasks()
    res.json({ 
      tasks,
      exportedAt: new Date().toISOString(),
      source: process.env.NODE_ENV === 'production' ? 'production' : 'development'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Import tasks endpoint for syncing to local
app.post('/api/tasks/import', async (req, res) => {
  try {
    const { tasks } = req.body
    
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Tasks must be an array' })
    }
    
    await writeTasks(tasks)
    
    res.json({ 
      success: true,
      count: tasks.length,
      importedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Quick sync endpoint - just hit this URL to sync from production
app.get('/api/tasks/sync-from-production', async (req, res) => {
  const productionUrl = process.env.PRODUCTION_URL || 'https://pencilz2026.vercel.app'
  
  try {
    console.log(`🔄 Syncing tasks from ${productionUrl}...`)
    
    // Fetch from production
    const response = await fetch(`${productionUrl}/api/tasks/export`)
    if (!response.ok) {
      throw new Error(`Failed to fetch from production: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`✅ Received ${data.tasks.length} tasks`)
    
    // Save locally
    await writeTasks(data.tasks)
    console.log(`💾 Saved to local database`)
    
    res.json({
      success: true,
      message: `Synced ${data.tasks.length} tasks from production`,
      tasks: data.tasks,
      source: productionUrl,
      syncedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Sync failed:', error)
    res.status(500).json({ 
      success: false,
      error: error.message 
    })
  }
})

// Import endpoints for content migration
app.post('/api/users/import', async (req, res) => {
  try {
    const { users } = req.body
    
    if (!Array.isArray(users)) {
      return res.status(400).json({ error: 'Users must be an array' })
    }
    
    await writeUsers(users)
    
    res.json({ 
      success: true,
      count: users.length,
      importedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/projects/import', async (req, res) => {
  try {
    const projects = req.body
    
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: 'Projects must be an array' })
    }
    
    await db.write('projects.json', projects)
    
    res.json({ 
      success: true,
      count: projects.length,
      importedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/news/import', async (req, res) => {
  try {
    const news = req.body
    
    if (!Array.isArray(news)) {
      return res.status(400).json({ error: 'News must be an array' })
    }
    
    await db.write('news.json', news)
    
    res.json({ 
      success: true,
      count: news.length,
      importedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/pages/import', async (req, res) => {
  try {
    const pages = req.body
    
    if (typeof pages !== 'object' || Array.isArray(pages)) {
      return res.status(400).json({ error: 'Pages must be an object' })
    }
    
    await db.write('pages.json', pages)
    
    res.json({ 
      success: true,
      count: Object.keys(pages).length,
      importedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/settings/import', async (req, res) => {
  try {
    const settings = req.body
    
    if (typeof settings !== 'object' || Array.isArray(settings)) {
      return res.status(400).json({ error: 'Settings must be an object' })
    }
    
    await db.write('settings.json', settings)
    
    res.json({ 
      success: true,
      importedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    console.log('✅ File uploaded:', req.file.filename, 'Type:', req.file.mimetype)
    // Return relative URL so it works in both dev and production
    res.json({ url: `/uploads/${req.file.filename}` })
  } else {
    console.error('❌ No file uploaded')
    res.status(400).json({ error: 'No file uploaded' })
  }
})

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('❌ Multer error:', error.message)
    return res.status(400).json({ error: `Upload error: ${error.message}` })
  } else if (error) {
    console.error('❌ Upload error:', error.message)
    return res.status(400).json({ error: error.message })
  }
  next()
})

// Projects endpoints
app.get('/api/projects', async (req, res) => {
  try {
    const data = await db.read('projects.json')
    res.json(data || [])
  } catch (error) {
    res.json([])
  }
})

app.post('/api/projects', async (req, res) => {
  try {
    const projects = await db.read('projects.json') || []
    const newProject = {
      ...req.body,
      id: Date.now(),
      services: typeof req.body.services === 'string' 
        ? req.body.services.split(',').map(s => s.trim())
        : req.body.services
    }
    projects.push(newProject)
    await db.write('projects.json', projects)
    res.json(newProject)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/projects/:id', async (req, res) => {
  try {
    const projects = await db.read('projects.json') || []
    const index = projects.findIndex(p => p.id === parseInt(req.params.id))
    if (index !== -1) {
      projects[index] = {
        ...req.body,
        id: parseInt(req.params.id),
        services: typeof req.body.services === 'string'
          ? req.body.services.split(',').map(s => s.trim())
          : req.body.services
      }
      await db.write('projects.json', projects)
      res.json(projects[index])
    } else {
      res.status(404).json({ error: 'Project not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const projects = await db.read('projects.json') || []
    const filtered = projects.filter(p => p.id !== parseInt(req.params.id))
    await db.write('projects.json', filtered)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// News endpoints
app.get('/api/news', async (req, res) => {
  try {
    const data = await db.read('news.json')
    res.json(data || [])
  } catch (error) {
    res.json([])
  }
})

app.post('/api/news', async (req, res) => {
  try {
    const news = await db.read('news.json') || []
    const newItem = { ...req.body, id: Date.now() }
    news.push(newItem)
    await db.write('news.json', news)
    res.json(newItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/news/:id', async (req, res) => {
  try {
    const news = await db.read('news.json') || []
    const index = news.findIndex(n => n.id === parseInt(req.params.id))
    if (index !== -1) {
      news[index] = { ...req.body, id: parseInt(req.params.id) }
      await db.write('news.json', news)
      res.json(news[index])
    } else {
      res.status(404).json({ error: 'News not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/news/:id', async (req, res) => {
  try {
    const news = await db.read('news.json') || []
    const filtered = news.filter(n => n.id !== parseInt(req.params.id))
    await db.write('news.json', filtered)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Team endpoints
app.get('/api/team', async (req, res) => {
  try {
    const data = await db.read('team.json')
    res.json(data || [])
  } catch (error) {
    res.json([])
  }
})

app.post('/api/team', async (req, res) => {
  try {
    const team = await db.read('team.json') || []
    const newMember = { ...req.body, id: Date.now() }
    team.push(newMember)
    await db.write('team.json', team)
    res.json(newMember)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/team/:id', async (req, res) => {
  try {
    const team = await db.read('team.json') || []
    const index = team.findIndex(m => m.id === parseInt(req.params.id))
    if (index !== -1) {
      team[index] = { ...req.body, id: parseInt(req.params.id) }
      await db.write('team.json', team)
      res.json(team[index])
    } else {
      res.status(404).json({ error: 'Team member not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/team/:id', async (req, res) => {
  try {
    const team = await db.read('team.json') || []
    const filtered = team.filter(m => m.id !== parseInt(req.params.id))
    await db.write('team.json', filtered)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Settings endpoints
app.get('/api/settings', async (req, res) => {
  try {
    const data = await db.read('settings.json')
    res.json(data || { logo: '', email: '', companyName: '' })
  } catch (error) {
    res.json({ logo: '', email: '', companyName: '' })
  }
})

app.put('/api/settings', async (req, res) => {
  try {
    await db.write('settings.json', req.body)
    res.json(req.body)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Pages endpoints
app.get('/api/pages', async (req, res) => {
  try {
    const data = await db.read('pages.json')
    res.json(data || {})
  } catch (error) {
    res.json({})
  }
})

app.get('/api/pages/:pageName', async (req, res) => {
  try {
    const pages = await db.read('pages.json') || {}
    res.json(pages[req.params.pageName] || {})
  } catch (error) {
    res.json({})
  }
})

app.put('/api/pages/:pageName', async (req, res) => {
  try {
    const pages = await db.read('pages.json') || {}
    pages[req.params.pageName] = req.body
    await db.write('pages.json', pages)
    res.json(pages[req.params.pageName])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }
    
    const users = await readUsers()
    const user = users.find(u => u.username === username)
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    
    const isValid = await verifyPassword(password, user.passwordHash)
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    
    // Return user without password hash
    res.json({
      user: {
        id: user.id,
        username: user.username
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// User management endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await readUsers()
    // Exclude password hashes from response
    const safeUsers = users.map(({ passwordHash, ...user }) => user)
    res.json({ users: safeUsers })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    
    const users = await readUsers()
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' })
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      username,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    await writeUsers(users)
    
    // Return user without password hash
    const { passwordHash, ...safeUser } = newUser
    res.status(201).json({ user: safeUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/users/:id', async (req, res) => {
  try {
    const { username, password } = req.body
    const users = await readUsers()
    const index = users.findIndex(u => u.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Check if new username conflicts with another user
    if (username && username !== users[index].username) {
      if (users.find(u => u.username === username && u.id !== req.params.id)) {
        return res.status(400).json({ error: 'Username already exists' })
      }
      users[index].username = username
    }
    
    // Update password if provided
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' })
      }
      users[index].passwordHash = await hashPassword(password)
    }
    
    await writeUsers(users)
    
    // Return user without password hash
    const { passwordHash, ...safeUser } = users[index]
    res.json({ user: safeUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/users/:id', async (req, res) => {
  try {
    const users = await readUsers()
    const filtered = users.filter(u => u.id !== req.params.id)
    
    if (filtered.length === users.length) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    await writeUsers(filtered)
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Task management endpoints
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await readTasks()
    res.json({ tasks })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/tasks', async (req, res) => {
  try {
    const { pageUrl, selector, comment, creator, screenshot, metadata } = req.body
    
    // Validate required fields
    if (!pageUrl || !selector || !comment || !creator) {
      return res.status(400).json({ error: 'Missing required fields: pageUrl, selector, comment, creator' })
    }
    
    if (comment.length < 10) {
      return res.status(400).json({ error: 'Comment must be at least 10 characters' })
    }
    
    const tasks = await readTasks()
    const now = new Date().toISOString()
    
    // Generate unique 6-character ID
    let taskId = generateShortId()
    while (tasks.some(t => t.id === taskId)) {
      taskId = generateShortId()
    }
    
    const newTask = {
      id: taskId,
      pageUrl,
      selector,
      comment,
      creator,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      ...(screenshot && { screenshot }), // Include screenshot if provided
      ...(metadata && { metadata }) // Include metadata if provided
    }
    
    tasks.push(newTask)
    await writeTasks(tasks)
    
    res.status(201).json({ task: newTask })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await readTasks()
    const index = tasks.findIndex(t => t.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    const { status, comment } = req.body
    
    // Validate status if provided
    if (status) {
      const validStatuses = ['open', 'in-progress', 'completed', 'archived']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: open, in-progress, completed, archived' })
      }
      tasks[index].status = status
    }
    
    // Update comment if provided
    if (comment !== undefined) {
      if (comment.length < 10) {
        return res.status(400).json({ error: 'Comment must be at least 10 characters' })
      }
      tasks[index].comment = comment
    }
    
    tasks[index].updatedAt = new Date().toISOString()
    
    await writeTasks(tasks)
    res.json({ task: tasks[index] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await readTasks()
    const filtered = tasks.filter(t => t.id !== req.params.id)
    
    if (filtered.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    await writeTasks(filtered)
    res.json({ message: 'Task deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

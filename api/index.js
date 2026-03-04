import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { put } from '@vercel/blob'
import { db } from '../lib/db.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// File upload configuration - use memory storage for Vercel
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
  limits: {
    fileSize: 4.5 * 1024 * 1024 // 4.5MB limit for Vercel Blob
  }
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

// Upload endpoint - use Vercel Blob storage
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Upload to Vercel Blob
    const filename = `${Date.now()}-${req.file.originalname}`
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype
    })

    res.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Debug endpoint to check database status
app.get('/api/db-status', async (req, res) => {
  await db.ensureInitialized()
  res.json({
    storageType: db.storageType,
    isProduction: process.env.VERCEL === '1',
    hasRedisUrl: !!process.env.REDIS_URL,
    hasKvUrl: !!process.env.KV_REST_API_URL,
    hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL
  })
})

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

// Export tasks endpoint for syncing from production
app.get('/api/tasks/export', async (req, res) => {
  try {
    const tasks = await readTasks()
    res.json({ 
      tasks,
      exportedAt: new Date().toISOString(),
      source: process.env.VERCEL === '1' ? 'production' : 'development'
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

app.post('/api/team/import', async (req, res) => {
  try {
    const team = req.body
    
    if (!Array.isArray(team)) {
      return res.status(400).json({ error: 'Team must be an array' })
    }
    
    await db.write('team.json', team)
    
    res.json({ 
      success: true,
      count: team.length,
      importedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default app

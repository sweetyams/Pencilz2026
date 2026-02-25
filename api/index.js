import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import { db } from '../lib/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, '../public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '../public/uploads')))

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

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  res.json({ url: `/uploads/${req.file.filename}` })
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

export default app

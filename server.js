import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from './lib/db.js'
import dotenv from 'dotenv'

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
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.'))
  }
}

const upload = multer({ storage, fileFilter })

const projectsFile = path.join(__dirname, 'public/data/projects.json')
const newsFile = path.join(__dirname, 'public/data/news.json')
const settingsFile = path.join(__dirname, 'public/data/settings.json')
const pagesFile = path.join(__dirname, 'public/data/pages.json')

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ url: `/uploads/${req.file.filename}` })
  } else {
    res.status(400).json({ error: 'No file uploaded' })
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

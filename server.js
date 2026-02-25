import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
app.get('/api/projects', (req, res) => {
  try {
    const data = fs.readFileSync(projectsFile, 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    res.json([])
  }
})

app.post('/api/projects', (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'))
    const newProject = {
      ...req.body,
      id: Date.now(),
      services: typeof req.body.services === 'string' 
        ? req.body.services.split(',').map(s => s.trim())
        : req.body.services
    }
    projects.push(newProject)
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2))
    res.json(newProject)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/projects/:id', (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'))
    const index = projects.findIndex(p => p.id === parseInt(req.params.id))
    if (index !== -1) {
      projects[index] = {
        ...req.body,
        id: parseInt(req.params.id),
        services: typeof req.body.services === 'string'
          ? req.body.services.split(',').map(s => s.trim())
          : req.body.services
      }
      fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2))
      res.json(projects[index])
    } else {
      res.status(404).json({ error: 'Project not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/projects/:id', (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'))
    const filtered = projects.filter(p => p.id !== parseInt(req.params.id))
    fs.writeFileSync(projectsFile, JSON.stringify(filtered, null, 2))
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// News endpoints
app.get('/api/news', (req, res) => {
  try {
    const data = fs.readFileSync(newsFile, 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    res.json([])
  }
})

app.post('/api/news', (req, res) => {
  try {
    const news = JSON.parse(fs.readFileSync(newsFile, 'utf8'))
    const newItem = { ...req.body, id: Date.now() }
    news.push(newItem)
    fs.writeFileSync(newsFile, JSON.stringify(news, null, 2))
    res.json(newItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/news/:id', (req, res) => {
  try {
    const news = JSON.parse(fs.readFileSync(newsFile, 'utf8'))
    const index = news.findIndex(n => n.id === parseInt(req.params.id))
    if (index !== -1) {
      news[index] = { ...req.body, id: parseInt(req.params.id) }
      fs.writeFileSync(newsFile, JSON.stringify(news, null, 2))
      res.json(news[index])
    } else {
      res.status(404).json({ error: 'News not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/news/:id', (req, res) => {
  try {
    const news = JSON.parse(fs.readFileSync(newsFile, 'utf8'))
    const filtered = news.filter(n => n.id !== parseInt(req.params.id))
    fs.writeFileSync(newsFile, JSON.stringify(filtered, null, 2))
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Settings endpoints
app.get('/api/settings', (req, res) => {
  try {
    const data = fs.readFileSync(settingsFile, 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    res.json({ logo: '', email: '', companyName: '' })
  }
})

app.put('/api/settings', (req, res) => {
  try {
    fs.writeFileSync(settingsFile, JSON.stringify(req.body, null, 2))
    res.json(req.body)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Pages endpoints
app.get('/api/pages', (req, res) => {
  try {
    const data = fs.readFileSync(pagesFile, 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    res.json({})
  }
})

app.get('/api/pages/:pageName', (req, res) => {
  try {
    const pages = JSON.parse(fs.readFileSync(pagesFile, 'utf8'))
    res.json(pages[req.params.pageName] || {})
  } catch (error) {
    res.json({})
  }
})

app.put('/api/pages/:pageName', (req, res) => {
  try {
    const pages = JSON.parse(fs.readFileSync(pagesFile, 'utf8'))
    pages[req.params.pageName] = req.body
    fs.writeFileSync(pagesFile, JSON.stringify(pages, null, 2))
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

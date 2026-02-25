import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

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

// Helper functions
const getDataPath = (filename) => join(__dirname, '../public/data', filename)

const readJSON = (filename) => {
  try {
    const data = fs.readFileSync(getDataPath(filename), 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return filename === 'projects.json' ? [] : 
           filename === 'news.json' ? [] : 
           filename === 'settings.json' ? {} : 
           {}
  }
}

const writeJSON = (filename, data) => {
  fs.writeFileSync(getDataPath(filename), JSON.stringify(data, null, 2))
}

// Projects endpoints
app.get('/api/projects', (req, res) => {
  res.json(readJSON('projects.json'))
})

app.post('/api/projects', (req, res) => {
  const projects = readJSON('projects.json')
  const newProject = { ...req.body, id: Date.now() }
  projects.push(newProject)
  writeJSON('projects.json', projects)
  res.json(newProject)
})

app.put('/api/projects/:id', (req, res) => {
  const projects = readJSON('projects.json')
  const index = projects.findIndex(p => p.id === parseInt(req.params.id))
  if (index !== -1) {
    projects[index] = { ...projects[index], ...req.body }
    writeJSON('projects.json', projects)
    res.json(projects[index])
  } else {
    res.status(404).json({ error: 'Project not found' })
  }
})

app.delete('/api/projects/:id', (req, res) => {
  let projects = readJSON('projects.json')
  projects = projects.filter(p => p.id !== parseInt(req.params.id))
  writeJSON('projects.json', projects)
  res.json({ success: true })
})

// News endpoints
app.get('/api/news', (req, res) => {
  res.json(readJSON('news.json'))
})

app.post('/api/news', (req, res) => {
  const news = readJSON('news.json')
  const newArticle = { ...req.body, id: Date.now() }
  news.push(newArticle)
  writeJSON('news.json', news)
  res.json(newArticle)
})

app.put('/api/news/:id', (req, res) => {
  const news = readJSON('news.json')
  const index = news.findIndex(n => n.id === parseInt(req.params.id))
  if (index !== -1) {
    news[index] = { ...news[index], ...req.body }
    writeJSON('news.json', news)
    res.json(news[index])
  } else {
    res.status(404).json({ error: 'Article not found' })
  }
})

app.delete('/api/news/:id', (req, res) => {
  let news = readJSON('news.json')
  news = news.filter(n => n.id !== parseInt(req.params.id))
  writeJSON('news.json', news)
  res.json({ success: true })
})

// Settings endpoints
app.get('/api/settings', (req, res) => {
  res.json(readJSON('settings.json'))
})

app.put('/api/settings', (req, res) => {
  writeJSON('settings.json', req.body)
  res.json(req.body)
})

// Pages endpoints
app.get('/api/pages/:pageName', (req, res) => {
  const pages = readJSON('pages.json')
  res.json(pages[req.params.pageName] || {})
})

app.put('/api/pages/:pageName', (req, res) => {
  const pages = readJSON('pages.json')
  pages[req.params.pageName] = req.body
  writeJSON('pages.json', pages)
  res.json(req.body)
})

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  res.json({ url: `/uploads/${req.file.filename}` })
})

export default app

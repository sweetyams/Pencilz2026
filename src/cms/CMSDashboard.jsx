import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProjectForm from './ProjectForm'
import SettingsForm from './SettingsForm'
import HomePageForm from './HomePageForm'
import NewsForm from './NewsForm'
import PageEditor from './PageEditor'
import { API_URL } from '../config'

const CMSDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [news, setNews] = useState([])
  const [editingProject, setEditingProject] = useState(null)
  const [editingNews, setEditingNews] = useState(null)
  const [editingPage, setEditingPage] = useState(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const loadProjects = () => {
    fetch(`${API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setProjects([]))
  }

  const loadNews = () => {
    fetch(`${API_URL}/api/news`)
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(() => setNews([]))
  }

  useEffect(() => {
    loadProjects()
    loadNews()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/cms/login')
  }

  const handleSaveProject = async (project) => {
    try {
      const url = project.id 
        ? `${API_URL}/api/projects/${project.id}`
        : `${API_URL}/api/projects`
      
      const method = project.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })
      
      if (response.ok) {
        loadProjects()
        setEditingProject(null)
        alert('Project saved successfully!')
      }
    } catch (error) {
      alert('Error saving project: ' + error.message)
    }
  }

  const handleDeleteProject = async (id) => {
    if (confirm('Delete this project?')) {
      try {
        const response = await fetch(`${API_URL}/api/projects/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadProjects()
        }
      } catch (error) {
        alert('Error deleting project: ' + error.message)
      }
    }
  }

  const handleSaveNews = async (newsItem) => {
    try {
      const url = newsItem.id 
        ? `${API_URL}/api/news/${newsItem.id}`
        : `${API_URL}/api/news`
      
      const method = newsItem.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsItem)
      })
      
      if (response.ok) {
        loadNews()
        setEditingNews(null)
        alert('News saved successfully!')
      }
    } catch (error) {
      alert('Error saving news: ' + error.message)
    }
  }

  const handleDeleteNews = async (id) => {
    if (confirm('Delete this news item?')) {
      try {
        const response = await fetch(`${API_URL}/api/news/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadNews()
        }
      } catch (error) {
        alert('Error deleting news: ' + error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">CMS Dashboard</h1>
          <button onClick={handleLogout} className="text-sm hover:opacity-70">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-2 px-4 ${activeTab === 'projects' ? 'border-b-2 border-black font-bold' : ''}`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`pb-2 px-4 ${activeTab === 'news' ? 'border-b-2 border-black font-bold' : ''}`}
          >
            News & Insights
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`pb-2 px-4 ${activeTab === 'pages' ? 'border-b-2 border-black font-bold' : ''}`}
          >
            Pages
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`pb-2 px-4 ${activeTab === 'home' ? 'border-b-2 border-black font-bold' : ''}`}
          >
            Home Page
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 px-4 ${activeTab === 'settings' ? 'border-b-2 border-black font-bold' : ''}`}
          >
            Settings
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Projects</h2>
              <button
                onClick={() => setEditingProject({})}
                className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80"
              >
                Add Project
              </button>
            </div>

            {editingProject && (
              <ProjectForm
                project={editingProject}
                onSave={handleSaveProject}
                onCancel={() => setEditingProject(null)}
              />
            )}

            <div className="grid gap-4">
              {projects.map(project => (
                <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 flex-1">
                      {project.image && (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-bold">{project.title}</h3>
                        <p className="text-sm text-gray-500">{project.category}</p>
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {project.link}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="text-sm text-blue-600 hover:opacity-70"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-sm text-red-600 hover:opacity-70"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">News & Insights</h2>
              <button
                onClick={() => setEditingNews({})}
                className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80"
              >
                Add News
              </button>
            </div>

            {editingNews && (
              <NewsForm
                newsItem={editingNews}
                onSave={handleSaveNews}
                onCancel={() => setEditingNews(null)}
              />
            )}

            <div className="grid gap-4">
              {news.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 flex-1">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.category} • {item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingNews(item)}
                        className="text-sm text-blue-600 hover:opacity-70"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-sm text-red-600 hover:opacity-70"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <>
            <h2 className="text-2xl font-bold mb-6">Manage Pages</h2>
            
            {editingPage && (
              <PageEditor
                pageName={editingPage}
                onClose={() => setEditingPage(null)}
              />
            )}

            <div className="grid gap-4">
              {['about', 'services', 'faq', 'terms', 'privacy'].map(page => (
                <div key={page} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold capitalize">{page}</h3>
                    <button
                      onClick={() => setEditingPage(page)}
                      className="text-sm text-blue-600 hover:opacity-70"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Home Page Tab */}
        {activeTab === 'home' && <HomePageForm />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <SettingsForm />}
      </div>
    </div>
  )
}

export default CMSDashboard

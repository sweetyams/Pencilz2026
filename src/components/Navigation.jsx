import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navigation = () => {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error loading settings:', err))
  }, [])

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <Link to="/services" className="hover:opacity-70">Services</Link>
            <Link to="/about" className="hover:opacity-70">About</Link>
            <Link to="/" className="hover:opacity-70">Start a project</Link>
          </div>
          <div className="text-right">
            <span className="font-bold">{settings.companyName || 'Pencilz + Friends'}</span>
            <span>, {settings.location || 'Montreal'}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

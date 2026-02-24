import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Footer = () => {
  const [settings, setSettings] = useState({ email: '', logo: '', companyName: '' })

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-white mt-auto w-full" style={{ padding: '20px' }}>
      {/* Logo - Full Width */}
      <div className="mb-8 w-full">
        {settings.logo ? (
          <img 
            src={settings.logo} 
            alt="Pencilz" 
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        ) : (
          <h1 className="text-8xl font-black text-center">PENCILZ</h1>
        )}
      </div>

      {/* Footer links - Full Width with Auto Spacing */}
      <div className="w-full flex justify-between items-center text-base mb-4">
        <Link to="/news" className="hover:opacity-70">News & Insights</Link>
        <Link to="/terms" className="hover:opacity-70">Terms & Conditions</Link>
        <Link to="/privacy" className="hover:opacity-70">Privacy Policy</Link>
        <Link to="/faq" className="hover:opacity-70">Faq</Link>
        <p className="text-gray-600">{settings.companyName}</p>
      </div>
    </footer>
  )
}

export default Footer

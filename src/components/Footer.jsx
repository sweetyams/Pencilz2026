import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LazyImage from './LazyImage'
import { useAuth } from '../contexts/AuthContext'
import { API_URL } from '../config'
import { getImageUrl } from '../utils/imageUrl'

const Footer = ({ onActivateFeedbackMode }) => {
  const [settings, setSettings] = useState({ 
    email: '', 
    logo: '', 
    companyName: '', 
    visualFeedbackEnabled: false,
    footerContactHeading: 'Start a project',
    footerContactButtonText: '',
    footerEmailSubject: "Let's Create Something Amazing Together! 🚀",
    footerEmailBody: `Hi there!\n\nI'm excited to explore the possibility of working together on a project.\n\nHere's what I'm thinking:\n\n[Tell us about your project vision]\n\nLooking forward to bringing this to life!\n\nBest regards`
  })
  const { user } = useAuth()

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  const showAddComments = user && settings.visualFeedbackEnabled

  const emailSubject = encodeURIComponent(settings.footerEmailSubject || "Let's Create Something Amazing Together! 🚀")
  const emailBody = encodeURIComponent(settings.footerEmailBody || `Hi there!\n\nI'm excited to explore the possibility of working together on a project.\n\nHere's what I'm thinking:\n\n[Tell us about your project vision]\n\nLooking forward to bringing this to life!\n\nBest regards`)
  const contactHeading = settings.footerContactHeading || 'Start a project'
  const buttonText = settings.footerContactButtonText || settings.email

  return (
    <footer className="bg-white mt-auto w-full">
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px' }}>
        {/* Contact Section */}
        <div className="w-full flex items-center justify-center pt-12 pb-[100px]">
          <div className="flex flex-col items-center gap-6" style={{ width: '481px', maxWidth: '100%' }}>
            <p className="text-2xl text-black text-center w-full">
              {contactHeading}
            </p>
            <a
              href={`mailto:${settings.email}?subject=${emailSubject}&body=${emailBody}`}
              className="w-full border border-black flex items-center relative rounded-[70px] transition-all duration-300 ease-in-out bg-[#89FED7] border-dashed px-6 py-4 justify-between hover:bg-[#6ee5c3]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-[24px] font-normal text-black">{buttonText}</span>
              {settings.buttonIcon && (
                <img 
                  src={getImageUrl(settings.buttonIcon)} 
                  alt="" 
                  className="w-9 h-auto"
                  style={{ flexShrink: 0 }}
                />
              )}
            </a>
          </div>
        </div>

        {/* Logo - Full Width */}
        <div className="mb-4 w-full">
          <Link to="/">
            {settings.logo ? (
              <LazyImage 
                src={getImageUrl(settings.logo)}
                alt="Pencilz" 
                className="w-full h-auto"
                style={{ display: 'block' }}
                priority={false}
              />
            ) : (
              <h1 className="text-8xl font-black text-center">PENCILZ</h1>
            )}
          </Link>
        </div>

        {/* Footer links - Full Width with Auto Spacing */}
        <div className="w-full flex md:flex-row flex-col md:justify-between md:items-center items-start text-base mb-4 gap-2">
          <Link to="/terms" className="hover:opacity-70">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:opacity-70">Privacy Policy</Link>
          <Link to="/faq" className="hover:opacity-70">Faq</Link>
          <Link to="/" className="text-gray-600 hover:opacity-70">{settings.companyName}</Link>
          {showAddComments && (
            <button
              onClick={onActivateFeedbackMode}
              className="text-blue-600 hover:opacity-70 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Add Comments
            </button>
          )}
          {user && (
            <Link to="/tests" className="text-blue-600 hover:opacity-70">Tests</Link>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer

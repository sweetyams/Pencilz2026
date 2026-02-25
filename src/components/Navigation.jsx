import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const Navigation = () => {
  const [settings, setSettings] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [servicesHover, setServicesHover] = useState(false)
  const [aboutHover, setAboutHover] = useState(false)
  const [hoveredService, setHoveredService] = useState(null)
  const [hoveredAbout, setHoveredAbout] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error loading settings:', err))
  }, [])

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '16px 20px' }}>
          <div className="flex items-center justify-between">
            {/* Left side - Hamburger on mobile, Desktop menu on desktop */}
            <div className="flex items-center">
              {/* Mobile Hamburger */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {settings.hamburgerIcon ? (
                  <img src={settings.hamburgerIcon} alt="Menu" className="w-6 h-6" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex gap-8 items-center">
                {/* Services */}
                <div
                  className="relative"
                  onMouseEnter={() => setServicesHover(true)}
                  onMouseLeave={() => setServicesHover(false)}
                >
                  <button className="hover:font-medium transition-all py-6">
                    Services
                  </button>
                </div>

                {/* About */}
                <div
                  className="relative"
                  onMouseEnter={() => setAboutHover(true)}
                  onMouseLeave={() => setAboutHover(false)}
                >
                  <button className="hover:font-medium transition-all py-6">
                    About
                  </button>
                </div>

                <Link to="/" className="hover:font-medium transition-all py-6">Start a project</Link>
              </div>
            </div>
            
            {/* Right side - Logo on mobile, Company name on desktop */}
            <div className="flex items-center">
              {/* Mobile Logo */}
              {settings.logo && (
                <Link to="/">
                  <img 
                    src={settings.logo} 
                    alt="Pencilz" 
                    className="md:hidden h-5"
                    style={{ height: '20px', width: 'auto' }}
                  />
                </Link>
              )}
              
              {/* Desktop Company Name */}
              <Link to="/" className="hidden md:block text-right hover:opacity-70">
                <span className="font-bold">{settings.companyName || 'Pencilz + Friends'}</span>
                <span>, {settings.location || 'Montreal'}</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-4 pb-4">
              <Link to="/services" className="hover:opacity-70" onClick={() => setIsMenuOpen(false)}>Services</Link>
              <Link to="/about" className="hover:opacity-70" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/" className="hover:opacity-70" onClick={() => setIsMenuOpen(false)}>Start a project</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Services Megamenu */}
      {servicesHover && (
        <div 
          className="bg-white w-full shadow-lg fixed left-0 right-0 z-40"
          style={{ top: '58px', minHeight: '248px' }}
          onMouseEnter={() => setServicesHover(true)}
          onMouseLeave={() => {
            setServicesHover(false)
            setHoveredService(null)
          }}
        >
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '32px 20px' }}>
            <div className="flex flex-col gap-8">
              {/* Services List */}
              <div className="flex flex-wrap gap-2 text-[32px] leading-[1.155]">
                {settings.services && settings.services.map((service, index) => (
                  <Link
                    key={service.id}
                    to={service.link}
                    className="flex items-center gap-1"
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <span 
                      className="transition-colors"
                      style={{ 
                        color: hoveredService === service.id ? '#191919' : '#8c8c8c'
                      }}
                    >
                      {service.name}
                    </span>
                    {index < settings.services.length - 1 && (
                      <span 
                        className="transition-colors"
                        style={{ 
                          color: hoveredService === service.id ? '#191919' : '#8c8c8c'
                        }}
                      >
                        ,
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Description */}
              {settings.servicesDescription && (
                <p className="text-[32px] text-[#191919] max-w-[1156px] leading-[1.155]">
                  {settings.servicesDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* About Megamenu */}
      {aboutHover && (
        <div 
          className="bg-white w-full shadow-lg fixed left-0 right-0 z-40"
          style={{ top: '58px', minHeight: '248px' }}
          onMouseEnter={() => setAboutHover(true)}
          onMouseLeave={() => {
            setAboutHover(false)
            setHoveredAbout(null)
          }}
        >
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '32px 20px' }}>
            <div className="flex flex-col gap-8">
              {/* About List */}
              <div className="flex flex-wrap gap-2 text-[32px] leading-[1.155]">
                {settings.aboutItems && settings.aboutItems.map((item, index) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="flex items-center gap-1"
                    onMouseEnter={() => setHoveredAbout(item.id)}
                    onMouseLeave={() => setHoveredAbout(null)}
                  >
                    <span 
                      className="transition-colors"
                      style={{ 
                        color: hoveredAbout === item.id ? '#191919' : '#8c8c8c'
                      }}
                    >
                      {item.name}
                    </span>
                    {index < settings.aboutItems.length - 1 && (
                      <span 
                        className="transition-colors"
                        style={{ 
                          color: hoveredAbout === item.id ? '#191919' : '#8c8c8c'
                        }}
                      >
                        ,
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Description */}
              {settings.aboutDescription && (
                <p className="text-[32px] text-[#191919] max-w-[1156px] leading-[1.155]">
                  {settings.aboutDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation

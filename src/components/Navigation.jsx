import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import LazyImage from './LazyImage'
import { API_URL } from '../config'

const Navigation = () => {
  const [settings, setSettings] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [megamenuOpen, setMegamenuOpen] = useState(false)
  const [megamenuContent, setMegamenuContent] = useState(null) // 'services' or 'about'
  const [megamenuStyle, setMegamenuStyle] = useState({})
  const [hoveredService, setHoveredService] = useState(null)
  const [hoveredAbout, setHoveredAbout] = useState(null)
  const [hidden, setHidden] = useState(false)
  
  const servicesButtonRef = useRef(null)
  const aboutButtonRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0
    if (current > previous && current > 150) {
      setHidden(true)
      // Close megamenu when hiding nav
      setMegamenuOpen(false)
      setMegamenuContent(null)
    } else {
      setHidden(false)
    }
  })

  const alignMegamenu = (buttonRef) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMegamenuStyle({
        position: 'fixed',
        left: 0,
        right: 0,
        top: `${rect.bottom}px`,
      })
    }
  }

  const handleServicesEnter = () => {
    clearTimeout(closeTimeoutRef.current)
    alignMegamenu(servicesButtonRef)
    setMegamenuContent('services')
    if (!megamenuOpen) {
      setTimeout(() => setMegamenuOpen(true), 100)
    }
  }

  const handleAboutEnter = () => {
    clearTimeout(closeTimeoutRef.current)
    alignMegamenu(aboutButtonRef)
    setMegamenuContent('about')
    if (!megamenuOpen) {
      setTimeout(() => setMegamenuOpen(true), 100)
    }
  }

  const handleMegamenuLeave = () => {
    clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => {
      setMegamenuOpen(false)
      setMegamenuContent(null)
    }, 150)
  }

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error loading settings:', err))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (megamenuOpen && megamenuContent === 'services') {
        alignMegamenu(servicesButtonRef)
      } else if (megamenuOpen && megamenuContent === 'about') {
        alignMegamenu(aboutButtonRef)
      }
    }
    
    const handleScroll = () => {
      if (megamenuOpen && megamenuContent === 'services') {
        alignMegamenu(servicesButtonRef)
      } else if (megamenuOpen && megamenuContent === 'about') {
        alignMegamenu(aboutButtonRef)
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(closeTimeoutRef.current)
    }
  }, [megamenuOpen, megamenuContent])

  return (
    <>
      <motion.nav 
        className="bg-white shadow-sm sticky top-0 z-50 w-full"
        animate={{
          y: hidden ? -100 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-5 md:px-[20px]" style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div className="flex items-center justify-between">
            {/* Left side - Hamburger on mobile, Desktop menu on desktop */}
            <div className="flex items-center">
              {/* Mobile Hamburger */}
              <button 
                className="md:hidden py-6"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {settings.hamburgerIcon ? (
                  <LazyImage 
                    src={settings.hamburgerIcon} 
                    alt="Menu" 
                    className="w-6 h-6"
                    priority={true}
                  />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center -mx-3">
                {/* Services */}
                <div
                  className="relative"
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleMegamenuLeave}
                >
                  <button 
                    ref={servicesButtonRef}
                    className="hover:font-medium transition-all py-6 px-3"
                  >
                    Services
                  </button>
                </div>

                {/* About */}
                <div
                  className="relative"
                  onMouseEnter={handleAboutEnter}
                  onMouseLeave={handleMegamenuLeave}
                >
                  <button 
                    ref={aboutButtonRef}
                    className="hover:font-medium transition-all py-6 px-3"
                  >
                    About
                  </button>
                </div>

                <Link to="/" className="hover:font-medium transition-all py-6 px-3">Start a project</Link>
              </div>
            </div>
            
            {/* Right side - Logo on mobile, Company name on desktop */}
            <div className="flex items-center">
              {/* Mobile Logo */}
              {settings.logo && (
                <Link to="/">
                  <LazyImage 
                    src={settings.logo} 
                    alt="Pencilz" 
                    className="md:hidden h-5"
                    style={{ height: '20px', width: 'auto' }}
                    priority={true}
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
          
          {/* Mobile Menu Dropdown - Combined */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="md:hidden bg-white w-full shadow-lg fixed left-0 right-0 z-40 overflow-hidden" 
                style={{ top: '58px' }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="px-5 py-8">
                  <div className="flex flex-col gap-8">
                    {/* Services Section */}
                    {settings.services && settings.services.length > 0 && (
                      <motion.div 
                        className="flex flex-col gap-4"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                      >
                        <h3 className="text-[16px] font-medium text-[#8c8c8c] uppercase tracking-wide">Services</h3>
                        <div className="flex flex-col gap-3">
                          {settings.services.map((service, index) => (
                            <motion.div
                              key={service.id}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.15 + index * 0.05, duration: 0.2 }}
                            >
                              <Link
                                to={service.link}
                                className="text-[24px] text-[#191919] leading-[1.155] hover:opacity-70"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {service.name}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* About Section */}
                    {settings.aboutItems && settings.aboutItems.length > 0 && (
                      <motion.div 
                        className="flex flex-col gap-4"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.2 }}
                      >
                        <h3 className="text-[16px] font-medium text-[#8c8c8c] uppercase tracking-wide">About</h3>
                        <div className="flex flex-col gap-3">
                          {settings.aboutItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.25 + index * 0.05, duration: 0.2 }}
                            >
                              <Link
                                to={item.link}
                                className="text-[24px] text-[#191919] leading-[1.155] hover:opacity-70"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Start a project */}
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.2 }}
                    >
                      <Link 
                        to="/" 
                        className="text-[24px] text-[#191919] leading-[1.155] hover:opacity-70 pt-4 border-t border-gray-200 block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Start a project
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Single Megamenu - Content changes based on state */}
      <AnimatePresence>
        {megamenuOpen && (
          <motion.div
            className="hidden md:block bg-white w-full shadow-lg z-[1000]"
            style={megamenuStyle}
            onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
            onMouseLeave={handleMegamenuLeave}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div 
              className="px-5 md:px-[20px] py-8" 
              style={{ maxWidth: '1600px', margin: '0 auto' }}
            >
              <AnimatePresence mode="wait">
                {megamenuContent === 'services' && (
                  <motion.div 
                    key="services"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="flex flex-col gap-8"
                  >
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
                  </motion.div>
                )}

                {megamenuContent === 'about' && (
                  <motion.div 
                    key="about"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="flex flex-col gap-8"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation

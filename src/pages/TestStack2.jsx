import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Button from '../components/Button'
import LazyImage from '../components/LazyImage'
import { API_URL } from '../config'
import { getImageUrl } from '../utils/imageUrl'

// Separate component for animated card to avoid hook issues
const AnimatedCard = ({ project, index, scrollYProgress, cardHeight, peekOffset, animStart, animEnd, cardGap, cardRef, isOpen, onToggle }) => {
  // Account for the 20px padding on top and bottom of each card (40px total)
  const cardPadding = 40
  const gap = cardGap - cardPadding
  
  let yStart, yEnd, zIndex, rotateStart, rotateEnd, scaleStart, scaleEnd
  
  if (index === 0) {
    yStart = -peekOffset // Card 1: peek above by 1x offset
    yEnd = 0
    rotateStart = -2
    rotateEnd = 0
    scaleStart = 0.92
    scaleEnd = 1
    zIndex = 1
  } else if (index === 1) {
    yStart = 0 // Card 2: at base position
    yEnd = cardHeight + gap
    rotateStart = 2
    rotateEnd = 0
    scaleStart = 0.95
    scaleEnd = 1
    zIndex = 2
  } else {
    yStart = peekOffset // Card 3: on top, offset down
    yEnd = (cardHeight + gap) * 2
    rotateStart = 0
    rotateEnd = 0
    scaleStart = 1
    scaleEnd = 1
    zIndex = 3
  }
  
  const y = useTransform(scrollYProgress, [animStart, animEnd], [yStart, yEnd])
  const rotate = useTransform(scrollYProgress, [animStart, animEnd], [rotateStart, rotateEnd])
  const scale = useTransform(scrollYProgress, [animStart, animEnd], [scaleStart, scaleEnd])

  return (
    <motion.div
      ref={index === 0 ? cardRef : null}
      style={{
        position: 'absolute',
        y,
        rotate,
        scale,
        zIndex,
        left: 0,
        right: 0,
        padding: '0 20px'
      }}
    >
      <ProjectCard 
        project={project}
        priority={index === 0}
        isOpen={isOpen}
        onToggle={onToggle}
      />
    </motion.div>
  )
}

const TestStack2 = () => {
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState({ email: '', logo: '', companyName: '' })
  const [homePage, setHomePage] = useState({ heroImage: '', heroText: 'Your start up accelerator' })
  const [openProjectId, setOpenProjectId] = useState(null)
  const container = useRef(null)
  const cardRef = useRef(null)
  const [cardHeight, setCardHeight] = useState(600)
  const [peekOffset, setPeekOffset] = useState(40)
  const [animStart, setAnimStart] = useState(0.15)
  const [animEnd, setAnimEnd] = useState(0.4)
  const [cardGap, setCardGap] = useState(20)
  const [stickyTop, setStickyTop] = useState(100)
  const [showControls, setShowControls] = useState(true)
  
  // Card padding constant (20px top + 20px bottom)
  const cardPadding = 40
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 80%", "end start"] // Start when section is 80% down the viewport
  })

  // Update peek offset based on screen size
  useEffect(() => {
    const updatePeekOffset = () => {
      const defaultPeek = window.innerWidth < 768 ? 20 : 40
      setPeekOffset(defaultPeek)
    }
    
    updatePeekOffset()
    window.addEventListener('resize', updatePeekOffset)
    return () => window.removeEventListener('resize', updatePeekOffset)
  }, [])

  // Measure actual card height on mount and resize
  useEffect(() => {
    const updateCardHeight = () => {
      if (cardRef.current) {
        const height = cardRef.current.offsetHeight
        if (height > 0) {
          setCardHeight(height)
        }
      }
    }
    
    const timer = setTimeout(updateCardHeight, 100)
    
    window.addEventListener('resize', updateCardHeight)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateCardHeight)
    }
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => {
        const featuredProjects = data.filter(project => project.featuredOnHome === true)
        setProjects(featuredProjects)
      })
      .catch((err) => {
        console.error('Error fetching projects:', err)
        setProjects([])
      })
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch((err) => {
        console.error('Error fetching settings:', err)
      })
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/api/pages/home`)
      .then(res => res.json())
      .then(data => setHomePage(data))
      .catch((err) => {
        console.error('Error fetching home page:', err)
      })
  }, [])

  const firstThreeProjects = projects.slice(0, 3)
  const remainingProjects = projects.slice(3)

  return (
    <div className="w-full" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      {/* Animation Controls */}
      {showControls && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '10px 20px',
          zIndex: 9999,
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          fontSize: '12px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setShowControls(false)}
            style={{ padding: '5px 10px', background: '#333', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}
          >
            Hide Controls
          </button>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Peek Offset (px):
            <input 
              type="number" 
              value={peekOffset} 
              onChange={(e) => setPeekOffset(Number(e.target.value))}
              style={{ width: '60px', padding: '4px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }}
            />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Anim Start (0-1):
            <input 
              type="number" 
              step="0.05"
              value={animStart} 
              onChange={(e) => setAnimStart(Number(e.target.value))}
              style={{ width: '60px', padding: '4px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }}
            />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Anim End (0-1):
            <input 
              type="number" 
              step="0.05"
              value={animEnd} 
              onChange={(e) => setAnimEnd(Number(e.target.value))}
              style={{ width: '60px', padding: '4px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }}
            />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Card Gap (px):
            <input 
              type="number" 
              value={cardGap} 
              onChange={(e) => setCardGap(Number(e.target.value))}
              style={{ width: '60px', padding: '4px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }}
            />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Sticky Top (px):
            <input 
              type="number" 
              value={stickyTop} 
              onChange={(e) => setStickyTop(Number(e.target.value))}
              style={{ width: '60px', padding: '4px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px' }}
            />
          </label>
          
          <div style={{ marginLeft: 'auto', fontSize: '11px', opacity: 0.7 }}>
            Current: Peek={peekOffset}px | Start={animStart} | End={animEnd} | Gap={cardGap}px | Top={stickyTop}px
          </div>
        </div>
      )}
      
      {!showControls && (
        <button 
          onClick={() => setShowControls(true)}
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px',
            zIndex: 9999,
            fontSize: '12px'
          }}
        >
          Show Controls
        </button>
      )}
      
      <SEO
        title={homePage.metaTitle || 'Pencilz - Your start up accelerator'}
        description={homePage.metaDescription || 'Shopify builds, marketing, design, and start-up support services'}
        keywords={homePage.metaKeywords || 'shopify, web design, marketing, startup, development'}
        ogImage={homePage.ogImage || homePage.heroImage}
        ogUrl={window.location.href}
      />
      
      {/* Hero Section */}
      <div className="px-5 md:px-[20px] pt-2 md:pt-[10px]">
        <div 
          className="relative w-full overflow-hidden aspect-[4/5] md:aspect-[2/1]"
          style={{ borderRadius: '20px' }}
        >
          <div className="absolute inset-0">
            {homePage.heroImage ? (
              <LazyImage 
                src={getImageUrl(homePage.heroImage)}
                alt="Hero background"
                className="absolute w-full h-full object-cover"
                priority={true}
              />
            ) : (
              <div className="absolute w-full h-full bg-gray-200" />
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center md:p-0 p-5">
            <h1 
              className="text-white text-center font-semibold md:text-[96px] text-[50px]"
              style={{ lineHeight: 'normal' }}
            >
              {homePage.heroText || 'Your start up accelerator'}
            </h1>
          </div>

          <div 
            className="absolute lg:flex hidden flex-row gap-4"
            style={{ bottom: '24px', left: '24px', right: '24px' }}
          >
            {homePage.heroButtons && homePage.heroButtons.map((button) => (
              <Button 
                key={button.id}
                to={button.link.startsWith('http') ? undefined : button.link}
                href={button.link.startsWith('http') ? button.link : undefined}
                icon={button.icon}
                subtext={button.subtext}
                className="flex-1"
                style={{ minHeight: '72px' }}
              >
                {button.text}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Pills - Tablet */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 px-5 md:px-[20px] mt-5">
        {homePage.heroButtons && homePage.heroButtons.map((button) => (
          <Button 
            key={button.id}
            to={button.link.startsWith('http') ? undefined : button.link}
            href={button.link.startsWith('http') ? button.link : undefined}
            icon={button.icon}
            subtext={button.subtext}
            style={{ minHeight: '72px' }}
          >
            {button.text}
          </Button>
        ))}
      </div>

      {/* Service Pills - Mobile */}
      <div className="md:hidden flex flex-col gap-4 px-5 mt-5">
        {homePage.heroButtons && homePage.heroButtons.map((button) => (
          <Button 
            key={button.id}
            to={button.link.startsWith('http') ? undefined : button.link}
            href={button.link.startsWith('http') ? button.link : undefined}
            icon={button.icon}
            subtext={button.subtext}
            style={{ minHeight: '72px' }}
          >
            {button.text}
          </Button>
        ))}
      </div>

      {/* Projects Section - Animated Stack (First 3) */}
      {firstThreeProjects.length > 0 && (
        <section 
          ref={container}
          style={{
            position: 'relative',
            height: '300vh',
            marginTop: '20px'
          }}
        >
          <div 
            style={{ 
              position: 'sticky', 
              top: `${stickyTop}px`,
              paddingTop: `${peekOffset * 2}px`,
              minHeight: `${cardHeight * 3 + (cardGap - cardPadding) * 2 + peekOffset * 2}px`
            }}
          >
            {firstThreeProjects.map((project, i) => (
              <AnimatedCard
                key={project.id}
                project={project}
                index={i}
                scrollYProgress={scrollYProgress}
                cardHeight={cardHeight}
                peekOffset={peekOffset}
                animStart={animStart}
                animEnd={animEnd}
                cardGap={cardGap}
                cardRef={cardRef}
                isOpen={openProjectId === project.id}
                onToggle={() => setOpenProjectId(openProjectId === project.id ? null : project.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Remaining Projects */}
      {remainingProjects.length > 0 && (
        <div className="px-5 md:px-[20px]">
          {remainingProjects.map((project, idx) => (
            <div 
              key={project.id} 
              style={{ 
                marginBottom: idx === remainingProjects.length - 1 ? 0 : `${cardGap}px`,
                marginTop: idx === 0 ? `-20px` : 0
              }}
            >
              <ProjectCard 
                project={project}
                isOpen={openProjectId === project.id}
                onToggle={() => setOpenProjectId(openProjectId === project.id ? null : project.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default TestStack2

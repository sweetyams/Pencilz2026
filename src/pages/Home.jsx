import { useState, useEffect, useRef } from 'react'
import { useScroll } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import StickyCard from '../components/StickyCard'
import SEO from '../components/SEO'
import Button from '../components/Button'

const Home = () => {
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState({ email: '', logo: '', companyName: '' })
  const [homePage, setHomePage] = useState({ heroImage: '', heroText: 'Your start up accelerator' })
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setProjects([]))
    
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
    
    fetch('http://localhost:3001/api/pages/home')
      .then(res => res.json())
      .then(data => setHomePage(data))
      .catch(() => {})
  }, [])

  const emailSubject = encodeURIComponent("Let's Create Something Amazing Together! 🚀")
  const emailBody = encodeURIComponent(
    `Hi there!\n\nI'm excited to explore the possibility of working together on a project.\n\nHere's what I'm thinking:\n\n[Tell us about your project vision]\n\nLooking forward to bringing this to life!\n\nBest regards`
  )

  return (
    <div className="w-full" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <SEO
        title={homePage.metaTitle || 'Pencilz - Your start up accelerator'}
        description={homePage.metaDescription || 'Shopify builds, marketing, design, and start-up support services'}
        keywords={homePage.metaKeywords || 'shopify, web design, marketing, startup, development'}
        ogImage={homePage.ogImage || homePage.heroImage}
        ogUrl={window.location.href}
      />
      
      {/* Hero Section */}
      <div style={{ padding: '20px' }}>
        <div 
          className="relative w-full overflow-hidden"
          style={{ 
            aspectRatio: window.innerWidth < 768 ? '4/5' : '2/1',
            borderRadius: '20px'
          }}
        >
          {/* Background Images */}
          <div className="absolute inset-0">
            <img 
              src="https://www.figma.com/api/mcp/asset/d467fd6e-154f-456c-b346-3780beb81779"
              alt=""
              className="absolute w-full h-full object-cover"
              style={{ opacity: 0.9 }}
            />
            {homePage.heroImage && (
              <img 
                src={homePage.heroImage}
                alt=""
                className="absolute w-full h-full object-cover"
              />
            )}
          </div>

          {/* Hero Text */}
          <div className="absolute inset-0 flex items-center justify-center md:p-0 p-5">
            <h1 
              className="text-white text-center font-semibold md:text-[96px] text-[50px]"
              style={{ lineHeight: 'normal' }}
            >
              {homePage.heroText || 'Your start up accelerator'}
            </h1>
          </div>

          {/* Service Pills - Desktop Only */}
          <div 
            className="absolute md:flex hidden flex-row gap-4"
            style={{ 
              bottom: '24px',
              left: '24px',
              right: '24px'
            }}
          >
            {homePage.heroButtons && homePage.heroButtons.map((button) => (
              button.subtext ? (
                <div 
                  key={button.id}
                  className="bg-white flex flex-col justify-center px-10 py-2.5 flex-1 border border-black rounded-[70px] transition-all duration-300 hover:bg-[#e7fe89] hover:border-dashed cursor-pointer"
                  style={{ minHeight: '72px' }}
                  onClick={() => {
                    if (button.link.startsWith('http')) {
                      window.location.href = button.link
                    } else {
                      window.location.href = button.link
                    }
                  }}
                >
                  <p className="text-2xl text-black">{button.text}</p>
                  <p className="text-base text-black">{button.subtext}</p>
                </div>
              ) : (
                <Button 
                  key={button.id}
                  to={button.link.startsWith('http') ? undefined : button.link}
                  href={button.link.startsWith('http') ? button.link : undefined}
                  icon={button.icon}
                  className="flex-1"
                  style={{ height: '72px' }}
                >
                  {button.text}
                </Button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Service Pills - Mobile Only */}
      <div className="md:hidden flex flex-col gap-4" style={{ padding: '20px', marginTop: '20px' }}>
        {homePage.heroButtons && homePage.heroButtons.map((button) => (
          button.subtext ? (
            <div 
              key={button.id}
              className="bg-white flex flex-col justify-center px-10 py-2.5 border border-black rounded-[70px] transition-all duration-300 hover:bg-[#e7fe89] hover:border-dashed"
              style={{ minHeight: '72px' }}
              onClick={() => {
                if (button.link.startsWith('http')) {
                  window.location.href = button.link
                } else {
                  window.location.href = button.link
                }
              }}
            >
              <p className="text-2xl text-black">{button.text}</p>
              <p className="text-base text-black">{button.subtext}</p>
            </div>
          ) : (
            <Button 
              key={button.id}
              to={button.link.startsWith('http') ? undefined : button.link}
              href={button.link.startsWith('http') ? button.link : undefined}
              icon={button.icon}
              style={{ height: '72px' }}
            >
              {button.text}
            </Button>
          )
        ))}
      </div>

      {/* Projects Section - Sticky Stack */}
      {projects.length > 0 && (
        <div 
          ref={containerRef}
          style={{ 
            position: 'relative',
            marginTop: '48px',
            paddingBottom: '30px'
          }}
        >
          {projects.slice(0, 3).map((project, i) => (
            <StickyCard
              key={project.id}
              project={project}
              index={i}
              scrollYProgress={scrollYProgress}
              totalCards={3}
            />
          ))}
        </div>
      )}
      
      {/* Remaining Projects */}
      {projects.length > 3 && (
        <div style={{ padding: '0 20px' }}>
          {projects.slice(3).map(project => (
            <div key={project.id} style={{ marginBottom: '20px' }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      {/* Contact Section */}
      <div 
        className="w-full flex items-center justify-center"
        style={{ padding: '48px 20px 200px 20px' }}
      >
        <div 
          className="flex flex-col items-center gap-6"
          style={{ width: '481px' }}
        >
          <p className="text-2xl text-black text-center w-full">
            Start a project
          </p>
          <Button
            href={`mailto:${settings.email}?subject=${emailSubject}&body=${emailBody}`}
            variant="primary"
            className="w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            {settings.email}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home

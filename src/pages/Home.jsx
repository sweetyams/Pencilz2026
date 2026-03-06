import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import StackedProjectCards from '../components/StackedProjectCards'
import SEO from '../components/SEO'
import Button from '../components/Button'
import LazyImage from '../components/LazyImage'
import ExperienceSection from '../components/ExperienceSection'
import { API_URL } from '../config'
import { getImageUrl } from '../utils/imageUrl'

const Home = () => {
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState({ email: '', logo: '', companyName: '' })
  const [homePage, setHomePage] = useState({ heroImage: '', heroText: 'Your start up accelerator' })
  const [openProjectId, setOpenProjectId] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => {
        // Filter for featured projects only
        const featuredProjects = data.filter(project => project.featuredOnHome === true)
        setProjects(featuredProjects)
      })
      .catch(() => setProjects([]))
    
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
    
    fetch(`${API_URL}/api/pages/home`)
      .then(res => res.json())
      .then(data => setHomePage(data))
      .catch(() => {})
  }, [])

  const emailSubject = encodeURIComponent(
    homePage.emailSubject || "Let's Create Something Amazing Together! 🚀"
  )
  const emailBody = encodeURIComponent(
    homePage.emailBody || `Hi there!\n\nI'm excited to explore the possibility of working together on a project.\n\nHere's what I'm thinking:\n\n[Tell us about your project vision]\n\nLooking forward to bringing this to life!\n\nBest regards`
  )
  const contactEmail = homePage.contactEmail || settings.email

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
      <div className="px-5 md:px-[20px] pt-2 md:pt-[10px]">
        <div 
          className="relative w-full overflow-hidden aspect-[4/5] md:aspect-[2/1]"
          style={{ 
            borderRadius: '20px'
          }}
        >
          {/* Background Image */}
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
            className="absolute lg:flex hidden flex-row gap-4"
            style={{ 
              bottom: '24px',
              left: '24px',
              right: '24px'
            }}
          >
            {homePage.heroButtons && homePage.heroButtons.map((button) => (
              <Button 
                key={button.id}
                to={button.link.startsWith('http') ? undefined : button.link}
                href={button.link.startsWith('http') ? button.link : undefined}
                icon={button.icon}
                subtext={button.subtext}
                variant="primary"
                className="flex-1"
                style={{ minHeight: '72px' }}
              >
                {button.text}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Pills - Tablet (2-up grid) */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 px-5 md:px-[20px] mt-5">
        {homePage.heroButtons && homePage.heroButtons.map((button) => (
          <Button 
            key={button.id}
            to={button.link.startsWith('http') ? undefined : button.link}
            href={button.link.startsWith('http') ? button.link : undefined}
            icon={button.icon}
            subtext={button.subtext}
            variant="primary"
            style={{ minHeight: '72px' }}
          >
            {button.text}
          </Button>
        ))}
      </div>

      {/* Service Pills - Mobile (stacked) */}
      <div className="md:hidden flex flex-col gap-4 px-5 mt-5">
        {homePage.heroButtons && homePage.heroButtons.map((button) => (
          <Button 
            key={button.id}
            to={button.link.startsWith('http') ? undefined : button.link}
            href={button.link.startsWith('http') ? button.link : undefined}
            icon={button.icon}
            subtext={button.subtext}
            variant="primary"
            style={{ minHeight: '72px' }}
          >
            {button.text}
          </Button>
        ))}
      </div>

      {/* Experience Section */}
      <ExperienceSection data={homePage.experienceSection} />

      {/* Projects Section - Animated Stack (First 3) */}
      {projects.length > 0 && (
        <StackedProjectCards
          projects={projects}
          openProjectId={openProjectId}
          onToggle={(id) => setOpenProjectId(openProjectId === id ? null : id)}
        />
      )}
      
      {/* Remaining Projects */}
      {projects.length > 3 && (
        <div className="px-5 md:px-[20px]">
          {projects.slice(3).map((project, idx) => (
            <div 
              key={project.id} 
              style={{ 
                marginBottom: idx === projects.slice(3).length - 1 ? 0 : '20px',
                marginTop: idx === 0 ? '-20px' : 0
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
    </div>
  )
}

export default Home

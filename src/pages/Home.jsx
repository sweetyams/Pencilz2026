import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'

const Home = () => {
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState({ email: '', logo: '', companyName: '' })

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setProjects([]))
    
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  const emailSubject = encodeURIComponent("Let's Create Something Amazing Together! 🚀")
  const emailBody = encodeURIComponent(
    `Hi there!\n\nI'm excited to explore the possibility of working together on a project.\n\nHere's what I'm thinking:\n\n[Tell us about your project vision]\n\nLooking forward to bringing this to life!\n\nBest regards`
  )

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div style={{ padding: '20px' }}>
        <div 
          className="relative w-full overflow-hidden"
          style={{ 
            height: '756px',
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
            <img 
              src="https://www.figma.com/api/mcp/asset/26748e56-2819-4d62-aaff-c0eb66393394"
              alt=""
              className="absolute w-full h-full object-cover"
            />
          </div>

          {/* Hero Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 
              className="text-white text-center font-semibold"
              style={{ fontSize: '96px', lineHeight: 'normal' }}
            >
              Your start up accelerator
            </h1>
          </div>

          {/* Service Pills */}
          <div 
            className="absolute flex gap-4"
            style={{ 
              bottom: '24px',
              left: '25px',
              right: '25px',
              flexWrap: 'wrap'
            }}
          >
            <div 
              className="flex items-center justify-between px-10 py-2.5"
              style={{ 
                backgroundColor: '#e7fe89',
                borderRadius: '70px',
                height: '72px',
                minWidth: '334px'
              }}
            >
              <p className="text-2xl text-black">Shopify builds</p>
              <svg width="39" height="19" viewBox="0 0 39 19" fill="none">
                <path d="M29.5 2L37 9.5L29.5 17" stroke="black" strokeWidth="2"/>
                <path d="M2 9.5H37" stroke="black" strokeWidth="2"/>
              </svg>
            </div>

            <div 
              className="bg-white flex flex-col justify-center px-10 py-2.5"
              style={{ 
                borderRadius: '70px',
                minWidth: '333px'
              }}
            >
              <p className="text-2xl text-black">Marketing</p>
              <p className="text-base text-black">Starter packs available</p>
            </div>

            <div 
              className="bg-white flex flex-col justify-center px-10 py-2.5"
              style={{ 
                borderRadius: '70px',
                minWidth: '334px'
              }}
            >
              <p className="text-2xl text-black">Design</p>
              <p className="text-base text-black">Design system refresh</p>
            </div>

            <div 
              className="bg-white flex flex-col justify-center px-10 py-2.5"
              style={{ 
                borderRadius: '70px',
                minWidth: '334px'
              }}
            >
              <p className="text-2xl text-black">Start-up Support</p>
              <p className="text-base text-black">Custom Apps, no vibe coding.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div style={{ padding: '20px' }}>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Contact Section */}
      <div 
        className="w-full flex items-center justify-center"
        style={{ padding: '200px 0' }}
      >
        <div 
          className="flex flex-col items-center gap-6"
          style={{ width: '481px' }}
        >
          <p className="text-2xl text-black text-center w-full">
            Start a project
          </p>
          <a
            href={`mailto:${settings.email}?subject=${emailSubject}&body=${emailBody}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-5 py-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ 
              backgroundColor: '#e7fe89',
              border: '1px dashed black',
              borderRadius: '70px'
            }}
          >
            <p className="text-2xl text-black">{settings.email}</p>
            <svg width="39" height="19" viewBox="0 0 39 19" fill="none">
              <path d="M29.5 2L37 9.5L29.5 17" stroke="black" strokeWidth="2"/>
              <path d="M2 9.5H37" stroke="black" strokeWidth="2"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home

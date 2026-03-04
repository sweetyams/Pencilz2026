import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Test data
const testProjects = [
  {
    id: 1,
    title: 'Project 1',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Project 2',
    image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Project 3',
    image: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    title: 'Project 4',
    image: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    title: 'Project 5',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
  },
]

const TestStack = () => {
  const container = useRef(null)
  const cardRef = useRef(null)
  const [cardHeight, setCardHeight] = useState(600)
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start center", "end start"] // Start when section hits center of viewport
  })

  // Measure actual card height on mount and resize
  useEffect(() => {
    const updateCardHeight = () => {
      if (cardRef.current) {
        const height = cardRef.current.offsetHeight
        setCardHeight(height)
      }
    }
    
    updateCardHeight()
    window.addEventListener('resize', updateCardHeight)
    return () => window.removeEventListener('resize', updateCardHeight)
  }, [])

  return (
    <div className="w-full" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      {/* Hero Section - Matching Home Page */}
      <div className="px-5 md:px-[20px] pt-2 md:pt-[10px]">
        <div 
          className="relative w-full overflow-hidden aspect-[4/5] md:aspect-[2/1]"
          style={{ borderRadius: '20px' }}
        >
          {/* Background placeholder */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }} />
          
          {/* Hero Text */}
          <div className="absolute inset-0 flex items-center justify-center md:p-0 p-5">
            <h1 
              className="text-white text-center font-semibold md:text-[96px] text-[50px]"
              style={{ lineHeight: 'normal' }}
            >
              Test Stack Animation
            </h1>
          </div>
        </div>
      </div>

      {/* Main animation section - First 3 cards only */}
      <section 
        ref={container}
        style={{
          position: 'relative',
          height: '300vh',
          marginTop: '48px',
          paddingBottom: '30px'
        }}
      >
        <div 
          style={{ 
            position: 'sticky', 
            top: '20px',
            paddingTop: '140px',
            minHeight: `${cardHeight * 3 + 40 + 140}px` // 3 cards + 2 gaps (40px) + top padding
          }}
        >
          {testProjects.slice(0, 3).map((project, i) => {
            const gap = 20
            
            let yStart, yEnd, zIndex, rotateStart, rotateEnd, scaleStart, scaleEnd
            
            if (i === 0) {
              // Project 1: -2deg rotation, 92% scale, 10% visible above Project 2
              yStart = 20 - 120 // Stacked position (peeking above)
              yEnd = 20 // Final position at top
              rotateStart = -2
              rotateEnd = 0
              scaleStart = 0.92
              scaleEnd = 1
              zIndex = 1
            } else if (i === 1) {
              // Project 2: 2deg rotation, 95% scale, 10% visible above Project 3
              yStart = 20 - 60 // Stacked position (peeking above)
              yEnd = 20 + cardHeight + gap // Card 1 + 20px gap
              rotateStart = 2
              rotateEnd = 0
              scaleStart = 0.95
              scaleEnd = 1
              zIndex = 2
            } else {
              // Project 3: No rotation/scale, on top
              yStart = 20 // Stacked position (on top)
              yEnd = 20 + (cardHeight + gap) * 2 // Cards 1 & 2 + 2 gaps
              rotateStart = 0
              rotateEnd = 0
              scaleStart = 1
              scaleEnd = 1
              zIndex = 3
            }
            
            // Animation completes in first 25% of scroll (faster)
            const y = useTransform(scrollYProgress, [0, 0.25], [yStart, yEnd])
            const rotate = useTransform(scrollYProgress, [0, 0.25], [rotateStart, rotateEnd])
            const scale = useTransform(scrollYProgress, [0, 0.25], [scaleStart, scaleEnd])

            return (
              <motion.div
                key={project.id}
                ref={i === 0 ? cardRef : null}
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
                <div
                  className="relative w-full group cursor-pointer md:aspect-[2/1] aspect-[4/5]"
                  style={{ 
                    borderRadius: '20px',
                    isolation: 'isolate',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Bottom gradient */}
                  <div 
                    className="absolute inset-x-0 bottom-0 pointer-events-none"
                    style={{
                      height: '300px',
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent)'
                    }}
                  />
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 p-6 z-10 pointer-events-none">
                    <h3 className="text-white text-2xl font-bold">{project.title}</h3>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Remaining Projects - Cards 4 and 5 */}
      <div className="px-5 md:px-[20px]">
        {testProjects.slice(3).map(project => (
          <div key={project.id} style={{ marginBottom: '20px' }}>
            <div
              className="relative w-full group cursor-pointer md:aspect-[2/1] aspect-[4/5]"
              style={{ 
                borderRadius: '20px',
                isolation: 'isolate',
                overflow: 'hidden'
              }}
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {/* Bottom gradient */}
              <div 
                className="absolute inset-x-0 bottom-0 pointer-events-none"
                style={{
                  height: '300px',
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent)'
                }}
              />
              {/* Title */}
              <div className="absolute bottom-0 left-0 p-6 z-10 pointer-events-none">
                <h3 className="text-white text-2xl font-bold">{project.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        height: '50vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <h2 style={{ fontSize: '32px' }}>End of Stack Animation</h2>
      </div>
    </div>
  )
}

export default TestStack

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProjectCard from './ProjectCard'

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

const StackedProjectCards = ({ projects, openProjectId, onToggle }) => {
  const container = useRef(null)
  const cardRef = useRef(null)
  const [cardHeight, setCardHeight] = useState(600)
  const [peekOffset, setPeekOffset] = useState(40)
  const animStart = 0.15
  const animEnd = 0.4
  const cardGap = 20
  
  // Card padding constant (20px top + 20px bottom)
  const cardPadding = 40
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 80%", "end start"]
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

  const firstThreeProjects = projects.slice(0, 3)

  return (
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
          top: '100px',
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
            onToggle={() => onToggle(project.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default StackedProjectCards

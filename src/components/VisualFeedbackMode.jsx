import { useEffect, useState, useCallback } from 'react'
import html2canvas from 'html2canvas'

const VisualFeedbackMode = ({ isActive, onElementSelected, onCancel }) => {
  const [hoveredElement, setHoveredElement] = useState(null)

  // Generate a unique CSS selector for an element
  const generateSelector = useCallback((element) => {
    if (!element || element === document.body || element === document.documentElement) {
      return null
    }

    const path = []
    let current = element

    while (current && current !== document.body && current !== document.documentElement) {
      let selector = current.tagName.toLowerCase()

      // Add ID if available
      if (current.id) {
        selector += `#${current.id}`
        path.unshift(selector)
        break
      }

      // Add classes if available
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).filter(c => c && !c.startsWith('vfm-'))
        if (classes.length > 0) {
          selector += `.${classes.join('.')}`
        }
      }

      // Add nth-child if needed for uniqueness
      if (current.parentElement) {
        const siblings = Array.from(current.parentElement.children)
        const sameTagSiblings = siblings.filter(s => s.tagName === current.tagName)
        if (sameTagSiblings.length > 1) {
          const index = sameTagSiblings.indexOf(current) + 1
          selector += `:nth-child(${index})`
        }
      }

      path.unshift(selector)
      current = current.parentElement
    }

    return path.join(' > ')
  }, [])

  // Check if element should be excluded
  const isExcludedElement = useCallback((element) => {
    if (!element) {
      console.log('❌ Excluded: no element')
      return true
    }
    
    const tagName = element.tagName.toLowerCase()
    const excludedTags = ['html', 'body', 'script', 'style', 'meta', 'link', 'head']
    
    if (excludedTags.includes(tagName)) {
      console.log('❌ Excluded: tag is', tagName)
      return true
    }
    
    // Only exclude our overlay UI elements (vfm-overlay, vfm-cancel-btn)
    // Don't exclude vfm-highlight (that's the element being hovered)
    // Don't exclude vfm-active (that's on body)
    if (element.className && typeof element.className === 'string') {
      if (element.className.includes('vfm-overlay') || element.className.includes('vfm-cancel-btn')) {
        console.log('❌ Excluded: is overlay UI')
        return true
      }
    }
    
    // Check if element is inside the overlay UI
    let parent = element.parentElement
    while (parent && parent !== document.body) {
      if (parent.className && typeof parent.className === 'string') {
        if (parent.className.includes('vfm-overlay')) {
          console.log('❌ Excluded: inside overlay UI')
          return true
        }
      }
      parent = parent.parentElement
    }
    
    console.log('✅ Element allowed:', tagName, element.className)
    return false
  }, [])

  // Handle mouse move - highlight element on hover
  const handleMouseMove = useCallback((e) => {
    if (!isActive) return

    const element = e.target

    if (isExcludedElement(element)) {
      if (hoveredElement) {
        hoveredElement.classList.remove('vfm-highlight')
        setHoveredElement(null)
      }
      return
    }

    if (element !== hoveredElement) {
      // Remove highlight from previous element
      if (hoveredElement) {
        hoveredElement.classList.remove('vfm-highlight')
      }

      // Add highlight to new element
      element.classList.add('vfm-highlight')
      setHoveredElement(element)
      console.log('✨ Highlighting:', element.tagName, element.className)
    }
  }, [isActive, hoveredElement, isExcludedElement])

  // Handle click - select element
  const handleClick = useCallback(async (e) => {
    console.log('🔵 Click detected', { isActive, target: e.target })
    
    if (!isActive) {
      console.log('❌ Not active, ignoring')
      return
    }

    // Prevent ALL default behaviors
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()

    const element = e.target
    console.log('🎯 Target element:', element.tagName, element.className)

    if (isExcludedElement(element)) {
      console.log('❌ Element excluded')
      return
    }

    const selector = generateSelector(element)
    console.log('📍 Generated selector:', selector)
    
    if (selector) {
      // Remove highlight before screenshot
      element.classList.remove('vfm-highlight')
      setHoveredElement(null)

      console.log('📸 Capturing screenshot...')
      
      // Capture screenshot of the element
      let screenshotDataUrl = null
      try {
        // Clone the element to avoid modifying the original
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          logging: false,
          scale: 1.5, // Good balance between quality and performance
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: false, // Prevent text alignment issues
          imageTimeout: 0,
          removeContainer: true // Clean up after capture
        })
        screenshotDataUrl = canvas.toDataURL('image/png')
        console.log('✅ Screenshot captured')
      } catch (error) {
        console.error('❌ Screenshot failed:', error)
        // Continue without screenshot
      }

      console.log('✅ Calling onElementSelected')
      // Call callback with selector, element, and screenshot
      onElementSelected(selector, element, screenshotDataUrl)
    } else {
      console.log('❌ No selector generated')
    }
  }, [isActive, generateSelector, isExcludedElement, onElementSelected])

  // Handle escape key - cancel
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isActive) {
      onCancel()
    }
  }, [isActive, onCancel])

  // Setup and cleanup event listeners
  useEffect(() => {
    console.log('🔄 Effect running, isActive:', isActive)
    
    if (!isActive) {
      // Cleanup on deactivate
      if (hoveredElement) {
        hoveredElement.classList.remove('vfm-highlight')
        setHoveredElement(null)
      }
      return
    }

    console.log('✅ Adding event listeners')
    
    // Add event listeners with capture phase to intercept before other handlers
    document.addEventListener('mousemove', handleMouseMove, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      console.log('🧹 Cleaning up event listeners')
      // Cleanup
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown, true)

      if (hoveredElement) {
        hoveredElement.classList.remove('vfm-highlight')
      }
    }
  }, [isActive, handleMouseMove, handleClick, handleKeyDown, hoveredElement])

  if (!isActive) return null

  return (
    <>
      {/* Overlay indicator - positioned at bottom */}
      <div className="vfm-overlay fixed bottom-0 left-0 right-0 z-[9998] bg-blue-600 text-white px-4 py-3 text-sm font-medium shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Visual Feedback Mode Active - Click any element to add a comment</span>
          </div>
          <button
            onClick={onCancel}
            className="vfm-cancel-btn px-3 py-1 bg-white text-blue-600 rounded hover:bg-blue-50 transition-colors font-medium"
          >
            Cancel (Esc)
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .vfm-highlight {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px !important;
          background-color: rgba(59, 130, 246, 0.1) !important;
          cursor: crosshair !important;
        }
        
        .vfm-overlay * {
          cursor: default !important;
        }
        
        body.vfm-active {
          cursor: crosshair !important;
        }
        
        body.vfm-active * {
          cursor: crosshair !important;
          pointer-events: auto !important;
        }
        
        /* Ensure all interactive elements are clickable in feedback mode */
        body.vfm-active a,
        body.vfm-active button,
        body.vfm-active input,
        body.vfm-active textarea,
        body.vfm-active select {
          pointer-events: auto !important;
        }
      `}</style>
    </>
  )
}

export default VisualFeedbackMode

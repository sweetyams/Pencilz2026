import { useState, useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'
import VisualFeedbackMode from './VisualFeedbackMode'
import CommentDialog from './CommentDialog'
import { useAuth } from '../contexts/AuthContext'

const Layout = () => {
  const [feedbackModeActive, setFeedbackModeActive] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  // Highlight element if highlightTask parameter is present
  useEffect(() => {
    const taskId = searchParams.get('highlightTask')
    const selector = searchParams.get('selector')
    
    if (taskId && selector) {
      // Wait for page to load
      setTimeout(() => {
        try {
          // Try to find and highlight the element
          const element = document.querySelector(selector)
          
          if (element) {
            // Scroll element into view
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            
            // Add highlight styling
            element.style.outline = '3px solid #3b82f6'
            element.style.outlineOffset = '2px'
            element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
            
            // Show notification
            const indicator = document.createElement('div')
            indicator.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #3b82f6;
              color: white;
              padding: 12px 20px;
              border-radius: 8px;
              z-index: 9999;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              font-size: 14px;
              font-weight: 500;
            `
            indicator.textContent = '✓ Element highlighted'
            document.body.appendChild(indicator)
            
            // Remove highlight and notification after 5 seconds
            setTimeout(() => {
              element.style.outline = ''
              element.style.outlineOffset = ''
              element.style.backgroundColor = ''
              indicator.remove()
            }, 5000)
          } else {
            // Element not found
            const indicator = document.createElement('div')
            indicator.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #ef4444;
              color: white;
              padding: 12px 20px;
              border-radius: 8px;
              z-index: 9999;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              font-size: 14px;
              font-weight: 500;
            `
            indicator.textContent = '⚠ Element not found on this page'
            document.body.appendChild(indicator)
            
            setTimeout(() => {
              indicator.remove()
            }, 3000)
          }
        } catch (error) {
          console.error('Error highlighting element:', error)
        }
      }, 500)
    }
  }, [searchParams])

  const handleActivateFeedbackMode = () => {
    console.log('🚀 Activating feedback mode')
    setFeedbackModeActive(true)
    document.body.classList.add('vfm-active')
  }

  const handleCancelFeedbackMode = () => {
    console.log('❌ Canceling feedback mode')
    setFeedbackModeActive(false)
    setSelectedElement(null)
    document.body.classList.remove('vfm-active')
  }

  const handleElementSelected = (selector, element, screenshot) => {
    console.log('🎯 Element selected in Layout:', { selector, element, hasScreenshot: !!screenshot })
    
    // Capture debugging metadata
    const metadata = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      devicePixelRatio: window.devicePixelRatio,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY
      }
    }
    
    setSelectedElement({ selector, element, screenshot, metadata })
    setFeedbackModeActive(false)
    setShowCommentDialog(true)
    document.body.classList.remove('vfm-active')
  }

  const handleCommentDialogClose = () => {
    setShowCommentDialog(false)
    setSelectedElement(null)
  }

  const handleCommentSuccess = (task) => {
    setShowCommentDialog(false)
    setSelectedElement(null)
    // Show success message
    alert('Feedback submitted successfully! View it in the CMS Tasks section.')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer onActivateFeedbackMode={handleActivateFeedbackMode} />
      
      {/* Visual Feedback Mode */}
      <VisualFeedbackMode
        isActive={feedbackModeActive}
        onElementSelected={handleElementSelected}
        onCancel={handleCancelFeedbackMode}
      />

      {/* Comment Dialog */}
      {user && selectedElement && (
        <CommentDialog
          isOpen={showCommentDialog}
          selector={selectedElement.selector}
          screenshot={selectedElement.screenshot}
          metadata={selectedElement.metadata}
          pageUrl={window.location.href}
          user={user}
          onClose={handleCommentDialogClose}
          onSuccess={handleCommentSuccess}
        />
      )}
    </div>
  )
}

export default Layout

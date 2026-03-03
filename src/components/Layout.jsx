import { useState } from 'react'
import { Outlet } from 'react-router-dom'
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

  const handleElementSelected = (selector, element) => {
    console.log('🎯 Element selected in Layout:', { selector, element })
    setSelectedElement({ selector, element })
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

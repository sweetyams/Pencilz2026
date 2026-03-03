import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from './ui/Button'
import { API_URL } from '../config'

const CommentDialog = ({ isOpen, selector, pageUrl, user, onClose, onSuccess }) => {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setComment('')
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters')
      return
    }

    if (comment.length > 1000) {
      setError('Comment must be less than 1000 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl,
          selector,
          comment: comment.trim(),
          creator: user.username
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create task')
        setIsSubmitting(false)
        return
      }

      // Success
      onSuccess(data.task)
      onClose()
    } catch (error) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setComment('')
    setError('')
    onClose()
  }

  const charCount = comment.length
  const charLimit = 1000
  const isValid = comment.trim().length >= 10 && comment.length <= charLimit

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={handleCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                  Add Feedback Comment
                </Dialog.Title>

                <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Selected Element:</div>
                  <div className="text-xs font-mono text-gray-700 break-all">
                    {selector}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe the issue or suggestion... (minimum 10 characters)"
                      rows={5}
                      autoFocus
                      className={`
                        w-full px-3 py-2 border rounded-lg resize-none
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${error ? 'border-red-300' : 'border-gray-300'}
                      `}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500">
                        Minimum 10 characters
                      </div>
                      <div className={`text-xs ${charCount > charLimit ? 'text-red-600' : 'text-gray-500'}`}>
                        {charCount} / {charLimit}
                      </div>
                    </div>
                    {error && (
                      <div className="mt-2 text-sm text-red-600">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                      className="flex-1"
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> to cancel
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CommentDialog

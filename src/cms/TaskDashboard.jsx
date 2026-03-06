import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import AlertDialog from '../components/ui/AlertDialog'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { API_URL, PRODUCTION_URL } from '../config'
import { getImageUrl } from '../utils/imageUrl'

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('open')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, taskId: null })
  const [screenshotModal, setScreenshotModal] = useState({ open: false, screenshot: null })
  const [metadataModal, setMetadataModal] = useState({ open: false, metadata: null })
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`)
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        showSuccess('Task status updated')
        loadTasks()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${deleteDialog.taskId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showSuccess('Task deleted successfully')
        loadTasks()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
    setDeleteDialog({ open: false, taskId: null })
  }

  const handleViewOnPage = (task) => {
    // Navigate to the page with highlight parameter and selector
    const url = new URL(task.pageUrl)
    navigate(`${url.pathname}?highlightTask=${task.id}&selector=${encodeURIComponent(task.selector)}`)
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter)

  const statusCounts = {
    all: tasks.length,
    open: tasks.filter(t => t.status === 'open').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    archived: tasks.filter(t => t.status === 'archived').length
  }

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <p className="text-sm text-gray-600 mt-1">Visual feedback and improvement tasks</p>
          </div>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                console.log('🔄 Syncing from production...')
                const response = await fetch(`${API_URL}/api/tasks/sync-from-production`)
                console.log('📡 Response status:', response.status)
                
                if (!response.ok) {
                  const errorText = await response.text()
                  console.error('❌ Sync error:', errorText)
                  throw new Error(`Failed to sync: ${response.status}`)
                }
                
                const data = await response.json()
                console.log('✅ Sync result:', data)
                
                if (data.success) {
                  showSuccess(`✅ Synced ${data.tasks.length} tasks from production`)
                  loadTasks()
                } else {
                  throw new Error(data.error || 'Sync failed')
                }
              } catch (error) {
                console.error('❌ Sync failed:', error)
                alert(`Sync failed: ${error.message}`)
              }
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync from Production
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {successMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'open', label: 'Open' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'archived', label: 'Archived' },
            { id: 'all', label: 'All' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${filter === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                {statusCounts[tab.id]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          title={filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          description={filter === 'all' 
            ? 'Tasks will appear here when users add comments on page elements'
            : `No tasks with status "${filter}"`
          }
        />
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="border-0">
          <Table.Header>
            <Table.Row>
              <Table.Head className="w-24">ID</Table.Head>
              <Table.Head className="w-40">Page</Table.Head>
              <Table.Head className="min-w-[300px]">Comment</Table.Head>
              <Table.Head className="w-28">Creator</Table.Head>
              <Table.Head className="w-32">Date</Table.Head>
              <Table.Head className="w-36">Status</Table.Head>
              <Table.Head className="w-64">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredTasks.map((task, index) => (
              <Table.Row key={task.id}>
                <Table.Cell>
                  <div className="text-xs font-mono text-gray-900 font-semibold select-text cursor-text" title="Click to copy task ID">
                    #{task.id}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="max-w-[120px]">
                    <div className="font-medium text-gray-900 text-xs truncate" title={new URL(task.pageUrl).pathname}>
                      {new URL(task.pageUrl).pathname}
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate" title={task.selector}>
                      {task.selector}
                    </div>
                    {/* Kiro fix indicator */}
                    {task.fixedBy === 'kiro' && (
                      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Kiro
                      </div>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm text-gray-900 max-w-md line-clamp-2">
                    {task.comment}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm text-gray-600">{task.creator}</span>
                </Table.Cell>
                <Table.Cell className="text-sm text-gray-600">
                  {new Date(task.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Table.Cell>
                <Table.Cell>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`
                      text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer
                      ${statusColors[task.status]}
                    `}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1 flex-nowrap">
                    {/* Only show Fix button on localhost */}
                    {window.location.hostname === 'localhost' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          const command = `Fix task #${task.id}`
                          navigator.clipboard.writeText(command)
                          showSuccess(`✅ Copied! Paste in Kiro: "${command}"`)
                        }}
                        title="Copy command and paste in Kiro chat"
                        className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap flex-shrink-0"
                      >
                        🤖 Fix
                      </Button>
                    )}
                    {task.screenshot && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('📷 Opening screenshot modal:', task.screenshot)
                          setScreenshotModal({ open: true, screenshot: task.screenshot })
                        }}
                        title="View screenshot"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </Button>
                    )}
                    {task.metadata && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('ℹ️ Opening metadata modal:', task.metadata)
                          setMetadataModal({ open: true, metadata: task.metadata })
                        }}
                        title="View debug info"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewOnPage(task)}
                      title="View on page"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, taskId: task.id })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete task"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, taskId: null })}
        variant="danger"
      />

      {/* Screenshot Modal */}
      <Modal
        open={screenshotModal.open}
        onOpenChange={(open) => {
          console.log('📷 Modal state changing to:', open)
          if (!open) setScreenshotModal({ open: false, screenshot: null })
        }}
        title="Element Screenshot"
        size="lg"
      >
        {screenshotModal.screenshot && (
          <div>
            <img 
              src={getImageUrl(screenshotModal.screenshot)} 
              alt="Element screenshot" 
              className="w-full h-auto rounded border border-gray-300"
              onLoad={() => console.log('📷 Screenshot image loaded')}
              onError={(e) => console.error('📷 Screenshot image failed to load:', e)}
            />
          </div>
        )}
      </Modal>

      {/* Metadata Modal */}
      <Modal
        open={metadataModal.open}
        onOpenChange={(open) => {
          console.log('ℹ️ Modal state changing to:', open)
          if (!open) setMetadataModal({ open: false, metadata: null })
        }}
        title="Debug Information"
        size="md"
      >
        {metadataModal.metadata && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Viewport</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <div>Width: {metadataModal.metadata.viewport?.width}px</div>
                <div>Height: {metadataModal.metadata.viewport?.height}px</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Screen</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <div>Width: {metadataModal.metadata.screen?.width}px</div>
                <div>Height: {metadataModal.metadata.screen?.height}px</div>
                <div>Pixel Ratio: {metadataModal.metadata.devicePixelRatio}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Scroll Position</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <div>X: {metadataModal.metadata.scrollPosition?.x}px</div>
                <div>Y: {metadataModal.metadata.scrollPosition?.y}px</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Browser</h3>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono break-all">
                {metadataModal.metadata.userAgent}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Timestamp</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                {new Date(metadataModal.metadata.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TaskDashboard

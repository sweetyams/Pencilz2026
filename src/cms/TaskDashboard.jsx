import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import AlertDialog from '../components/ui/AlertDialog'
import EmptyState from '../components/ui/EmptyState'
import { API_URL } from '../config'

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, taskId: null })
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
    // Navigate to the page with highlight parameter
    const url = new URL(task.pageUrl)
    navigate(`${url.pathname}?highlightTask=${task.id}`)
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
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <p className="text-sm text-gray-600 mt-1">Visual feedback and improvement tasks</p>
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
            { id: 'all', label: 'All' },
            { id: 'open', label: 'Open' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'archived', label: 'Archived' }
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
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Page</Table.Head>
              <Table.Head>Comment</Table.Head>
              <Table.Head>Creator</Table.Head>
              <Table.Head>Date</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head className="w-32"></Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredTasks.map(task => (
              <Table.Row key={task.id}>
                <Table.Cell>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {new URL(task.pageUrl).pathname}
                    </div>
                    <div className="text-xs text-gray-500 font-mono truncate max-w-xs" title={task.selector}>
                      {task.selector}
                    </div>
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
                  <div className="flex items-center gap-2">
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
    </div>
  )
}

export default TaskDashboard

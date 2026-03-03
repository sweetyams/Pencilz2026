import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Table from '../components/ui/Table'
import AlertDialog from '../components/ui/AlertDialog'
import EmptyState from '../components/ui/EmptyState'
import { API_URL } from '../config'

const UserDashboard = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null })
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`)
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAddForm = () => {
    setFormData({ username: '', password: '' })
    setFormError('')
    setEditingUser(null)
    setShowAddForm(true)
  }

  const handleOpenEditForm = (user) => {
    setFormData({ username: user.username, password: '' })
    setFormError('')
    setEditingUser(user)
    setShowAddForm(true)
  }

  const handleCloseForm = () => {
    setShowAddForm(false)
    setEditingUser(null)
    setFormData({ username: '', password: '' })
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      // Validation
      if (!formData.username.trim()) {
        setFormError('Username is required')
        setFormLoading(false)
        return
      }

      if (!editingUser && !formData.password) {
        setFormError('Password is required')
        setFormLoading(false)
        return
      }

      if (formData.password && formData.password.length < 8) {
        setFormError('Password must be at least 8 characters')
        setFormLoading(false)
        return
      }

      const url = editingUser 
        ? `${API_URL}/api/users/${editingUser.id}`
        : `${API_URL}/api/users`
      
      const method = editingUser ? 'PUT' : 'POST'
      
      const body = editingUser
        ? formData.password 
          ? { username: formData.username, password: formData.password }
          : { username: formData.username }
        : { username: formData.username, password: formData.password }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setFormError(data.error || 'Failed to save user')
        setFormLoading(false)
        return
      }

      // Success
      showSuccess(editingUser ? 'User updated successfully' : 'User created successfully')
      handleCloseForm()
      loadUsers()
    } catch (error) {
      setFormError('An error occurred. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${deleteDialog.userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showSuccess('User deleted successfully')
        loadUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
    setDeleteDialog({ open: false, userId: null })
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading users...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-sm text-gray-600 mt-1">Manage CMS user accounts</p>
        </div>
        <Button onClick={handleOpenAddForm}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {successMessage}
        </div>
      )}

      {users.length === 0 ? (
        <EmptyState
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          title="No users yet"
          description="Add your first user to get started"
          action={handleOpenAddForm}
          actionLabel="Add User"
        />
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Username</Table.Head>
              <Table.Head>Created</Table.Head>
              <Table.Head className="w-32"></Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map(user => (
              <Table.Row key={user.id}>
                <Table.Cell>
                  <div className="font-medium text-gray-900">{user.username}</div>
                </Table.Cell>
                <Table.Cell className="text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleOpenEditForm(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, userId: user.id })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Add/Edit User Modal */}
      <Transition appear show={showAddForm} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseForm}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter username"
                      required
                      autoFocus
                    />

                    <Input
                      label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      required={!editingUser}
                      error={formError}
                      helperText="Minimum 8 characters"
                    />

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCloseForm}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={formLoading}
                        className="flex-1"
                      >
                        {editingUser ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, userId: null })}
        variant="danger"
      />
    </div>
  )
}

export default UserDashboard

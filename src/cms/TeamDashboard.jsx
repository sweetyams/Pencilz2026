import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import TeamForm from './TeamForm'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import AlertDialog from '../components/ui/AlertDialog'

const TeamDashboard = () => {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingMember, setEditingMember] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = () => {
    fetch(`${API_URL}/api/team`)
      .then(res => res.json())
      .then(data => {
        setTeam(data.sort((a, b) => (a.order || 0) - (b.order || 0)))
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading team:', err)
        setLoading(false)
      })
  }

  const handleSave = async (data) => {
    try {
      const method = data.id ? 'PUT' : 'POST'
      const response = await fetch(`${API_URL}/api/team${data.id ? `/${data.id}` : ''}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to save')

      await loadTeam()
      setEditingMember(null)
      setIsCreating(false)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Error saving team member')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/team/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      await loadTeam()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting team member:', error)
      alert('Error deleting team member')
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return
      }
    }
    setEditingMember(null)
    setIsCreating(false)
    setHasUnsavedChanges(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (isCreating || editingMember) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingMember ? 'Edit Team Member' : 'Add Team Member'}
          </h1>
        </div>
        <TeamForm
          member={editingMember}
          onSave={handleSave}
          onCancel={handleCancel}
          onFormChange={() => setHasUnsavedChanges(true)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          Add Team Member
        </Button>
      </div>

      {team.length === 0 ? (
        <EmptyState
          title="No team members yet"
          description="Get started by adding your first team member"
          actionLabel="Add Team Member"
          onAction={() => setIsCreating(true)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            {member.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {member.email || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{member.order || 0}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingMember(member)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteConfirm(member)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <AlertDialog
          title="Delete Team Member"
          message={`Are you sure you want to delete ${deleteConfirm.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}

export default TeamDashboard

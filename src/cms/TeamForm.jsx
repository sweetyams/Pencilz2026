import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import FormSection from '../components/ui/FormSection'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import FileInput from '../components/ui/FileInput'
import Button from '../components/ui/Button'

const TeamForm = ({ member = {}, onSave, onCancel, onFormChange }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    values: {
      id: member.id || undefined,
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      email: member.email || '',
      image: member.image || '',
      order: member.order || 0
    }
  })

  useEffect(() => {
    if (isDirty && onFormChange) {
      onFormChange()
    }
  }, [isDirty, onFormChange])

  const handleImageUpload = async (file) => {
    if (!file) return null
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Upload failed: ${error}`)
      }
      
      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading image: ' + error.message)
      throw error
    }
  }

  const onSubmit = (data) => {
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-8">
          <FormSection 
            title="Team Member Information"
            description="Basic details about the team member"
          >
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Full Name"
                  placeholder="e.g., John Doe"
                  error={errors.name?.message}
                  helperText="Team member's full name"
                />
              )}
            />
            
            <Controller
              name="role"
              control={control}
              rules={{ required: 'Role is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Role / Title"
                  placeholder="e.g., Creative Director"
                  error={errors.role?.message}
                  helperText="Job title or role in the company"
                />
              )}
            />
            
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Bio"
                  rows={4}
                  placeholder="Brief description about the team member..."
                  helperText="Optional short biography or description"
                />
              )}
            />
            
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="john@pencilz.io"
                  helperText="Optional contact email"
                />
              )}
            />
            
            <Controller
              name="order"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Display Order"
                  type="number"
                  placeholder="0"
                  helperText="Lower numbers appear first (0 = first)"
                />
              )}
            />
          </FormSection>

          <FormSection 
            title="Profile Photo"
            description="Upload team member photo"
          >
            <Controller
              name="image"
              control={control}
              rules={{ required: !member.image ? 'Profile photo is required' : false }}
              render={({ field }) => (
                <FileInput
                  label="Photo"
                  accept="image/*"
                  onUpload={handleImageUpload}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message}
                  helperText="Recommended: Square image, 800x800px minimum"
                />
              )}
            />
          </FormSection>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
          >
            {member?.id ? 'Save Changes' : 'Add Team Member'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default TeamForm

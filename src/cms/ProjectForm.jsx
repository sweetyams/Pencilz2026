import { useForm } from 'react-hook-form'
import { useState } from 'react'

const ProjectForm = ({ project, onSave, onCancel }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      ...project,
      services: Array.isArray(project.services) 
        ? project.services.join(', ') 
        : project.services || ''
    }
  })
  const [uploading, setUploading] = useState(false)
  const imageValue = watch('image')

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      setValue('image', `http://localhost:3001${data.url}`)
      alert('Image uploaded successfully!')
    } catch (error) {
      alert('Error uploading image. Make sure the API server is running: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">
        {project.id ? 'Edit Project' : 'Add Project'}
      </h3>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              {...register('category')}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              disabled={uploading}
            />
            <input
              {...register('image', { required: !imageValue })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Or paste image URL"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {imageValue && (
              <div className="mt-2">
                <img src={imageValue} alt="Preview" className="h-32 object-cover rounded" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Services (comma-separated)
            </label>
            <input
              {...register('services')}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Design, Development, Branding"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project Link</label>
            <input
              {...register('link')}
              type="url"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:opacity-80"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm

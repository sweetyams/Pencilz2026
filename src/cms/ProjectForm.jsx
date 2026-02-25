import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { API_URL } from '../config'

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
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      setValue('image', data.url)
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

          {/* SEO Fields */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-3">SEO Settings</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <input
                {...register('metaTitle')}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Project title for search engines"
                maxLength="60"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 50-60 characters. This appears in search results and browser tabs.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                {...register('metaDescription')}
                className="w-full px-3 py-2 border rounded-lg"
                rows="2"
                placeholder="Brief description of the project"
                maxLength="160"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 150-160 characters. This appears in search results below the title.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Keywords</label>
              <input
                {...register('metaKeywords')}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="web design, branding, shopify"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated keywords relevant to this project.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Social Share Image (OG Image)</label>
              <input
                {...register('ogImage')}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Leave blank to use project image"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1200x630px. Used when sharing on social media. Defaults to project image if empty.
              </p>
            </div>
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

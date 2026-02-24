import { useForm } from 'react-hook-form'
import { useState } from 'react'

const NewsForm = ({ newsItem, onSave, onCancel }) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: newsItem
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
      
      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      setValue('image', `http://localhost:3001${data.url}`)
      alert('Image uploaded successfully!')
    } catch (error) {
      alert('Error uploading image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">
        {newsItem.id ? 'Edit News' : 'Add News'}
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
              placeholder="Insights, News, Updates"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea
              {...register('excerpt')}
              className="w-full px-3 py-2 border rounded-lg"
              rows="2"
              placeholder="Short description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              {...register('content')}
              className="w-full px-3 py-2 border rounded-lg"
              rows="6"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              disabled={uploading}
            />
            <input
              {...register('image')}
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
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              {...register('date')}
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              required
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

export default NewsForm

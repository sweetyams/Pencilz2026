import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

const PageEditor = ({ pageName, onClose }) => {
  const { register, handleSubmit, setValue } = useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/api/pages')
      .then(res => res.json())
      .then(data => {
        if (data[pageName]) {
          setValue('title', data[pageName].title)
          setValue('content', data[pageName].content)
        }
        setLoading(false)
      })
  }, [pageName, setValue])

  const onSave = async (data) => {
    try {
      const response = await fetch(`http://localhost:3001/api/pages/${pageName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Page saved successfully!')
        onClose()
      }
    } catch (error) {
      alert('Error saving page: ' + error.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">Edit {pageName} Page</h3>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Page Title</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              {...register('content')}
              className="w-full px-3 py-2 border rounded-lg"
              rows="10"
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
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:opacity-80"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default PageEditor

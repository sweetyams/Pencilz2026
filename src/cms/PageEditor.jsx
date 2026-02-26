import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'

const PageEditor = ({ pageName, onClose }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const [loading, setLoading] = useState(true)
  const [pageData, setPageData] = useState({ title: '', content: '' })

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/api/pages`)
      .then(res => res.json())
      .then(data => {
        if (data[pageName]) {
          setPageData({
            title: data[pageName].title || '',
            content: data[pageName].content || ''
          })
        } else {
          setPageData({
            title: '',
            content: ''
          })
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [pageName])

  const onSave = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/pages/${pageName}`, {
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

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          <Input
            label="Page Title"
            {...register('title')}
            defaultValue={pageData.title}
            required
          />
          <Textarea
            label="Content"
            {...register('content')}
            defaultValue={pageData.content}
            rows={10}
            required
          />
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}

export default PageEditor

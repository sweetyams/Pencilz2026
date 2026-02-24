import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

const SettingsForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm()
  const [uploading, setUploading] = useState(false)
  const [settings, setSettings] = useState({})
  const logoValue = watch('logo')

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setValue('email', data.email)
        setValue('companyName', data.companyName)
        setValue('location', data.location)
        setValue('logo', data.logo)
      })
  }, [setValue])

  const handleLogoUpload = async (e) => {
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
      setValue('logo', `http://localhost:3001${data.url}`)
      alert('Logo uploaded successfully!')
    } catch (error) {
      alert('Error uploading logo: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const onSave = async (data) => {
    console.log('Form submitted with data:', data)
    try {
      console.log('Saving settings:', data)
      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const savedData = await response.json()
        console.log('Saved data:', savedData)
        setSettings(savedData)
        alert('Settings saved successfully!')
      } else {
        const errorText = await response.text()
        console.error('Save failed:', errorText)
        alert('Failed to save settings: ' + errorText)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings: ' + error.message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Site Settings</h3>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
            <input
              type="file"
              accept="image/*,image/svg+xml,.svg"
              onChange={handleLogoUpload}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              disabled={uploading}
            />
            <input
              {...register('logo')}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Or paste logo URL"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {logoValue && (
              <div className="mt-2">
                <img src={logoValue} alt="Logo Preview" className="h-32 object-contain rounded" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              {...register('companyName')}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Pencilz + Friends"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              {...register('location')}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Montreal"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-black text-white px-4 py-2 rounded-lg hover:opacity-80"
        >
          Save Settings
        </button>
      </form>
    </div>
  )
}

export default SettingsForm

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

const SettingsForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm()
  const [uploading, setUploading] = useState(false)
  const [uploadingHamburger, setUploadingHamburger] = useState(false)
  const [uploadingButtonIcon, setUploadingButtonIcon] = useState(false)
  const [settings, setSettings] = useState({})
  const [services, setServices] = useState([])
  const [aboutItems, setAboutItems] = useState([])
  const logoValue = watch('logo')
  const hamburgerIconValue = watch('hamburgerIcon')
  const buttonIconValue = watch('buttonIcon')

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setValue('email', data.email)
        setValue('companyName', data.companyName)
        setValue('location', data.location)
        setValue('logo', data.logo)
        setValue('hamburgerIcon', data.hamburgerIcon)
        setValue('buttonIcon', data.buttonIcon)
        setValue('servicesDescription', data.servicesDescription)
        setValue('aboutDescription', data.aboutDescription)
        setServices(data.services || [])
        setAboutItems(data.aboutItems || [])
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

  const handleHamburgerIconUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingHamburger(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      setValue('hamburgerIcon', `http://localhost:3001${data.url}`)
      alert('Hamburger icon uploaded successfully!')
    } catch (error) {
      alert('Error uploading hamburger icon: ' + error.message)
    } finally {
      setUploadingHamburger(false)
    }
  }

  const handleButtonIconUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingButtonIcon(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      setValue('buttonIcon', `http://localhost:3001${data.url}`)
      alert('Button icon uploaded successfully!')
    } catch (error) {
      alert('Error uploading button icon: ' + error.message)
    } finally {
      setUploadingButtonIcon(false)
    }
  }

  const onSave = async (data) => {
    console.log('Form submitted with data:', data)
    try {
      const payload = {
        ...data,
        services,
        aboutItems
      }
      console.log('Saving settings:', payload)
      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const savedData = await response.json()
        console.log('Saved data:', savedData)
        setSettings(savedData)
        setServices(savedData.services || [])
        setAboutItems(savedData.aboutItems || [])
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

  const addService = () => {
    setServices([...services, {
      id: Date.now().toString(),
      name: '',
      link: ''
    }])
  }

  const removeService = (id) => {
    setServices(services.filter(s => s.id !== id))
  }

  const updateService = (id, field, value) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const addAboutItem = () => {
    setAboutItems([...aboutItems, {
      id: Date.now().toString(),
      name: '',
      link: ''
    }])
  }

  const removeAboutItem = (id) => {
    setAboutItems(aboutItems.filter(a => a.id !== id))
  }

  const updateAboutItem = (id, field, value) => {
    setAboutItems(aboutItems.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ))
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
            <label className="block text-sm font-medium mb-1">Hamburger Menu Icon</label>
            <input
              type="file"
              accept="image/*,image/svg+xml,.svg"
              onChange={handleHamburgerIconUpload}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              disabled={uploadingHamburger}
            />
            <input
              {...register('hamburgerIcon')}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Or paste hamburger icon URL"
            />
            {uploadingHamburger && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {hamburgerIconValue && (
              <div className="mt-2">
                <img src={hamburgerIconValue} alt="Hamburger Icon Preview" className="h-16 object-contain rounded" />
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
          <div>
            <label className="block text-sm font-medium mb-1">Button Arrow Icon (SVG)</label>
            <input
              type="file"
              accept="image/svg+xml,.svg"
              onChange={handleButtonIconUpload}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              disabled={uploadingButtonIcon}
            />
            <input
              {...register('buttonIcon')}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Or paste button icon URL"
            />
            {uploadingButtonIcon && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {buttonIconValue && (
              <div className="mt-2">
                <img src={buttonIconValue} alt="Button Icon Preview" className="h-8 object-contain rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Services Menu Items</h4>
            <button
              type="button"
              onClick={addService}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              + Add Service
            </button>
          </div>

          {services.map((service, index) => (
            <div key={service.id} className="border rounded-lg p-4 mb-3 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium">Service {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Service Name</label>
                  <input
                    value={service.name}
                    onChange={(e) => updateService(service.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Shopify builds"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Link URL</label>
                  <input
                    value={service.link}
                    onChange={(e) => updateService(service.id, 'link', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., /services or https://example.com"
                  />
                </div>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              No services yet. Click "Add Service" to create one.
            </p>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Services Description</label>
            <textarea
              {...register('servicesDescription')}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              placeholder="Description text that appears in the services megamenu"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">About Menu Items</h4>
            <button
              type="button"
              onClick={addAboutItem}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              + Add About Item
            </button>
          </div>

          {aboutItems.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 mb-3 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium">About Item {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeAboutItem(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Item Name</label>
                  <input
                    value={item.name}
                    onChange={(e) => updateAboutItem(item.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Our Story"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Link URL</label>
                  <input
                    value={item.link}
                    onChange={(e) => updateAboutItem(item.id, 'link', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., /about or https://example.com"
                  />
                </div>
              </div>
            </div>
          ))}

          {aboutItems.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              No about items yet. Click "Add About Item" to create one.
            </p>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">About Description</label>
            <textarea
              {...register('aboutDescription')}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              placeholder="Description text that appears in the about megamenu"
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

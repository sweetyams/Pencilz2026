import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const HomePageForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm()
  const [uploadingHero, setUploadingHero] = useState(false)
  const [homePage, setHomePage] = useState({})
  const [heroButtons, setHeroButtons] = useState([])
  const heroImageValue = watch('heroImage')

  useEffect(() => {
    fetch(`${API_URL}/api/pages/home`)
      .then(res => {
        console.log('Fetch response status:', res.status)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('Loaded home page data:', data)
        setHomePage(data)
        setValue('heroImage', data.heroImage)
        setValue('heroText', data.heroText)
        setValue('metaTitle', data.metaTitle)
        setValue('metaDescription', data.metaDescription)
        setValue('metaKeywords', data.metaKeywords)
        setValue('ogImage', data.ogImage)
        setHeroButtons(data.heroButtons || [])
      })
      .catch(error => {
        console.error('Error loading home page:', error)
      })
  }, [setValue])

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingHero(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      setValue('heroImage', `${API_URL}${data.url}`)
      alert('Hero image uploaded successfully!')
    } catch (error) {
      alert('Error uploading hero image: ' + error.message)
    } finally {
      setUploadingHero(false)
    }
  }

  const onSave = async (data) => {
    try {
      const payload = {
        ...data,
        heroButtons
      }
      
      console.log('Saving payload:', payload)
      
      const response = await fetch(`${API_URL}/api/pages/home`, {
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
        setHomePage(savedData)
        setHeroButtons(savedData.heroButtons || [])
        alert('Home page settings saved successfully!')
      } else {
        const errorText = await response.text()
        console.error('Save failed:', errorText)
        alert('Failed to save home page settings: ' + errorText)
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving home page settings: ' + error.message)
    }
  }

  const addHeroButton = () => {
    setHeroButtons([...heroButtons, {
      id: Date.now().toString(),
      text: '',
      subtext: '',
      icon: '',
      link: ''
    }])
  }

  const removeHeroButton = (id) => {
    setHeroButtons(heroButtons.filter(btn => btn.id !== id))
  }

  const updateHeroButton = (id, field, value) => {
    setHeroButtons(heroButtons.map(btn => 
      btn.id === id ? { ...btn, [field]: value } : btn
    ))
  }

  const handleButtonIconUpload = async (id, e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      updateHeroButton(id, 'icon', `${API_URL}${data.url}`)
      alert('Icon uploaded successfully!')
    } catch (error) {
      alert('Error uploading icon: ' + error.message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Home Page Settings</h3>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hero Background Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroImageUpload}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              disabled={uploadingHero}
            />
            <input
              {...register('heroImage')}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Or paste hero image URL"
            />
            {uploadingHero && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {heroImageValue && (
              <div className="mt-2">
                <img src={heroImageValue} alt="Hero Image Preview" className="h-32 object-cover rounded w-full" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Text</label>
            <input
              {...register('heroText')}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Your start up accelerator"
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
                placeholder="Pencilz - Your start up accelerator"
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
                placeholder="Brief description of your services and what makes you unique"
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
                placeholder="shopify, web design, marketing, startup"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated keywords relevant to your business.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Social Share Image (OG Image)</label>
              <input
                {...register('ogImage')}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Leave blank to use hero image"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1200x630px. Used when sharing on social media. Defaults to hero image if empty.
              </p>
            </div>
          </div>

          {/* Hero Buttons Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Hero Buttons</h4>
              <button
                type="button"
                onClick={addHeroButton}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                + Add Button
              </button>
            </div>

            {heroButtons.map((button, index) => (
              <div key={button.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">Button {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeHeroButton(button.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Button Text</label>
                    <input
                      value={button.text}
                      onChange={(e) => updateHeroButton(button.id, 'text', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., Shopify builds"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Subtext (optional)</label>
                    <input
                      value={button.subtext}
                      onChange={(e) => updateHeroButton(button.id, 'subtext', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., Starter packs available"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Link URL</label>
                    <input
                      value={button.link}
                      onChange={(e) => updateHeroButton(button.id, 'link', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., /services or https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Icon (SVG)</label>
                    <input
                      type="file"
                      accept="image/svg+xml,.svg"
                      onChange={(e) => handleButtonIconUpload(button.id, e)}
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    />
                    <input
                      value={button.icon}
                      onChange={(e) => updateHeroButton(button.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Or paste icon URL"
                    />
                    {button.icon && (
                      <div className="mt-2">
                        <img src={button.icon} alt="Icon Preview" className="h-8 object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {heroButtons.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                No hero buttons yet. Click "Add Button" to create one.
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-black text-white px-4 py-2 rounded-lg hover:opacity-80"
        >
          Save Home Page Settings
        </button>
      </form>
    </div>
  )
}

export default HomePageForm

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Card from '../components/ui/Card'
import FormSection from '../components/ui/FormSection'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import FileInput from '../components/ui/FileInput'
import Button from '../components/ui/Button'
import SortableList from '../components/ui/SortableList'
import TagInput from '../components/ui/TagInput'

const ServicePageForm = ({ onFormChange, onSaveSuccess, onCancelRef }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { isDirty } } = useForm()
  const [serviceCards, setServiceCards] = useState([])
  const [initialServiceCards, setInitialServiceCards] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [availableServices, setAvailableServices] = useState([])

  const serviceCardsChanged = JSON.stringify(serviceCards) !== JSON.stringify(initialServiceCards)
  const serviceArrowIconValue = watch('serviceArrowIcon')

  useEffect(() => {
    if (onCancelRef) {
      onCancelRef.current = () => {
        loadData()
      }
    }
  }, [onCancelRef])

  useEffect(() => {
    if (isInitialized && (isDirty || serviceCardsChanged) && onFormChange) {
      onFormChange()
    }
  }, [isDirty, serviceCardsChanged, onFormChange, isInitialized])

  const loadData = () => {
    setIsInitialized(false)
    
    // Load settings for available services
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        setAvailableServices(data.projectServices || [])
      })
      .catch(err => console.error('Error loading settings:', err))

    // Load services page data
    fetch(`${API_URL}/api/pages`)
      .then(res => res.json())
      .then(data => {
        const servicesData = data.services || {
          heroTitle: 'Our Services',
          heroSubtitle: '',
          heroDescription: '',
          serviceCards: []
        }
        
        const formData = {
          heroTitle: servicesData.heroTitle || 'Our Services',
          heroSubtitle: servicesData.heroSubtitle || '',
          heroDescription: servicesData.heroDescription || '',
          serviceArrowIcon: servicesData.serviceArrowIcon || ''
        }
        
        reset(formData)
        setServiceCards(servicesData.serviceCards || [])
        setInitialServiceCards(servicesData.serviceCards || [])
        
        setTimeout(() => {
          setIsInitialized(true)
        }, 100)
      })
      .catch(err => console.error('Error loading services page:', err))
  }

  useEffect(() => {
    loadData()
  }, [])

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
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      return data.url
    } catch (error) {
      alert('Error uploading image: ' + error.message)
      throw error
    }
  }

  const onSave = async (data) => {
    try {
      const payload = {
        ...data,
        serviceCards
      }
      
      const response = await fetch(`${API_URL}/api/pages/services`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        const savedData = await response.json()
        setServiceCards(savedData.serviceCards || [])
        setInitialServiceCards(savedData.serviceCards || [])
        reset({
          heroTitle: savedData.heroTitle,
          heroSubtitle: savedData.heroSubtitle,
          heroDescription: savedData.heroDescription,
          serviceArrowIcon: savedData.serviceArrowIcon
        })
        if (onSaveSuccess) {
          onSaveSuccess()
        }
        alert('Services page saved successfully!')
      } else {
        alert('Failed to save services page')
      }
    } catch (error) {
      alert('Error saving services page: ' + error.message)
    }
  }

  const addServiceCard = () => {
    setServiceCards([...serviceCards, {
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      description: '',
      detailedDescription: '',
      image: '',
      backgroundColor: '#fff0dc',
      invertText: false,
      anchor: '',
      subServicesTitle: 'Services',
      subServices: []
    }])
  }

  const removeServiceCard = (id) => {
    setServiceCards(serviceCards.filter(card => card.id !== id))
  }

  const updateServiceCard = (id, field, value) => {
    setServiceCards(serviceCards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ))
  }

  const addSubService = (cardId) => {
    setServiceCards(serviceCards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          subServices: [...(card.subServices || []), {
            id: Date.now().toString(),
            name: '',
            highlighted: false
          }]
        }
      }
      return card
    }))
  }

  const removeSubService = (cardId, serviceId) => {
    setServiceCards(serviceCards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          subServices: card.subServices.filter(s => s.id !== serviceId)
        }
      }
      return card
    }))
  }

  const updateSubService = (cardId, serviceId, field, value) => {
    setServiceCards(serviceCards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          subServices: card.subServices.map(s => 
            s.id === serviceId ? { ...s, [field]: value } : s
          )
        }
      }
      return card
    }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-6">Services Page Settings</h3>
      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        {/* Hero Section */}
        <Card>
          <FormSection title="Hero Section">
            <Input
              label="Hero Title"
              {...register('heroTitle')}
              placeholder="e.g., Our Services"
            />
            <Input
              label="Hero Subtitle"
              {...register('heroSubtitle')}
              placeholder="e.g., Enterprise-Level Expertise, Tailored for Growing Brands"
            />
            <Textarea
              label="Hero Description"
              {...register('heroDescription')}
              rows={2}
              placeholder="e.g., Shopify Development, Marketing, Design, and Start-up Support"
            />
          </FormSection>
        </Card>

        {/* Service Arrow Icon */}
        <Card>
          <FormSection title="Service Arrow Icon">
            <FileInput
              label="Arrow Icon (SVG)"
              accept="image/svg+xml,.svg"
              onUpload={handleImageUpload}
              value={watch('serviceArrowIcon')}
              onChange={(url) => setValue('serviceArrowIcon', url, { shouldDirty: true })}
              helperText="Upload an SVG icon to display next to each sub-service item"
            />
          </FormSection>
        </Card>

        {/* Service Cards */}
        <Card>
          <FormSection title="Service Cards">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-sm">Service Cards</h4>
              <Button
                type="button"
                onClick={addServiceCard}
                variant="secondary"
                size="sm"
              >
                + Add Service Card
              </Button>
            </div>

            <SortableList
              items={serviceCards}
              onReorder={setServiceCards}
              emptyMessage="No service cards yet. Click 'Add Service Card' to create one."
              defaultOpen={false}
              getTitleFromItem={(card) => card.title || 'Untitled Service'}
              getHeaderActions={(card) => (
                <div
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeServiceCard(card.id)
                  }}
                  className="text-red-600 hover:text-red-800 text-xl leading-none px-2 py-1 cursor-pointer select-none"
                  title="Remove card"
                  role="button"
                  tabIndex={0}
                >
                  ×
                </div>
              )}
              renderItem={(card) => (
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={card.title}
                    onChange={(e) => updateServiceCard(card.id, 'title', e.target.value)}
                    placeholder="e.g., Shopify Builds"
                  />
                  <Input
                    label="Subtitle"
                    value={card.subtitle}
                    onChange={(e) => updateServiceCard(card.id, 'subtitle', e.target.value)}
                    placeholder="e.g., Lorem Ipsum"
                  />
                  <Input
                    label="Anchor ID (for linking)"
                    value={card.anchor}
                    onChange={(e) => updateServiceCard(card.id, 'anchor', e.target.value)}
                    placeholder="e.g., shopify-builds"
                    helperText="Used for anchor links like #shopify-builds"
                  />
                  <Textarea
                    label="Description"
                    value={card.description}
                    onChange={(e) => updateServiceCard(card.id, 'description', e.target.value)}
                    rows={3}
                    placeholder="Main description"
                  />
                  <Textarea
                    label="Detailed Description (optional)"
                    value={card.detailedDescription}
                    onChange={(e) => updateServiceCard(card.id, 'detailedDescription', e.target.value)}
                    rows={3}
                    placeholder="Additional details"
                  />
                  <FileInput
                    label="Card Image"
                    accept="image/*"
                    onUpload={handleImageUpload}
                    value={card.image}
                    onChange={(url) => updateServiceCard(card.id, 'image', url)}
                    helperText="Image shown on the right side of the card"
                  />
                  <Input
                    label="Background Color"
                    type="text"
                    value={card.backgroundColor}
                    onChange={(e) => updateServiceCard(card.id, 'backgroundColor', e.target.value)}
                    placeholder="#fff0dc"
                    helperText="Enter hex color code (e.g., #fff0dc)"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={card.backgroundColor}
                      onChange={(e) => updateServiceCard(card.id, 'backgroundColor', e.target.value)}
                      className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">Color picker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`invert-${card.id}`}
                      checked={card.invertText}
                      onChange={(e) => updateServiceCard(card.id, 'invertText', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor={`invert-${card.id}`} className="text-sm">
                      Invert text color (use white text on dark backgrounds)
                    </label>
                  </div>

                  {/* Sub Services */}
                  <div className="border-t pt-4 mt-4">
                    <div className="mb-3">
                      <Input
                        label="Sub Services Section Title"
                        value={card.subServicesTitle}
                        onChange={(e) => updateServiceCard(card.id, 'subServicesTitle', e.target.value)}
                        placeholder="e.g., Services"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-sm">Sub Services</h5>
                      <Button
                        type="button"
                        onClick={() => addSubService(card.id)}
                        variant="secondary"
                        size="sm"
                      >
                        + Add Sub Service
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Select from available service tags or add new ones in Settings → Service Tags
                    </p>
                    {card.subServices?.map((service) => (
                      <div key={service.id} className="flex gap-2 items-start mb-2 p-2 bg-gray-50 rounded">
                        <div className="flex-1 space-y-2">
                          <select
                            value={service.name}
                            onChange={(e) => updateSubService(card.id, service.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a service...</option>
                            {availableServices.map((s) => (
                              <option key={s.id} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`highlight-${service.id}`}
                              checked={service.highlighted}
                              onChange={(e) => updateSubService(card.id, service.id, 'highlighted', e.target.checked)}
                              className="rounded"
                            />
                            <label htmlFor={`highlight-${service.id}`} className="text-xs">
                              Highlighted
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSubService(card.id, service.id)}
                          className="text-red-600 hover:text-red-800 text-xl leading-none px-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
          </FormSection>
        </Card>

        <Button type="submit" className="w-full">
          Save Services Page
        </Button>
      </form>
    </div>
  )
}

export default ServicePageForm

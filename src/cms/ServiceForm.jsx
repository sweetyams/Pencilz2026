import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Card from '../components/ui/Card'
import FormSection from '../components/ui/FormSection'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import SortableList from '../components/ui/SortableList'
import AlertDialog from '../components/ui/AlertDialog'

const ServiceForm = ({ onFormChange, onSaveSuccess, onCancelRef }) => {
  const [services, setServices] = useState([])
  const [initialServices, setInitialServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, service: null })

  const servicesChanged = JSON.stringify(services) !== JSON.stringify(initialServices)

  useEffect(() => {
    if (onCancelRef) {
      onCancelRef.current = () => {
        loadServices()
      }
    }
  }, [onCancelRef])

  useEffect(() => {
    if (isInitialized && servicesChanged && onFormChange) {
      onFormChange()
    }
  }, [servicesChanged, onFormChange, isInitialized])

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setIsInitialized(false)
    try {
      const response = await fetch(`${API_URL}/api/settings`)
      const data = await response.json()
      setServices(data.projectServices || [])
      setInitialServices(data.projectServices || [])
      setIsInitialized(true)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/settings`)
      const currentSettings = await response.json()

      const updatedSettings = {
        ...currentSettings,
        projectServices: services
      }

      const saveResponse = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      })

      if (saveResponse.ok) {
        setInitialServices(services)
        if (onSaveSuccess) {
          onSaveSuccess()
        }
        alert('Services saved successfully!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving services:', error)
      alert('Error saving services: ' + error.message)
    }
  }

  const addService = () => {
    setServices([...services, {
      id: `service-${Date.now()}`,
      name: '',
      link: '',
      usageCount: 0
    }])
  }

  const updateService = (id, field, value) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const removeService = async (id) => {
    const service = services.find(s => s.id === id)
    
    if (!service) return
    
    if (service.usageCount > 0) {
      setDeleteConfirm({ show: true, service })
      return
    }
    
    await performDelete(service)
  }

  const performDelete = async (service) => {
    if (service.usageCount > 0) {
      try {
        const projectsResponse = await fetch(`${API_URL}/api/projects`)
        const projects = await projectsResponse.json()
        
        const updatePromises = projects
          .filter(project => Array.isArray(project.services) && project.services.includes(service.name))
          .map(async project => {
            const updatedProject = {
              ...project,
              services: project.services.filter(s => s !== service.name)
            }
            
            return fetch(`${API_URL}/api/projects/${project.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedProject)
            })
          })
        
        await Promise.all(updatePromises)
      } catch (error) {
        console.error('Error cleaning up project references:', error)
        alert('Error removing service from projects: ' + error.message)
        return
      }
    }
    
    const updatedServices = services.filter(s => s.id !== service.id)
    setServices(updatedServices)
    await saveUpdatedServices(updatedServices)
  }

  const saveUpdatedServices = async (servicesToSave) => {
    try {
      const response = await fetch(`${API_URL}/api/settings`)
      const currentSettings = await response.json()

      const updatedSettings = {
        ...currentSettings,
        projectServices: servicesToSave
      }

      const saveResponse = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      })
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save services')
      }
      
      setInitialServices(servicesToSave)
    } catch (error) {
      console.error('Error auto-saving services:', error)
      alert('Error saving services: ' + error.message)
      throw error
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-6">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-6">Project Services</h3>
      <div className="space-y-6">
        <Card>
          <FormSection title="Services">
            <p className="text-sm text-gray-600 mb-4">
              Manage project services. Each project can have multiple services (e.g., Development, Design, Marketing).
            </p>
            
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-sm">All Services</h4>
              <Button
                type="button"
                onClick={addService}
                variant="secondary"
                size="sm"
              >
                + Add Service
              </Button>
            </div>

            <SortableList
              items={services}
              onReorder={setServices}
              emptyMessage="No services yet. Click 'Add Service' to create one."
              defaultOpen={false}
              getTitleFromItem={(service) => service.name || 'Untitled Service'}
              getHeaderActions={(service) => (
                <div
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeService(service.id)
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className="text-red-600 hover:text-red-800 text-xl leading-none px-2 py-1 cursor-pointer select-none"
                  title="Remove service"
                  role="button"
                  tabIndex={0}
                >
                  ×
                </div>
              )}
              renderItem={(service) => (
                <div className="space-y-3">
                  <Input
                    label="Service Name"
                    value={service.name}
                    onChange={(e) => updateService(service.id, 'name', e.target.value)}
                    placeholder="e.g., Development, Design, Marketing"
                  />
                  <Input
                    label="Link (optional)"
                    value={service.link || ''}
                    onChange={(e) => updateService(service.id, 'link', e.target.value)}
                    placeholder="e.g., /services/development"
                    helperText="Optional link to a page about this service"
                  />
                </div>
              )}
            />
          </FormSection>
        </Card>

        <Button onClick={saveServices} className="w-full">
          Save Services
        </Button>
      </div>

      <AlertDialog
        open={deleteConfirm.show}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteConfirm({ show: false, service: null })
          }
        }}
        title="Delete Service"
        description={
          deleteConfirm.service
            ? `"${deleteConfirm.service.name}" is used in ${deleteConfirm.service.usageCount} project(s). Deleting this service will remove it from all projects. This action cannot be undone.`
            : ''
        }
        confirmText="Delete Service"
        cancelText="Cancel"
        onConfirm={async () => {
          if (deleteConfirm.service) {
            await performDelete(deleteConfirm.service)
          }
        }}
        variant="danger"
      />
    </div>
  )
}

export default ServiceForm

import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import FormSection from '../components/ui/FormSection'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import FileInput from '../components/ui/FileInput'
import TagInput from '../components/ui/TagInput'
import Button from '../components/ui/Button'
import RichTextEditor from '../components/ui/RichTextEditor'

const ProjectForm = ({ project = {}, onSave, onCancel, onFormChange }) => {
  const [availableCategories, setAvailableCategories] = useState([])
  const [availableServices, setAvailableServices] = useState([])
  
  // Load categories and services
  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        setAvailableCategories(data.categories || [])
        setAvailableServices(data.projectServices || [])
      })
      .catch(err => console.error('Error loading categories/services:', err))
  }, [])
  
  // Convert project services/category to tag format, filtering out removed items
  const projectServices = Array.isArray(project.services)
    ? project.services
        .map(s => {
          const serviceName = typeof s === 'string' ? s : s.name
          // Only include if service exists in available services
          const existsInServices = availableServices.some(srv => srv.name === serviceName)
          if (!existsInServices && availableServices.length > 0) {
            console.warn(`Service "${serviceName}" no longer exists, filtering out`)
            return null
          }
          return typeof s === 'string' ? { id: s, name: s, link: '' } : s
        })
        .filter(Boolean)
    : []
  
  const projectCategory = project.category 
    ? (() => {
        const categoryName = typeof project.category === 'string' ? project.category : project.category.name
        // Only include if category exists in available categories
        const existsInCategories = availableCategories.some(cat => cat.name === categoryName)
        if (!existsInCategories && availableCategories.length > 0) {
          console.warn(`Category "${categoryName}" no longer exists, filtering out`)
          return []
        }
        return [typeof project.category === 'string' ? { id: project.category, name: project.category, link: '' } : project.category]
      })()
    : []

  const { control, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    values: {
      id: project.id || undefined,
      title: project.title || '',
      category: projectCategory,
      link: project.link || '',
      description: project.description || '',
      services: projectServices,
      image: project.image || '',
      swatchColor: project.swatchColor || '#000000',
      startYear: project.startYear || new Date().getFullYear(),
      endYear: project.endYear || 'Present',
      featuredOnHome: project.featuredOnHome || false,
      metaTitle: project.metaTitle || '',
      metaDescription: project.metaDescription || '',
      metaKeywords: project.metaKeywords || '',
      ogImage: project.ogImage || ''
    }
  })

  // Watch the image field to debug
  const imageValue = watch('image')
  console.log('🎨 ProjectForm: Current image value from form:', imageValue)
  console.log('📦 ProjectForm: Project prop:', project)

  // Notify parent of changes
  useEffect(() => {
    if (isDirty && onFormChange) {
      onFormChange()
    }
  }, [isDirty, onFormChange])

  // Reset form when project changes (for cancel/discard)
  useEffect(() => {
    // Only reset if we have categories and services loaded
    if (availableCategories.length === 0 && availableServices.length === 0) return
    
    reset({
      id: project.id || undefined,
      title: project.title || '',
      category: projectCategory,
      link: project.link || '',
      description: project.description || '',
      services: projectServices,
      image: project.image || '',
      swatchColor: project.swatchColor || '#000000',
      startYear: project.startYear || new Date().getFullYear(),
      endYear: project.endYear || 'Present',
      featuredOnHome: project.featuredOnHome || false,
      metaTitle: project.metaTitle || '',
      metaDescription: project.metaDescription || '',
      metaKeywords: project.metaKeywords || '',
      ogImage: project.ogImage || ''
    })
  }, [project, reset, availableCategories, availableServices])

  const handleCreateCategory = (name) => {
    const newCategory = {
      id: `category-${Date.now()}`,
      name: name,
      link: '',
      usageCount: 0
    }
    setAvailableCategories([...availableCategories, newCategory])
    
    // Save to settings
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(settings => {
        const updated = {
          ...settings,
          categories: [...(settings.categories || []), newCategory]
        }
        return fetch(`${API_URL}/api/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        })
      })
      .catch(err => console.error('Error saving new category:', err))
    
    return newCategory
  }

  const handleCreateService = (name) => {
    const newService = {
      id: `service-${Date.now()}`,
      name: name,
      link: '',
      usageCount: 0
    }
    setAvailableServices([...availableServices, newService])
    
    // Save to settings
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(settings => {
        const updated = {
          ...settings,
          projectServices: [...(settings.projectServices || []), newService]
        }
        return fetch(`${API_URL}/api/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        })
      })
      .catch(err => console.error('Error saving new service:', err))
    
    return newService
  }

  const handleImageUpload = async (file) => {
    if (!file) return null
    
    console.log('📤 ProjectForm: Starting upload for:', file.name)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Upload failed: ${error}`)
      }
      
      const data = await response.json()
      console.log('✅ ProjectForm: Upload successful, URL:', data.url)
      console.log('📊 ProjectForm: Full response:', data)
      return data.url
    } catch (error) {
      console.error('❌ ProjectForm: Upload error:', error)
      alert('Error uploading image: ' + error.message)
      throw error
    }
  }

  const onSubmit = (data) => {
    // Format data for storage
    const formattedData = {
      ...data,
      services: Array.isArray(data.services) 
        ? data.services.map(s => s.name || s)
        : [],
      category: Array.isArray(data.category) && data.category.length > 0
        ? data.category[0].name || data.category[0]
        : data.category || '',
      swatchColor: data.swatchColor || '#000000',
      startYear: parseInt(data.startYear) || new Date().getFullYear(),
      endYear: data.endYear === 'Present' ? 'Present' : parseInt(data.endYear),
      featuredOnHome: Boolean(data.featuredOnHome)
    }
    onSave(formattedData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-8">
          {/* Basic Information Section */}
          <FormSection 
            title="Basic Information"
            description="Essential details about the project"
          >
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Project title is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Project Title"
                  placeholder="e.g., Humanrace Website Redesign"
                  error={errors.title?.message}
                  helperText="This will be displayed as the main project heading"
                />
              )}
            />
            
            <Controller
              name="category"
              control={control}
              rules={{ 
                required: 'Category is required',
                validate: value => (Array.isArray(value) && value.length > 0) || 'Category is required'
              }}
              render={({ field }) => (
                <TagInput
                  label="Category"
                  value={field.value || []}
                  onChange={(tags) => field.onChange(tags.slice(0, 1))} // Only allow one category
                  availableTags={availableCategories}
                  onCreateTag={handleCreateCategory}
                  placeholder="Select or create category..."
                  error={errors.category?.message}
                  helperText="Select one category (e.g., Skincare, Fashion, SaaS)"
                />
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="link"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Project Link"
                    type="url"
                    placeholder="https://example.com"
                    helperText="Optional external link to the live project"
                  />
                )}
              />
              
              <Controller
                name="swatchColor"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        {...field}
                        type="color"
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Brand or accent color for this project</p>
                  </div>
                )}
              />
            </div>
            
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  label="Description"
                  placeholder="Describe the project, your role, and key achievements..."
                  error={errors.description?.message}
                  helperText="Provide a compelling overview of the project. Use formatting to make it engaging."
                  minHeight="250px"
                />
              )}
            />
            
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <TagInput
                  label="Services Provided"
                  value={field.value || []}
                  onChange={field.onChange}
                  availableTags={availableServices}
                  onCreateTag={handleCreateService}
                  placeholder="Select or create services..."
                  helperText="Select multiple services (e.g., Development, Design, Marketing)"
                />
              )}
            />
            
            <div className="grid md:grid-cols-3 gap-4">
              <Controller
                name="startYear"
                control={control}
                rules={{ required: 'Start year is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    label="Start Year"
                    placeholder="2024"
                    min="2000"
                    max="2100"
                    error={errors.startYear?.message}
                    helperText="Year project started"
                  />
                )}
              />
              
              <Controller
                name="endYear"
                control={control}
                rules={{ required: 'End year is required' }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Year
                    </label>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Present">Present</option>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select 'Present' if ongoing</p>
                  </div>
                )}
              />
              
              <Controller
                name="featuredOnHome"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                      />
                      <span className="text-sm font-medium text-gray-700">Feature on Home Page</span>
                    </label>
                  </div>
                )}
              />
            </div>
          </FormSection>

          {/* Media Section */}
          <FormSection 
            title="Project Media"
            description="Upload images and visual assets"
          >
            <Controller
              name="image"
              control={control}
              rules={{ required: !project.image ? 'Project image is required' : false }}
              render={({ field }) => {
                console.log('🎛️ Controller render - field.value:', field.value)
                return (
                  <FileInput
                    label="Featured Image"
                    accept="image/*"
                    onUpload={handleImageUpload}
                    value={field.value}
                    onChange={(url) => {
                      console.log('🔄 Controller onChange called with:', url)
                      field.onChange(url)
                    }}
                    error={errors.image?.message}
                    helperText="Recommended: 1200x800px, JPG or PNG"
                  />
                )
              }}
            />
          </FormSection>

          {/* SEO & Metadata Section (Collapsible) */}
          <FormSection 
            title="SEO & Metadata"
            description="Optimize for search engines and social sharing"
            collapsible
            defaultOpen={false}
          >
            <Controller
              name="metaTitle"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Meta Title"
                  placeholder="Project title for search engines"
                  maxLength={60}
                  helperText="50-60 characters recommended. Appears in search results and browser tabs."
                />
              )}
            />
            
            <Controller
              name="metaDescription"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Meta Description"
                  rows={2}
                  placeholder="Brief description for search results"
                  maxLength={160}
                  showCount
                  helperText="150-160 characters recommended. Appears below the title in search results."
                />
              )}
            />
            
            <Controller
              name="metaKeywords"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Keywords"
                  placeholder="web design, branding, shopify"
                  helperText="Comma-separated keywords relevant to this project"
                />
              )}
            />
            
            <Controller
              name="ogImage"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Social Share Image (OG Image)"
                  placeholder="Leave blank to use project image"
                  helperText="1200x630px recommended. Used when sharing on social media."
                />
              )}
            />
          </FormSection>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-lg">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
          >
            {project?.id ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ProjectForm

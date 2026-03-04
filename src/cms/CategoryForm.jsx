import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Card from '../components/ui/Card'
import FormSection from '../components/ui/FormSection'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import SortableList from '../components/ui/SortableList'
import AlertDialog from '../components/ui/AlertDialog'

const CategoryForm = ({ onFormChange, onSaveSuccess, onCancelRef }) => {
  const [categories, setCategories] = useState([])
  const [initialCategories, setInitialCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, category: null })

  const categoriesChanged = JSON.stringify(categories) !== JSON.stringify(initialCategories)

  useEffect(() => {
    if (onCancelRef) {
      onCancelRef.current = () => {
        loadCategories()
      }
    }
  }, [onCancelRef])

  useEffect(() => {
    if (isInitialized && categoriesChanged && onFormChange) {
      onFormChange()
    }
  }, [categoriesChanged, onFormChange, isInitialized])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsInitialized(false)
    try {
      const response = await fetch(`${API_URL}/api/settings`)
      const data = await response.json()
      setCategories(data.categories || [])
      setInitialCategories(data.categories || [])
      setIsInitialized(true)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/settings`)
      const currentSettings = await response.json()

      const updatedSettings = {
        ...currentSettings,
        categories: categories
      }

      const saveResponse = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      })

      if (saveResponse.ok) {
        setInitialCategories(categories)
        if (onSaveSuccess) {
          onSaveSuccess()
        }
        alert('Categories saved successfully!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving categories:', error)
      alert('Error saving categories: ' + error.message)
    }
  }

  const addCategory = () => {
    setCategories([...categories, {
      id: `category-${Date.now()}`,
      name: '',
      link: '',
      usageCount: 0
    }])
  }

  const updateCategory = (id, field, value) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  const removeCategory = async (id) => {
    const category = categories.find(c => c.id === id)
    
    if (!category) return
    
    if (category.usageCount > 0) {
      setDeleteConfirm({ show: true, category })
      return
    }
    
    await performDelete(category)
  }

  const performDelete = async (category) => {
    if (category.usageCount > 0) {
      try {
        const projectsResponse = await fetch(`${API_URL}/api/projects`)
        const projects = await projectsResponse.json()
        
        const updatePromises = projects
          .filter(project => project.category === category.name)
          .map(async project => {
            const updatedProject = {
              ...project,
              category: ''
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
        alert('Error removing category from projects: ' + error.message)
        return
      }
    }
    
    const updatedCategories = categories.filter(c => c.id !== category.id)
    setCategories(updatedCategories)
    await saveUpdatedCategories(updatedCategories)
  }

  const saveUpdatedCategories = async (categoriesToSave) => {
    try {
      const response = await fetch(`${API_URL}/api/settings`)
      const currentSettings = await response.json()

      const updatedSettings = {
        ...currentSettings,
        categories: categoriesToSave
      }

      const saveResponse = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      })
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save categories')
      }
      
      setInitialCategories(categoriesToSave)
    } catch (error) {
      console.error('Error auto-saving categories:', error)
      alert('Error saving categories: ' + error.message)
      throw error
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-6">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-6">Project Categories</h3>
      <div className="space-y-6">
        <Card>
          <FormSection title="Categories">
            <p className="text-sm text-gray-600 mb-4">
              Manage project categories. Each project can have one category (e.g., Skincare, Fashion, SaaS).
            </p>
            
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-sm">All Categories</h4>
              <Button
                type="button"
                onClick={addCategory}
                variant="secondary"
                size="sm"
              >
                + Add Category
              </Button>
            </div>

            <SortableList
              items={categories}
              onReorder={setCategories}
              emptyMessage="No categories yet. Click 'Add Category' to create one."
              defaultOpen={false}
              getTitleFromItem={(category) => category.name || 'Untitled Category'}
              getHeaderActions={(category) => (
                <div
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeCategory(category.id)
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className="text-red-600 hover:text-red-800 text-xl leading-none px-2 py-1 cursor-pointer select-none"
                  title="Remove category"
                  role="button"
                  tabIndex={0}
                >
                  ×
                </div>
              )}
              renderItem={(category) => (
                <div className="space-y-3">
                  <Input
                    label="Category Name"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                    placeholder="e.g., Skincare, Fashion, SaaS"
                  />
                  <Input
                    label="Link (optional)"
                    value={category.link || ''}
                    onChange={(e) => updateCategory(category.id, 'link', e.target.value)}
                    placeholder="e.g., /work/skincare"
                    helperText="Optional link to a page about this category"
                  />
                </div>
              )}
            />
          </FormSection>
        </Card>

        <Button onClick={saveCategories} className="w-full">
          Save Categories
        </Button>
      </div>

      <AlertDialog
        open={deleteConfirm.show}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteConfirm({ show: false, category: null })
          }
        }}
        title="Delete Category"
        description={
          deleteConfirm.category
            ? `"${deleteConfirm.category.name}" is used in ${deleteConfirm.category.usageCount} project(s). Deleting this category will remove it from all projects. This action cannot be undone.`
            : ''
        }
        confirmText="Delete Category"
        cancelText="Cancel"
        onConfirm={async () => {
          if (deleteConfirm.category) {
            await performDelete(deleteConfirm.category)
          }
        }}
        variant="danger"
      />
    </div>
  )
}

export default CategoryForm

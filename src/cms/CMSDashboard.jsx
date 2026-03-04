import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SettingsForm from './SettingsForm'
import HomePageForm from './HomePageForm'
import ServicePageForm from './ServicePageForm'
import CategoryForm from './CategoryForm'
import ServiceForm from './ServiceForm'
import TeamDashboard from './TeamDashboard'
import UserDashboard from './UserDashboard'
import TaskDashboard from './TaskDashboard'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import DropdownMenu from '../components/ui/DropdownMenu'
import AlertDialog from '../components/ui/AlertDialog'
import EmptyState from '../components/ui/EmptyState'
import { API_URL } from '../config'
import { getImageUrl } from '../utils/imageUrl'
import buildInfo from '../buildInfo.json'

const CMSDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const section = searchParams.get('section') || 'projects'
  const [activeSection, setActiveSection] = useState(section)
  const [projects, setProjects] = useState([])
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, type: null })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const formCancelRef = useRef(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Update URL when section changes
  const handleSectionChange = (sectionId) => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return
      }
    }
    setHasUnsavedChanges(false)
    setActiveSection(sectionId)
    setSearchParams({ section: sectionId })
  }

  // Sync activeSection with URL on mount and URL changes
  useEffect(() => {
    const urlSection = searchParams.get('section') || 'projects'
    setActiveSection(urlSection)
  }, [searchParams])

  const navigationGroups = [
    {
      label: 'Content',
      items: [
        { id: 'projects', label: 'Projects', icon: '📁' },
        { id: 'team', label: 'Team', icon: '👥' },
        { id: 'tasks', label: 'Tasks', icon: '✓' }
      ]
    },
    {
      label: 'Pages',
      items: [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'servicesPage', label: 'Services', icon: '💼' },
        { id: 'pages', label: 'Other Pages', icon: '📄' }
      ]
    },
    {
      label: 'Configuration',
      items: [
        { id: 'categories', label: 'Categories', icon: '🏷️' },
        { id: 'services', label: 'Service Tags', icon: '⚡' },
        { id: 'users', label: 'Users', icon: '👤' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ]
    }
  ]

  const loadProjects = () => {
    fetch(`${API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setProjects([]))
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return
      }
    }
    logout()
    // Use replace to prevent going back to CMS after logout
    navigate('/cms/login', { replace: true })
  }

  const handleSaveChanges = () => {
    const form = document.querySelector('form')
    if (form) {
      form.requestSubmit()
    }
  }

  const handleCancelChanges = () => {
    console.log('handleCancelChanges called!')
    // Immediately cancel without confirmation
    setHasUnsavedChanges(false)
    if (formCancelRef.current) {
      console.log('Calling formCancelRef.current()')
      formCancelRef.current()
    } else {
      console.log('formCancelRef.current is null!')
    }
  }

  const confirmDelete = async () => {
    try {
      if (deleteDialog.type === 'project') {
        const response = await fetch(`${API_URL}/api/projects/${deleteDialog.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadProjects()
        }
      }
    } catch (error) {
      alert('Error deleting item: ' + error.message)
    }
    setDeleteDialog({ open: false, id: null, type: null })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen overflow-y-auto hidden lg:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Pencilz CMS</h1>
        </div>
        
        <nav className="px-3 pb-6">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-6">
              <div className="px-3 mb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.label}
                </h2>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${activeSection === item.id 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 w-full">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-900 lg:hidden">Pencilz CMS</h1>
              {hasUnsavedChanges && (
                <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {hasUnsavedChanges && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancelChanges}
                  >
                    <span className="hidden sm:inline">Cancel</span>
                    <span className="sm:hidden">✕</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveChanges}
                  >
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <select 
            value={activeSection}
            onChange={(e) => handleSectionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {navigationGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.icon} {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <main className="p-4 sm:p-6 max-w-full overflow-x-auto">
        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your portfolio projects</p>
              </div>
              <Button onClick={() => navigate('/cms/projects/new')}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="ml-2">New Project</span>
              </Button>
            </div>

            {projects.length === 0 ? (
              <EmptyState
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                title="No projects yet"
                description="Get started by creating your first project"
                action={() => navigate('/cms/projects/new')}
                actionLabel="Create Project"
              />
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head className="hidden sm:table-cell">Image</Table.Head>
                        <Table.Head>Title</Table.Head>
                        <Table.Head className="hidden md:table-cell">Category</Table.Head>
                        <Table.Head className="hidden lg:table-cell">Services</Table.Head>
                        <Table.Head className="hidden xl:table-cell">Start Date</Table.Head>
                        <Table.Head className="hidden xl:table-cell">End Date</Table.Head>
                        <Table.Head className="w-20"></Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {projects.map(project => (
                        <Table.Row 
                          key={project.id}
                          onClick={() => navigate(`/cms/projects/${project.id}`)}
                        >
                          <Table.Cell className="hidden sm:table-cell">
                            {project.image ? (
                              <img 
                                src={getImageUrl(project.image)}
                                alt={project.title}
                                className="w-16 h-16 rounded object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <div className="font-medium text-gray-900">{project.title}</div>
                            <div className="text-xs text-gray-500 mt-1 md:hidden">
                              {project.category || 'Uncategorized'}
                            </div>
                          </Table.Cell>
                          <Table.Cell className="hidden md:table-cell">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {project.category || 'Uncategorized'}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(project.services) && project.services.length > 0 ? (
                                project.services.slice(0, 3).map((service, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {service}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">None</span>
                              )}
                              {Array.isArray(project.services) && project.services.length > 3 && (
                                <span className="text-xs text-gray-500">+{project.services.length - 3}</span>
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell className="hidden xl:table-cell text-gray-600">
                            {project.startYear || '—'}
                          </Table.Cell>
                          <Table.Cell className="hidden xl:table-cell text-gray-600">
                            {project.endYear === 'Present' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Present
                              </span>
                            ) : (
                              project.endYear || '—'
                            )}
                          </Table.Cell>
                      <Table.Cell>
                        <DropdownMenu
                          trigger={
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          }
                        >
                          <DropdownMenu.Item onClick={() => navigate(`/cms/projects/${project.id}`)}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item 
                            variant="danger"
                            onClick={() => setDeleteDialog({ open: true, id: project.id, type: 'project' })}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pages Section */}
        {activeSection === 'pages' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Other Pages</h2>
              <p className="text-sm text-gray-600 mt-1">Edit content for About, FAQ, Terms, and Privacy pages</p>
            </div>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Page Name</Table.Head>
                  <Table.Head>Description</Table.Head>
                  <Table.Head className="w-32"></Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {[
                  { id: 'about', name: 'About', description: 'Company information and story' },
                  { id: 'faq', name: 'FAQ', description: 'Frequently asked questions' },
                  { id: 'terms', name: 'Terms', description: 'Terms of service' },
                  { id: 'privacy', name: 'Privacy', description: 'Privacy policy' }
                ].map(page => (
                  <Table.Row 
                    key={page.id}
                    onClick={() => navigate(`/cms/pages/${page.id}`)}
                  >
                    <Table.Cell>
                      <div className="font-medium text-gray-900">{page.name}</div>
                    </Table.Cell>
                    <Table.Cell className="text-gray-600">
                      {page.description}
                    </Table.Cell>
                    <Table.Cell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/cms/pages/${page.id}`)
                        }}
                      >
                        Edit Content
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}

        {/* Home Page Section */}
        {activeSection === 'home' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Home Page</h2>
              <p className="text-sm text-gray-600 mt-1">Customize your homepage hero and CTA buttons</p>
            </div>
            <HomePageForm 
              key={`home-form-${formKey}`}
              onFormChange={() => setHasUnsavedChanges(true)}
              onSaveSuccess={() => setHasUnsavedChanges(false)}
              onCancelRef={formCancelRef}
            />
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="text-sm text-gray-600 mt-1">Configure global site settings</p>
            </div>
            <SettingsForm 
              key={`settings-form-${formKey}`}
              onFormChange={() => setHasUnsavedChanges(true)}
              onSaveSuccess={() => setHasUnsavedChanges(false)}
              onCancelRef={formCancelRef}
            />
          </div>
        )}

        {/* Categories Section */}
        {activeSection === 'categories' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Project Categories</h2>
              <p className="text-sm text-gray-600 mt-1">Manage project categories (each project has one category)</p>
            </div>
            <CategoryForm 
              key={`category-form-${formKey}`}
              onFormChange={() => setHasUnsavedChanges(true)}
              onSaveSuccess={() => setHasUnsavedChanges(false)}
              onCancelRef={formCancelRef}
            />
          </div>
        )}

        {/* Services Page Section */}
        {activeSection === 'servicesPage' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Services Page</h2>
              <p className="text-sm text-gray-600 mt-1">Manage service cards with descriptions, images, and sub-services</p>
            </div>
            <ServicePageForm 
              key={`servicepage-form-${formKey}`}
              onFormChange={() => setHasUnsavedChanges(true)}
              onSaveSuccess={() => setHasUnsavedChanges(false)}
              onCancelRef={formCancelRef}
            />
          </div>
        )}

        {/* Services Section */}
        {activeSection === 'services' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Service Tags</h2>
              <p className="text-sm text-gray-600 mt-1">Manage service tags used in project filtering (e.g., Development, Design, Marketing)</p>
            </div>
            <ServiceForm 
              key={`service-form-${formKey}`}
              onFormChange={() => setHasUnsavedChanges(true)}
              onSaveSuccess={() => setHasUnsavedChanges(false)}
              onCancelRef={formCancelRef}
            />
          </div>
        )}

        {/* Team Section */}
        {activeSection === 'team' && <TeamDashboard />}

        {/* Users Section */}
        {activeSection === 'users' && <UserDashboard />}

        {/* Tasks Section */}
        {activeSection === 'tasks' && <TaskDashboard />}
        </main>

        {/* Build Info */}
        <div className="fixed bottom-2 left-2 text-[10px] text-gray-400 font-mono select-none pointer-events-none">
          {buildInfo.version} • {new Date(buildInfo.timestamp).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null, type: null })}
        variant="danger"
      />
    </div>
  )
}

export default CMSDashboard

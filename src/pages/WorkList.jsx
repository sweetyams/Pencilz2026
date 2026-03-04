import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const WorkList = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ key: 'startYear', direction: 'desc' })

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading projects:', err)
        setLoading(false)
      })
  }, [])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedProjects = [...projects].sort((a, b) => {
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]
    
    // Handle "Present" as a special case
    if (sortConfig.key === 'endYear') {
      const aYear = aVal === 'Present' ? 9999 : aVal
      const bYear = bVal === 'Present' ? 9999 : bVal
      return sortConfig.direction === 'asc' ? aYear - bYear : bYear - aYear
    }
    
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Work List</h1>
          <p className="text-gray-600">Complete project portfolio with details</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('title')}
                  >
                    Client {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Services
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('category')}
                  >
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Swatch
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('startYear')}
                  >
                    Start {sortConfig.key === 'startYear' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('endYear')}
                  >
                    End {sortConfig.key === 'endYear' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Featured
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {project.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(project.services) && project.services.length > 0 ? (
                          project.services.map((service, idx) => (
                            <span 
                              key={idx}
                              className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">No services</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {project.category || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: project.swatchColor || '#000000' }}
                          title={project.swatchColor}
                        />
                        <span className="text-xs text-gray-500 font-mono">
                          {project.swatchColor || '#000000'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {project.startYear || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {project.endYear === 'Present' ? (
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                          Present
                        </span>
                      ) : (
                        project.endYear || '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {project.featuredOnHome ? (
                        <span className="inline-block w-5 h-5 bg-yellow-400 rounded-full" title="Featured on home page">
                          ⭐
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Total projects: {projects.length}
        </div>
      </div>
    </div>
  )
}

export default WorkList

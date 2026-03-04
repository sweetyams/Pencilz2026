import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const Team = () => {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/team`)
      .then(res => res.json())
      .then(data => {
        setTeam(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading team:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading team...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-lg text-gray-600">Meet the people behind Pencilz</p>
        </div>

        {team.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No team members yet. Add them in the CMS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((member) => (
              <div 
                key={member.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {member.image && (
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 mt-3 inline-block"
                    >
                      Contact
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Team

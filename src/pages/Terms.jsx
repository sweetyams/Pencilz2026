import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const Terms = () => {
  const [settings, setSettings] = useState({
    companyName: 'Pencilz + Friends',
    email: 'hello@pencilz.works',
    location: 'Montreal'
  })
  const [pageData, setPageData] = useState({
    title: 'Terms & Conditions',
    lastUpdated: '',
    content: ''
  })

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
    
    fetch(`${API_URL}/api/pages/terms`)
      .then(res => res.json())
      .then(data => setPageData(data))
      .catch(() => {})
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'Not yet updated'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="px-5 md:px-[20px] py-14" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 className="text-[32px] text-[#191919] mb-16">{pageData.title}</h1>
        
        <p className="text-[20px] text-[#191919] mb-20">
          <span className="font-medium">Last Updated: </span>
          <span>{formatDate(pageData.lastUpdated)}</span>
        </p>

        <div 
          className="text-[32px] text-[#191919] space-y-0"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </div>
    </div>
  )
}

export default Terms

import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const FAQ = () => {
  const [pageData, setPageData] = useState({
    title: 'FAQ',
    content: ''
  })

  useEffect(() => {
    fetch(`${API_URL}/api/pages/faq`)
      .then(res => res.json())
      .then(data => setPageData(data))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="px-5 md:px-[20px] py-14" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 className="text-[32px] text-[#191919] mb-16">{pageData.title}</h1>

        <div 
          className="text-[32px] text-[#191919] space-y-0"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </div>
    </div>
  )
}

export default FAQ

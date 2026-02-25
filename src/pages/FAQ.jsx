import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const FAQ = () => {
  const [page, setPage] = useState({ title: 'FAQ', content: '' })

  useEffect(() => {
    fetch(`${API_URL}/api/pages`)
      .then(res => res.json())
      .then(data => setPage(data.faq || page))
      .catch(() => {})
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{page.content}</p>
      </div>
    </div>
  )
}

export default FAQ

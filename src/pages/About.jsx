import { useState, useEffect } from 'react'

const About = () => {
  const [page, setPage] = useState({ title: 'About', content: '' })

  useEffect(() => {
    fetch('http://localhost:3001/api/pages')
      .then(res => res.json())
      .then(data => setPage(data.about || page))
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

export default About

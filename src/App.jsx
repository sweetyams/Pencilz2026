import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import News from './pages/News'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import FAQ from './pages/FAQ'
import TestStack from './pages/TestStack'
import CMSLogin from './cms/CMSLogin'
import CMSDashboard from './cms/CMSDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/test-stack" element={<TestStack />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="news" element={<News />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="faq" element={<FAQ />} />
          </Route>
          <Route path="/cms/login" element={<CMSLogin />} />
          <Route path="/cms" element={<ProtectedRoute><CMSDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

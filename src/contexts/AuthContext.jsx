import { createContext, useContext, useState, useEffect } from 'react'
import { API_URL } from '../config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage immediately
    const storedUser = localStorage.getItem('cms_user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [isLoading, setIsLoading] = useState(false)

  const login = async (username, password) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
        localStorage.setItem('cms_user', JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cms_user')
  }

  // Maintain backward compatibility with isAuthenticated
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

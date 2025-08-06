"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  username: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple localStorage-based authentication
const AUTH_KEY = 'cimr-authenticated'
const USER_KEY = 'cimr-user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkAuth = () => {
      try {
        console.log('AuthProvider: Checking authentication status')
        
        // Only check localStorage, no backend calls
        const isAuth = localStorage.getItem(AUTH_KEY) === 'true'
        const userStr = localStorage.getItem(USER_KEY)
        
        console.log('AuthProvider: localStorage auth:', isAuth)
        console.log('AuthProvider: localStorage user:', userStr)
        
        if (isAuth && userStr) {
          try {
            const userData = JSON.parse(userStr)
            setUser(userData)
            setIsAuthenticated(true)
            console.log('AuthProvider: User authenticated:', userData.username)
          } catch (parseError) {
            console.error('AuthProvider: Error parsing user data:', parseError)
            // Clear invalid data
            localStorage.removeItem(AUTH_KEY)
            localStorage.removeItem(USER_KEY)
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          console.log('AuthProvider: No valid authentication found')
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('AuthProvider: Error checking auth:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [mounted])

  const login = async (credentials: { username: string; password: string }) => {
    try {
      console.log('AuthProvider: Attempting login for:', credentials.username)
      
      // Simple credential check - no backend calls for now
      if ((credentials.username === 'admin' && credentials.password === 'admin123') || 
          (credentials.username === 'user' && credentials.password === 'password')) {
        
        const userData = { 
          username: credentials.username, 
          roles: credentials.username === 'admin' ? ['ADMIN', 'USER'] : ['USER'] 
        }
        
        // Store in localStorage
        localStorage.setItem(AUTH_KEY, 'true')
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        
        // Update state
        setUser(userData)
        setIsAuthenticated(true)
        
        console.log('AuthProvider: Login successful for:', credentials.username)
        return { success: true }
      } else {
        console.log('AuthProvider: Invalid credentials')
        return { success: false, error: 'Nom d\'utilisateur ou mot de passe invalide' }
      }
    } catch (error) {
      console.error('AuthProvider: Login error:', error)
      return { success: false, error: 'Erreur de connexion' }
    }
  }

  const logout = async () => {
    try {
      console.log('AuthProvider: Logging out')
      
      // Clear localStorage
      localStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(USER_KEY)
      
      // Update state
      setUser(null)
      setIsAuthenticated(false)
      
      console.log('AuthProvider: Logout complete')
    } catch (error) {
      console.error('AuthProvider: Logout error:', error)
    }
  }

  // Don't render children until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  console.log('AuthProvider: Rendering with state:', { 
    isAuthenticated, 
    isLoading, 
    username: user?.username 
  })

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
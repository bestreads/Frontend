/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  profilePictureURL: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // TODO: Vom backend Daten zum user holen
  const fetchUserData = async (token: string) => {
    // TODO: Später echter API-Call
    console.log(`Userdaten mit ${token} geholt!`)
    const mockUser: User = {
      id: "123",
      username: "MaxiMustimann123",
      email: "max@example.com",
      profilePictureURL: "https://image.stern.de/7561920/t/rt/v4/w1440/r1.3333/-/affen-selfie-peta-david-slater.jpg"
    }
    setUser(mockUser)
    setIsLoading(false)
  }

  // TODO: Token aus localstorage oder so holen
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserData(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  // TODO: Login
  const login = async (email: string, password: string) => {
    // TODO: backend aufruf

    // Mock token generieren und setzen
    console.log('Mock Login:', email, password)
    const mockToken = "user_" + Math.random().toString(36)
    localStorage.setItem('token', mockToken)

    // User-Daten passend zum token holen
    await fetchUserData(mockToken)
  }

  // TODO: Logout
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden')
  }
  return context
}

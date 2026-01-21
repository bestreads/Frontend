import * as authService from "@/api/authService"
import { getCurrentUser } from "@/api/userService"
import { type User } from '@/api/userService'
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from "react"


interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  handleUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function handleUserData() {
    try {
      const user = await getCurrentUser()
      setUser(user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // check user & cookie at start
  useEffect(() => {
    handleUserData()
  }, [])

  // check session each 3 min
  useEffect(() => {
    if (!user) return

    const timer = setInterval(() => {
      handleUserData()
      console.log("check session...")
    }, 1000 * 10 * 1) // 3 min

    return () => clearInterval(timer)
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password })
      await handleUserData()
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      handleUserData
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

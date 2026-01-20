/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from "react"
import { getUser, type OwnUserProfile } from "@/api/userService"
import { login as apiLogin, logout as apiLogout } from "@/api/authService"

interface User {
  userId: number
  username: string
  email: string
  profilePictureURL: string
  accountCreatedAtYear: number
  booksInLibrary: number
  posts: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Transformiert OwnUserProfile zu User
const mapUserProfile = (profile: OwnUserProfile): User => ({
  userId: profile.userId,
  username: profile.username,
  email: profile.email,
  profilePictureURL: profile.profilePicture,
  accountCreatedAtYear: profile.accountCreatedAtYear,
  booksInLibrary: profile.booksInLibrary,
  posts: profile.posts,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Benutzerdaten vom Backend holen
  const fetchUserData = useCallback(async () => {
    try {
      const userData = await getUser()
      setUser(mapUserProfile(userData))
    } catch (error) {
      console.error("Fehler beim Laden der Benutzerdaten:", error)
      setUser(null)
    }
  }, [])

  // Beim Start prüfen ob User eingeloggt ist
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUser()
        setUser(mapUserProfile(userData))
      } catch {
        // Nicht eingeloggt oder Token ungültig
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Login
  const login = async (email: string, password: string) => {
    await apiLogin({ email, password })
    await fetchUserData()
  }

  // Logout
  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error("Fehler beim Logout:", error)
    } finally {
      setUser(null)
    }
  }

  // User-Daten neu laden (z.B. nach Profil-Update)
  const refreshUser = async () => {
    await fetchUserData()
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser
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

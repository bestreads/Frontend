import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light" || stored === "system") {
      return stored;
    }
    return defaultTheme;
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    const appliedTheme = theme === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme

    root.classList.add(appliedTheme)

    // Announce to screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = `Theme changed to ${appliedTheme} mode`
    document.body.appendChild(announcement)
    
    const timeoutId = setTimeout(() => announcement.remove(), 1000)

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      
      const handler = (e: MediaQueryListEvent) => {
        root.classList.remove("light", "dark")
        const newTheme = e.matches ? "dark" : "light"
        root.classList.add(newTheme)
        
        // Announce system theme change
        const systemAnnouncement = document.createElement('div')
        systemAnnouncement.setAttribute('role', 'status')
        systemAnnouncement.setAttribute('aria-live', 'polite')
        systemAnnouncement.className = 'sr-only'
        systemAnnouncement.textContent = `Theme changed to ${newTheme} mode`
        document.body.appendChild(systemAnnouncement)
        setTimeout(() => systemAnnouncement.remove(), 1000)
      }
      
      mediaQuery.addEventListener("change", handler)
      return () => {
        mediaQuery.removeEventListener("change", handler)
        clearTimeout(timeoutId)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { ReactNode } from "react"
import { useAuth } from "@/contexts/Authcontext"
import { getFollowing, getFollowers, type FollowUser } from "@/api/userService"
import { followUser, unfollowUser } from "@/api/followService"

interface FollowContextType {
  myFollowingList: FollowUser[] // Wem ICH folge (eingeloggter User)
  isFollowLoading: boolean
  isFollowing: (userId: number) => boolean
  toggle: (userId: number) => Promise<void>
  refresh: () => Promise<void>
  // Funktionen zum Laden von Listen für andere User
  loadFollowersFor: (userId: number) => Promise<FollowUser[]>
  loadFollowingFor: (userId: number) => Promise<FollowUser[]>
}

const FollowContext = createContext<FollowContextType | undefined>(undefined)

export function FollowProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [myFollowingList, setMyFollowingList] = useState<FollowUser[]>([])
  const [isFollowLoading, setisFollowLoading] = useState(true)

  const loadFollowing = useCallback(async () => {
    console.log("[FollowContext] loadFollowing gestartet, user:", user)
    if (!user) {
      console.log("[FollowContext] Kein User, setze Listen auf leer")
      setMyFollowingList([])
      setisFollowLoading(false)
      return
    }
    setisFollowLoading(true)
    try {
      console.log("[FollowContext] Lade Following für eingeloggten User:", user.userId)
      const followingData = await getFollowing(user.userId)
      console.log("[FollowContext] Following-Liste erhalten:", followingData)
      setMyFollowingList(followingData)
      console.log("[FollowContext] myFollowingList aktualisiert:", followingData)
    } catch (err) {
      console.error("[FollowContext] Fehler beim Laden der Follow-Listen:", err)
    } finally {
      setisFollowLoading(false)
      console.log("[FollowContext] loadFollowing abgeschlossen")
    }
  }, [user])

  useEffect(() => {
    loadFollowing()
  }, [loadFollowing])

  // Lädt Follower für einen spezifischen User
  const loadFollowersFor = useCallback(async (userId: number): Promise<FollowUser[]> => {
    console.log("[FollowContext] loadFollowersFor userId:", userId)
    const data = await getFollowers(userId)
    console.log("[FollowContext] Follower erhalten für userId", userId, ":", data)
    return data
  }, [])

  // Lädt Following für einen spezifischen User
  const loadFollowingFor = useCallback(async (userId: number): Promise<FollowUser[]> => {
    console.log("[FollowContext] loadFollowingFor userId:", userId)
    const data = await getFollowing(userId)
    console.log("[FollowContext] Following erhalten für userId", userId, ":", data)
    return data
  }, [])

  const isFollowing = useCallback((userId: number) => {
    const result = myFollowingList.some((u) => u.userId === userId)
    console.log("[FollowContext] isFollowing check für userId:", userId, "Result:", result)
    return result
  }, [myFollowingList])

  const toggle = useCallback(
    async (userId: number) => {
      console.log("[FollowContext] toggle gestartet für userId:", userId)
      const currently = myFollowingList.some((u) => u.userId === userId)
      console.log("[FollowContext] Aktueller Status - folge ich diesem User?", currently)

      // Optimistisches Update – sofort im Cache aktualisieren
      setMyFollowingList((prev) => {
        if (currently) {
          console.log("[FollowContext] Optimistisch: entferne userId", userId)
          return prev.filter((u) => u.userId !== userId)
        } else {
          console.log("[FollowContext] Optimistisch: füge userId hinzu", userId)
          // Temporäres User-Objekt, wird durch refresh ersetzt
          return [...prev, { userId, username: "...", profilePicture: "" }]
        }
      })

      try {
        if (currently) {
          console.log("[FollowContext] API-Call: unfollowUser(", userId, ")")
          await unfollowUser(userId)
          console.log("[FollowContext] unfollowUser erfolgreich")
        } else {
          console.log("[FollowContext] API-Call: followUser(", userId, ")")
          await followUser(userId)
          console.log("[FollowContext] followUser erfolgreich")
        }
        // Nach erfolgreicher Operation Listen neu laden
        console.log("[FollowContext] Lade Listen nach toggle neu")
        await loadFollowing()
      } catch (err) {
        // Rollback bei Fehler
        console.error("[FollowContext] Fehler beim Folgen/Entfolgen:", err)
        console.log("[FollowContext] Rollback: setze Status zurück")
        setMyFollowingList((prev) => {
          if (currently) {
            console.log("[FollowContext] Rollback: füge User wieder hinzu")
            // User sollte noch in der ursprünglichen Liste sein
            return [...prev.filter((u) => u.userId !== userId)]
          } else {
            console.log("[FollowContext] Rollback: entferne userId wieder")
            return prev.filter((u) => u.userId !== userId)
          }
        })
        // Bei Fehler ebenfalls neu laden um konsistenten Status zu haben
        await loadFollowing()
      }
    },
    [myFollowingList, loadFollowing]
  )

  return (
    <FollowContext.Provider value={{ myFollowingList, isFollowLoading, isFollowing, toggle, refresh: loadFollowing, loadFollowersFor, loadFollowingFor }}>
      {children}
    </FollowContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFollowContext() {
  const ctx = useContext(FollowContext)
  if (!ctx) throw new Error("useFollowContext must be used within a FollowProvider")
  return ctx
}

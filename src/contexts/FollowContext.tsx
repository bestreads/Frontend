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
    if (!user) {
      setMyFollowingList([])
      setisFollowLoading(false)
      return
    }
    setisFollowLoading(true)
    try {
      const followingData = await getFollowing(user.userId)
      setMyFollowingList(followingData)
    } catch (err) {
      console.error("[FollowContext] Fehler beim Laden der Follow-Listen:", err)
    } finally {
      setisFollowLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadFollowing()
  }, [loadFollowing])

  // Lädt Follower für einen spezifischen User
  const loadFollowersFor = useCallback(async (userId: number): Promise<FollowUser[]> => {
    const data = await getFollowers(userId)
    return data
  }, [])

  // Lädt Following für einen spezifischen User
  const loadFollowingFor = useCallback(async (userId: number): Promise<FollowUser[]> => {
    const data = await getFollowing(userId)
    return data
  }, [])

  const isFollowing = useCallback((userId: number) => {
    const result = myFollowingList.some((u) => u.userId === userId)
    return result
  }, [myFollowingList])

  const toggle = useCallback(
    async (userId: number) => {
      const currently = myFollowingList.some((u) => u.userId === userId)

      // Optimistisches Update – sofort im Cache aktualisieren
      setMyFollowingList((prev) => {
        if (currently) {
          return prev.filter((u) => u.userId !== userId)
        } else {
          // Temporäres User-Objekt, wird durch refresh ersetzt
          return [...prev, { userId, username: "...", profilePicture: "" }]
        }
      })

      try {
        if (currently) {
          await unfollowUser(userId)
        } else {
          await followUser(userId)
        }
        await loadFollowing()
      } catch (err) {
        console.error("[FollowContext] Fehler beim Folgen/Entfolgen:", err)
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

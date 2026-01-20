import { useState, useEffect } from "react"
import { User, BookOpen, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { getUserProfile, type UserProfile } from "@/api/userService"


function ProfileHeader({ userId }: { userId: string }) {
  const [userStats, setUserStats] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getUserProfile(Number(userId))
        setUserStats(data)
      } catch (err) {
        console.error("Fehler beim Laden des Profils:", err)
        setError("Profil konnte nicht geladen werden")
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserProfile()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    )
  }

  if (error || !userStats) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-red-500">{error || "Profil nicht gefunden"}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-6 lg:flex-row">
      <div className="flex-1 flex gap-6 items-center">
        {/* Avatar */}
        <Avatar className="w-24 h-24 rounded-full border-2">
          <AvatarImage src={userStats.profilePicture} />
          <AvatarFallback>
            <User className="w-12 h-12 text-primary" />
          </AvatarFallback>
        </Avatar>
        {/* Name */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold flex flex-col lg:flex-row lg:items-baseline gap-1">
            <span className="truncate max-w-full">{userStats.username}</span>
            <span className="italic text-muted-foreground truncate text-sm md:text-xl"> #{userStats.userId}</span>
          </h2>
          <p className="text-sm text-muted-foreground">Mitglied seit {userStats.accountCreatedAtYear}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-1 flex gap-6 justify-evenly items-center flex-nowrap">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{userStats.booksInLibrary}</span>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground hidden sm:flex" />
            <span className="text-sm text-muted-foreground">Bücher</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{userStats.posts}</span>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground hidden sm:flex" />
            <span className="text-sm text-muted-foreground">Beiträge</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProfileHeader
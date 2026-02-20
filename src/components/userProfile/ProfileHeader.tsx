import { useState, useEffect } from "react"
import { User, BookOpen, MessageSquare, UserX, UserPlus, UserCheck, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { getUserProfile, type UserProfile } from "@/api/userService"
import { Button } from "../ui/button"
import { useAuth } from "@/contexts/Authcontext"
import { useFollowContext } from "@/contexts/FollowContext"
import { FollowListDialog } from "../FollowListDialog"
import { Spinner } from "../ui/spinner"

function ProfileHeader({ userId }: { userId: string }) {
  const [userStats, setUserStats] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [followDialogOpen, setFollowDialogOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<"followers" | "following">("followers")
  const { user } = useAuth()
  const isOwnProfile = String(user?.userId) === userId
  const { isFollowing, toggle, isFollowLoading } = useFollowContext()

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

  function handleFollowButtonClick() {
    toggle(Number(userId))
  }

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

        <div className="flex-1 flex flex-col xs:flex-row gap-5 xs:items-center flex-wrap ">
          {/* Name */}
          <div className="flex-1 flex flex-col min-w-0">
            <h2 className="text-2xl font-semibold flex items-center gap-1">
              <span className="truncate max-w-full">{userStats.username}</span>
              <span className="italic text-muted-foreground truncate text-sm md:text-xl"> #{userStats.userId}</span>
            </h2>
            <p className="text-sm text-muted-foreground">Mitglied seit {userStats.accountCreatedAtYear}</p>
          </div>

          {/* Follow/Unfollow Button */}
          {isOwnProfile ?
            null : (
              isFollowLoading ?
                <Spinner /> :
                <Button className="flex-1 max-w-40" onClick={handleFollowButtonClick} disabled={isFollowLoading}>
                  {isFollowing(Number(userId)) ?
                    <div className="flex justify-around items-center gap-3">
                      <UserX className="w-4 h-4 inline" />
                      <span>Entfolgen</span>
                    </div> :
                    <div className="flex justify-around items-center gap-3">
                      <UserPlus className="w-4 h-4 inline" />
                      <span>Folgen</span>
                    </div>}
                </Button>
            )
          }

        </div>

      </div>

      {/* Stats */}
      <div className="flex-1 flex gap-6 justify-evenly items-center flex-nowrap">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{userStats.booksInLibrary}</span>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground hidden sm:flex" />
            <span className="text-sm text-muted-foreground wrap-anywhere">Bücher</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{userStats.posts}</span>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground hidden sm:flex" />
            <span className="text-sm text-muted-foreground wrap-anywhere">Beiträge</span>
          </div>
        </div>
        <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => { setInitialTab("followers"); setFollowDialogOpen(true); }}>
          <span className="font-semibold text-lg">{userStats.followersCount || 0}</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-muted-foreground hidden sm:flex" />
            <span className="text-sm text-muted-foreground wrap-anywhere">Follower</span>
          </div>
        </div>
        <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => { setInitialTab("following"); setFollowDialogOpen(true); }}>
          <span className="font-semibold text-lg">{userStats.followingCount || 0}</span>
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-muted-foreground hidden sm:flex" />
            <span className="text-sm text-muted-foreground wrap-anywhere">Gefolgt</span>
          </div>
        </div>
      </div>

      <FollowListDialog
        open={followDialogOpen}
        onOpenChange={setFollowDialogOpen}
        userId={Number(userId)}
        initialTab={initialTab}
      />
    </div>
  )
}
export default ProfileHeader
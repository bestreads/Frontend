import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, UserPlus, UserX } from "lucide-react"
import { useNavigate } from "react-router"
import { useFollowContext } from "@/contexts/FollowContext"
import { getUserProfile, type FollowUser, type UserProfile } from "@/api/userService"
import { useAuth } from "@/contexts/Authcontext"
import { Spinner } from "./ui/spinner"

interface FollowListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number // Die userId des Profils, dessen Follower/Following angezeigt werden sollen
  initialTab?: "followers" | "following"
}

export function FollowListDialog({
  open,
  onOpenChange,
  userId,
  initialTab = "followers",
}: FollowListDialogProps) {
  const { isFollowing, toggle, isFollowLoading, loadFollowersFor, loadFollowingFor } = useFollowContext()

  const [activeTab, setActiveTab] = useState<"followers" | "following">(initialTab)
  const [followerList, setFollowerList] = useState<FollowUser[]>([])
  const [followingList, setFollowingList] = useState<FollowUser[]>([])
  const [isLoadingLists, setIsLoadingLists] = useState(false)
  const [dialogUser, setDialogUser] = useState<UserProfile | null>(null)
  const navigate = useNavigate()

  const { user: authUser } = useAuth()

  // Sync activeTab mit initialTab wenn es sich ändert
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  // Listen UND User-Profil für userId laden wenn Dialog geöffnet wird oder userId sich ändert
  useEffect(() => {
    if (open && userId) {
      const loadLists = async () => {
        console.log("[FollowListDialog] Lade Listen und Profil für userId:", userId)
        setIsLoadingLists(true)
        try {
          const [followers, following, userProfile] = await Promise.all([
            loadFollowersFor(userId),
            loadFollowingFor(userId),
            getUserProfile(userId),
          ])
          setFollowerList(followers)
          setFollowingList(following)
          setDialogUser(userProfile)
          console.log("[FollowListDialog] Daten geladen - User:", userProfile.username, "Followers:", followers.length, "Following:", following.length)
        } catch (err) {
          console.error("[FollowListDialog] Fehler beim Laden der Listen:", err)
        } finally {
          setIsLoadingLists(false)
        }
      }
      loadLists()
    }
  }, [open, userId, loadFollowersFor, loadFollowingFor])

  const handleFollowToggle = async (targetUserId: number) => {
    console.log("[FollowListDialog] Toggle für userId:", targetUserId)
    await toggle(targetUserId)
    // Listen neu laden nach toggle
    const [followers, following] = await Promise.all([
      loadFollowersFor(userId),
      loadFollowingFor(userId),
    ])
    setFollowerList(followers)
    setFollowingList(following)
  }

  const handleUserClick = (targetUserId: number) => {
    onOpenChange(false)
    setTimeout(() => {
      navigate(`/profile/${targetUserId}`)
    }, 100)
  }

  const renderUserList = (users: FollowUser[]) => {
    if (users.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Keine Benutzer gefunden
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {users.map((user) => {
          const userIsFollowing = isFollowing(user.userId)

          return (
            <div
              key={user.userId}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                onClick={() => handleUserClick(user.userId)}
                className="flex items-center gap-3 flex-1 min-w-0 group cursor-pointer"
              >
                <Avatar className="w-10 h-10 group-hover:border-accent border-2 border-transparent transition-colors">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-accent transition-colors">{user.username}</p>
                  <p className="text-sm text-muted-foreground">#{user.userId}</p>
                </div>
              </div>
              {authUser && user.userId === authUser.userId ? null : (
                <Button
                  size="sm"
                  variant={userIsFollowing ? "outline" : "default"}
                  onClick={() => handleFollowToggle(user.userId)}
                  disabled={isFollowLoading}
                  className="shrink-0"
                >
                  {userIsFollowing ? (
                    <>
                      <UserX className="w-4 h-4 mr-1" />
                      Entfolgen
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-1" />
                      Folgen
                    </>
                  )}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Follower von <span className="font-bold">{dialogUser?.username || "Benutzer"}</span></DialogTitle>
        </DialogHeader>

        {isLoadingLists ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "followers" | "following")}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="followers">
                Follower ({followerList.length})
              </TabsTrigger>
              <TabsTrigger value="following">
                Gefolgt ({followingList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="followers" className="mt-4">
              {renderUserList(followerList)}
            </TabsContent>

            <TabsContent value="following" className="mt-4">
              {renderUserList(followingList)}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

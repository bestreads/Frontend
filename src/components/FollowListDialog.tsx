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
import { followUser, unfollowUser } from "@/api/followService"

interface FollowUser {
  userId: number
  username: string
  profilePicture: string
  isFollowing?: boolean
}

interface FollowListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: number // Optional: für spezifischen User, sonst eigene Follower/Following
  initialTab?: "followers" | "following"
}

export function FollowListDialog({
  open,
  onOpenChange,
  userId,
  initialTab = "followers",
}: FollowListDialogProps) {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(initialTab)
  const [followers, setFollowers] = useState<FollowUser[]>([])
  const [following, setFollowing] = useState<FollowUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Update activeTab when dialog opens with new initialTab
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab)
    }
  }, [open, initialTab])

  // Load follower/following data when dialog opens
  useEffect(() => {
    if (open) {
      loadFollowData()
    }
  }, [open, userId])

  const loadFollowData = async () => {
    setIsLoading(true)
    try {
      // TODO: Ersetze durch echte API-Calls
      // const followersData = await getFollowers(userId)
      // const followingData = await getFollowing(userId)

      // Mock-Daten
      setFollowers([
        { userId: 1, username: "Alice", profilePicture: "", isFollowing: true },
        { userId: 2, username: "Bob", profilePicture: "", isFollowing: false },
        { userId: 3, username: "Charlie", profilePicture: "", isFollowing: true },
      ])

      setFollowing([
        { userId: 4, username: "David", profilePicture: "", isFollowing: true },
        { userId: 5, username: "Emma", profilePicture: "", isFollowing: true },
      ])
    } catch (error) {
      console.error("Fehler beim Laden der Follower-Daten:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowToggle = async (targetUserId: number, currentlyFollowing: boolean) => {
    try {
      if (currentlyFollowing) {
        await unfollowUser(targetUserId)
      } else {
        await followUser(targetUserId)
      }
      // Daten neu laden nach Änderung
      await loadFollowData()
    } catch (error) {
      console.error("Fehler beim Follow/Unfollow:", error)
    }
  }

  const handleUserClick = (targetUserId: number) => {
    onOpenChange(false)
    // Kleine Verzögerung, damit der Dialog sich schließt, bevor navigiert wird
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
        {users.map((user) => (
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

            <Button
              size="sm"
              variant={user.isFollowing ? "outline" : "default"}
              onClick={() => handleFollowToggle(user.userId, user.isFollowing || false)}
              className="shrink-0"
            >
              {user.isFollowing ? (
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
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Follower & Gefolgt</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Laden...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "followers" | "following")}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="followers">
                Follower ({followers.length})
              </TabsTrigger>
              <TabsTrigger value="following">
                Gefolgt ({following.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="followers" className="mt-4">
              {renderUserList(followers)}
            </TabsContent>

            <TabsContent value="following" className="mt-4">
              {renderUserList(following)}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

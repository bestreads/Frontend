import { User, UserPlus, BookOpen, MessageSquare, Users, UserCheck } from "lucide-react"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useAuth } from "@/contexts/Authcontext"


function ProfileHeader({ userId }: { userId: string }) {

  const { user } = useAuth()

  /*
  TODO: Backendaufruf mit userId
  */
  const userStats = {
    userId: "123dsafasdfasdfsadfasdf",
    username: "test123",
    profilePictureURL: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Ffunny-face-pictures-rgcsg7f53oic3c5t.jpg&f=1&nofb=1&ipt=fa2b5b9d406c7b592380825b46dd476468ee047dcb676c92e47a14d479a29995",
    accountCreatedAtYear: 2025,
    booksInLibrary: 12,
    posts: 34,
    follower: 5678,
    following: 91011,
  }
  /*
  TODO: Backendaufruf für Followstatus
  */
  const isFollower = false

  const canFollow = !isFollower && (user?.id !== userId);

  return (
    <div className="flex flex-col gap-6 px-6 lg:flex-row">
      <div className="flex-1 flex gap-6 items-center">
        {/* Avatar */}
        <Avatar className="w-24 h-24 rounded-full border-2">
          <AvatarImage src={userStats.profilePictureURL} />
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

        {/* Button */}
        {canFollow ?
          <Button variant="default" onClick={()=>{alert("gefolgt")}}
          className="ml-auto self-center lg:ml-0">
            <UserPlus />
            <span className="hidden sm:flex">Folgen</span>
          </Button> :
          <Button variant="default" disabled={true} className="ml-auto self-center lg:ml-0 ">
            <UserCheck />
            <span className="hidden sm:flex">Gefolgt</span>
          </Button>
        }

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
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{userStats.follower}</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-muted-foreground hidden sm:flex" />
            <span className="text-sm text-muted-foreground">Follower</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{userStats.following}</span>
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-muted-foreground hidden sm:flex" />
            <span className="text-sm text-muted-foreground">Folge ich</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProfileHeader
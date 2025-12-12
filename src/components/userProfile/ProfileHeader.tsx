import { User, UserPlus, BookOpen, MessageSquare, Users, UserCheck } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface ProfileHeaderProps {
  loggedInUserId: string
  userId: string
}

function ProfileHeader({ loggedInUserId, userId }: ProfileHeaderProps) {

  /*
  TODO: Backendaufruf mit userId
  */
  const userStats = {
    username: "Benutzer",
    profilePictureURL: "https://image.stern.de/7561920/t/rt/v4/w1440/r1.3333/-/affen-selfie-peta-david-slater.jpg",
    accountCreatedAtYear: "2025",
    booksInLibrary: 12,
    posts: 34,
    follower: 5678,
    following: 91011,
  }
  /*
  TODO: Backendaufruf
  */
  const isFollower = false
  const canFollow = isFollower && (loggedInUserId !== userId);

  return (
    <Card className="mb-6">
      <CardContent className="flex flex-col gap-6 px-6 lg:flex-row">
        <div className="flex-1 flex gap-6 items-center">
          {/* Avatar */}
          <Avatar className="w-24 h-24 rounded-full border-2 border-primary">
            <AvatarImage src={userStats.profilePictureURL} />
            <AvatarFallback>
              <User className="w-12 h-12 text-primary" />
            </AvatarFallback>
          </Avatar>
          {/* Name */}
          <div className="">
            <h2 className="text-2xl font-semibold flex flex-col lg:flex-row">
              {userStats.username}
              <span className="italic text-muted-foreground lg:ml-2"> #{userId}</span>
            </h2>
            <p className="text-sm text-muted-foreground">Mitglied seit {userStats.accountCreatedAtYear}</p>
          </div>

          {/* Button */}
          {!canFollow && (
            <Button variant="default" className="ml-auto self-start sm:self-center lg:ml-0 ">
              <UserPlus />
              <span className="hidden sm:flex">Folgen</span>
            </Button>
          )}

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


      </CardContent>
    </Card>
  )
}
export default ProfileHeader
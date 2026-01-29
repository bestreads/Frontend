import type { Post } from "@/types/post"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { User, Star } from "lucide-react"
import { bookStateLabelsThirdPerson } from "../types/book"
import { BookDetailDialog } from "@/components/BookDetailDialog"
import { useState } from "react"
import { Link, useLocation } from "react-router"

function PostCard({ postData }: { postData: Post }) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const location = useLocation()

  const isAlreadyOnProfile = location.pathname === `/profile/${postData.author.userId}`

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const diff = rating - (star - 1)
          let fillClass = ""

          if (diff >= 1) {
            // Voller Stern
            fillClass = "fill-primary text-primary"
          } else if (diff > 0) {
            // Teilweise gefüllter Stern
            fillClass = "text-primary"
            return (
              <div key={star} className="relative w-5 h-5">
                <Star className="w-5 h-5 fill-gray-300 text-gray-300 absolute" />
                <div
                  className="overflow-hidden absolute"
                  style={{ width: `${diff * 100}%` }}
                >
                  <Star className="w-5 h-5 fill-primary text-primary" />
                </div>
              </div>
            )
          } else {
            // Leerer Stern
            fillClass = "fill-gray-300 text-gray-300"
          }

          return (
            <Star
              key={star}
              className={`w-5 h-5 ${fillClass}`}
            />
          )
        })}
      </div>
    )
  }

  return (
    <>
      <Card className="flex flex-col p-6 gap-6 lg:grid grid-cols-3 grid-row2">
        {/* Beitrags Autor */}
        <CardHeader className="flex flex-wrap items-center justify-start col-span-3 p-0">
          <Link
            to={isAlreadyOnProfile ? "#" : `/profile/${postData.author.userId}`}
            className={`group flex items-center gap-2 rounded-xl ${isAlreadyOnProfile ? "cursor-default" : "transition-colors"}`}
            onClick={(e) => isAlreadyOnProfile && e.preventDefault()}
          >
            <Avatar className={`w-12 h-12 rounded-full border-2 transition-colors ${isAlreadyOnProfile ? "" : "group-hover:border-accent"}`}>
              <AvatarImage src={postData.author.profilePictureURL} className="object-cover" />
              <AvatarFallback>
                <User className="w-12 h-12 text-primary" />
              </AvatarFallback>
            </Avatar>
            <span className={`text-primary text-xl font-bold transition-colors ${isAlreadyOnProfile ? "" : "group-hover:text-accent"}`}>
              {postData.author.username}
            </span>
          </Link>
          <p className="text-lg">{bookStateLabelsThirdPerson[postData.book.userBook.state]}</p>
        </CardHeader>

        {/* Buchinformationen */}
        <div
          className="group flex flex-row flex-wrap gap-6 cursor-pointer rounded-sm "
          onClick={() => setIsDetailDialogOpen(true)}
        >
          {/* Cover */}
          <div className="w-30 aspect-2/3 hidden sm:flex items-center justify-center m-auto">
            <img
              src={postData.book.CoverURL || "/placeholder-book.png"}
              alt={`Cover von ${postData.book.Title}`}
              className="w-24 lg:w-auto aspect-2/3 object-cover rounded-lg shadow-md self-start border-4 border-transparent transition-colors group-hover:border-accent"
            />
          </div>
          <div className="flex-1">
            <div className="mb-3 flex flex-col items-start justify-between gap-2">

              {/* Buchtitel & Autor */}
              <h2 className="text-xl sm:text-2xl font-bold mr-auto transition-colors group-hover:text-accent wrap-anywhere">{postData.book.Title}</h2>
              <p className="text-muted-foreground text-base"> <span className="text-xs text-muted-foreground italic">von</span> {postData.book.Author}</p>

              <div className="flex gap-2 content-center">
                {/* Buch Bewertung */}
                <p className="mb-1 text-xs text-muted-foreground italic">Gesamtbewertung</p>
                <div className="flex items-center gap-2">
                  <Star className={`w-5 h-5 fill-primary text-primary sm:hidden`} />
                  <span className="hidden sm:flex gap-2 items-center">
                    {renderStars(postData.book.RatingAvg)}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    ({postData.book.RatingAvg.toFixed(1)}/5)
                  </span>

                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Beitrag */}
        <CardContent className="bg-accent-foreground p-4 rounded-sm col-span-2">
          <div className="flex items-center justify-between">
            {/* Nutzerbewertung */}
            <div className="flex items-center gap-2">
              <Star className={`w-5 h-5 fill-primary text-primary sm:hidden`} />
              <span className="hidden sm:flex gap-2 items-center">
                {renderStars(postData.book.userBook.rating)}
              </span>

              <span className="text-sm text-muted-foreground">
                ({postData.book.userBook.rating.toFixed(1)}/5)
              </span>
            </div>

            <p className="hidden sm:flex text-muted-foreground text-s">
              {new Date(postData.createdAt).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="sm:hidden text-muted-foreground text-s">
              {new Date(postData.createdAt).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              })}
            </p>
          </div>
          <p className="text-lg my-4">{postData.content}</p>
        </CardContent>
      </Card >

      {/* Book Detail Dialog */}
      <BookDetailDialog
        book={postData.book}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </>
  )
}

export default PostCard
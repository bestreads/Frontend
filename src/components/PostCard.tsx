import type { Post } from "@/types/post"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { User, Star, Pencil, Trash2, MoreVertical } from "lucide-react"
import { bookStateLabelsThirdPerson } from "../types/book"
import { BookDetailDialog } from "@/components/BookDetailDialog"
import { useState } from "react"
import { Link, useLocation } from "react-router"
import { StarRating } from "./libraryOptions/StarRating"
import { AvgRating } from "./AvgRating"
import { useAuth } from "@/contexts/Authcontext"
import { Button } from "./ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { deletePost } from "@/api/postService"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

function PostCard({ postData, onRatingChange, onEditPost }: { postData: Post, onRatingChange?: () => void, onEditPost?: (post: Post) => void }) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [currentRating, setCurrentRating] = useState(postData.book.userBook.rating ? postData.book.userBook.rating : 0)
  const [hasChanges, setHasChanges] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  const isAlreadyOnProfile = location.pathname === `/profile/${postData.author.userId}`
  const isOwnPost = String(user?.userId) === postData.author.userId

  const handleRatingChange = (rating: number) => {
    setCurrentRating(rating)
    setHasChanges(true)
  }

  const handleStatusChange = () => {
    setHasChanges(true)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDetailDialogOpen(open)
    // Wenn Dialog geschlossen wird und es Änderungen gab, lade Posts neu
    if (!open && hasChanges) {
      onRatingChange?.()
      setHasChanges(false)
    }
  }

  const handlePostEdit = () => {
    onEditPost?.(postData)
  }

  const handlePostDelete = async () => {
    await deletePost({ bid: postData.book.ID })
    onRatingChange?.()
  }

  return (
    <>
      <Card className="flex flex-col p-6 gap-6 lg:grid grid-cols-3 grid-row2">
        {/* Beitrags Autor */}
        <CardHeader className="flex flex-wrap items-center gap-2 justify-start col-span-3 p-0">
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
          <p className="text-lg">{postData.book.userBook.state ? bookStateLabelsThirdPerson[postData.book.userBook.state] : null}</p>

          {isOwnPost && <div className="ml-auto">
            {/* Post bearbeiten */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Beitragsoptionen"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePostEdit}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Bearbeiten
                </DropdownMenuItem>

                {/* Post löschen */}
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Löschen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>}
        </CardHeader>

        {/* Buchinformationen */}
        <div
          className="group flex flex-row flex-wrap gap-6 cursor-pointer rounded-sm "
          onClick={() => setIsDetailDialogOpen(true)}
        >
          {/* Cover */}
          <div className="w-30 aspect-2/3 hidden sm:flex items-center justify-center m-auto wrap-break-word">
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

              {postData.book.Rating && (
                <AvgRating
                  avg={postData.book.Rating.Avg}
                  count={postData.book.Rating.Count}
                  showLabel={false}
                />
              )}
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
                <StarRating rating={currentRating} starIconSize={5} />
              </span>

              <span className="text-sm text-muted-foreground">
                ({currentRating.toFixed(1)}/5)
              </span>
            </div>

            <p className="hidden sm:flex text-muted-foreground text-s">
              {new Date(postData.updatedAt).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="sm:hidden text-muted-foreground text-s">
              {new Date(postData.updatedAt).toLocaleDateString('de-DE', {
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
      < BookDetailDialog
        book={postData.book}
        open={isDetailDialogOpen}
        onOpenChange={handleDialogClose}
        onRatingChange={handleRatingChange}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Beitrag löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du deinen Beitrag zu "{postData.book.Title}" wirklich entfernen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePostDelete}
              className={`bg-destructive text-white hover:bg-destructive/75 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 dark:hover:bg-destructive/50 active:scale-95 transition-all`}
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PostCard
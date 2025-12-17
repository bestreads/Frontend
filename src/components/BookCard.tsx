import { Star, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { bookStateLabels } from "@/types/book"
import type { BookWithUserData, BookState } from "@/types/book"
import { BookDetailDialog } from "@/components/BookDetailDialog"

interface BookCardProps {
  book: BookWithUserData
  onDelete: (isbn: string) => void
  onUpdateStatus: (isbn: string, status: BookState) => void
  onRate: (isbn: string, rating: number) => void
}

export function BookCard({ book, onDelete, onUpdateStatus, onRate }: BookCardProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const [isRatingPopoverOpen, setIsRatingPopoverOpen] = useState(false)
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const handleStatusChange = (newStatus: BookState) => {
    onUpdateStatus(book.ISBN, newStatus)
    setIsStatusPopoverOpen(false)
  }

  const handleRatingClick = (rating: number) => {
    onRate(book.ISBN, rating)
    setIsRatingPopoverOpen(false)
  }

  const handleDelete = () => {
    onDelete(book.ISBN)
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (interactive ? (hoverRating || rating) : rating)
          const isHovered = interactive && hoverRating >= star
          
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && handleRatingClick(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? isHovered
                      ? "fill-primary/80 text-primary/80"
                      : "fill-primary text-primary"
                    : "fill-gray-300 text-gray-300"
                }`}
              />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <Card 
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsDetailDialogOpen(true)}
      >
        <div className="flex gap-6">
          {/* Buchcover */}
          <div className="flex-shrink-0">
            <img
              src={book.coverurl || "/placeholder-book.png"}
              alt={`Cover von ${book.title}`}
              className="w-32 h-48 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Buchinformationen */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <h2 className="text-2xl font-bold mb-1">{book.title}</h2>
                  <p className="text-muted-foreground text-base">von {book.author}</p>
                </div>
                
                <div className="flex items-center gap-2 mb-8">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium">{bookStateLabels[book.userBook.state]}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {renderStars(book.userBook.rating)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Bewertung Popover */}
                <Popover open={isRatingPopoverOpen} onOpenChange={setIsRatingPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Bewerten"
                    >
                      <Star className="h-5 w-5 text-primary fill-primary" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="end">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Bewertung</p>
                      {renderStars(book.userBook.rating, true)}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Status ändern Popover */}
                <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Status ändern"
                    >
                      <BookOpen className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="end">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant={book.userBook.state === "want-to-read" ? "default" : "ghost"}
                        className="justify-start"
                        size="sm"
                        onClick={() => handleStatusChange("want-to-read")}
                      >
                        Möchte ich lesen
                      </Button>
                      <Button
                        variant={book.userBook.state === "reading" ? "default" : "ghost"}
                        className="justify-start"
                        size="sm"
                        onClick={() => handleStatusChange("reading")}
                      >
                        Lese ich gerade
                      </Button>
                      <Button
                        variant={book.userBook.state === "read" ? "default" : "ghost"}
                        className="justify-start"
                        size="sm"
                        onClick={() => handleStatusChange("read")}
                      >
                        Gelesen
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Löschen"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Buch löschen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Möchtest du "{book.title}" wirklich aus deiner Bibliothek entfernen? Diese Aktion kann nicht rückgängig gemacht werden.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className={`bg-destructive text-white hover:bg-destructive/75 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 dark:hover:bg-destructive/50 active:scale-95 transition-all`}
                      >
                        Löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Book Detail Dialog */}
      <BookDetailDialog
        book={book}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        isInLibrary={true}
        currentStatus={book.userBook.state}
        onStatusChange={(_, status) => onUpdateStatus(book.ISBN, status)}
      />
    </>
  )
}

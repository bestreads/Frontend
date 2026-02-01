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
import { StarRating } from "./libraryOptions/StarRating"

interface BookCardProps {
  book: BookWithUserData
  readOnly?: boolean
  onDelete?: (id: number) => void
  onUpdateStatus?: (id: number, status: BookState) => void
  onRate?: (id: number, rating: number) => void
}

export function BookCard({ book, readOnly = false, onDelete, onUpdateStatus, onRate }: BookCardProps) {

  const [isRatingPopoverOpen, setIsRatingPopoverOpen] = useState(false)
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const handleStatusChange = (newStatus: BookState) => {
    onUpdateStatus?.(book.ID, newStatus)
    setIsStatusPopoverOpen(false)
  }

  const handleDelete = () => {
    onDelete?.(book.ID)
  }

  const handleRatingClick = (rating: number) => {
    onRate?.(book.ID, rating)
    setIsRatingPopoverOpen(false)
  }


  return (
    <>
      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsDetailDialogOpen(true)}
      >
        <div className="flex gap-6 flex-col-reverse sm:flex-row">
          {/* Buchcover */}
          <div className="shrink-0">
            <img
              src={book.CoverURL || "/placeholder-book.png"}
              alt={`Cover von ${book.Title}`}
              className="w-32 h-48 object-cover rounded-lg shadow-md justify-self-center"
            />
          </div>

          {/* Buchinformationen */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 flex-col-reverse sm:flex-row">
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="">
                  <h2 className="text-2xl font-bold mb-1">{book.Title}</h2>
                  <p className="text-muted-foreground text-base">von {book.Author}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium">{bookStateLabels[book.userBook.state]}</span>
                </div>

                <div className="flex items-center gap-2">
                  <StarRating rating={book.userBook.rating} />
                </div>
              </div>

              {/* Action Buttons */}
              {!readOnly && (
                <div className="flex gap-2 shrink-0 self-end sm:self-start " onClick={(e) => e.stopPropagation()}>
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
                        <StarRating rating={book.userBook.rating} interactive={true} onRatingChange={handleRatingClick} />
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
                          Möchtest du "{book.Title}" wirklich aus deiner Bibliothek entfernen? Diese Aktion kann nicht rückgängig gemacht werden.
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
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Book Detail Dialog */}
      <BookDetailDialog
        book={book}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onStatusChange={(_, status) => onUpdateStatus?.(book.ID, status)}
      />
    </>
  )
}
import { Trash2, BookOpen, MoreVertical, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const handleStatusChange = (newStatus: BookState) => {
    onUpdateStatus?.(book.ID, newStatus)
  }

  const handleDelete = () => {
    onDelete?.(book.ID)
  }

  const handleRatingClick = (rating: number) => {
    onRate?.(book.ID, rating)
  }


  return (
    <>
      <Card
        className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
        onClick={() => setIsDetailDialogOpen(true)}
      >
        <div className="flex gap-4 sm:gap-6 flex-col-reverse sm:flex-row min-w-0">
          {/* Buchcover */}
          <div className="shrink-0 self-center sm:self-start">
            <img
              src={book.CoverURL || "/placeholder-book.png"}
              alt={`Cover von ${book.Title}`}
              className="w-20 h-32 sm:w-24 sm:h-36 md:w-32 md:h-48 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Buchinformationen */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex gap-2 flex-col-reverse sm:flex-row min-w-0">
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 truncate">{book.Title}</h2>
                  <p className="text-muted-foreground text-sm sm:text-base truncate">von {book.Author}</p>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-muted-foreground shrink-0">Status:</span>
                  <span className="text-sm font-medium truncate min-w-0">{book.userBook.state ? bookStateLabels[book.userBook.state] : null}</span>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <StarRating rating={book.userBook.rating} />
                </div>
              </div>

              {/* Action Buttons */}
              {!readOnly && (
                <div className="shrink-0 self-end sm:self-start" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Buchoptionen">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-50">
                      {/* Bewertung */}
                      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal flex items-center gap-2">
                        <Star className="w-3 h-3" />
                        Bewertung
                      </DropdownMenuLabel>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent cursor-default">
                        <StarRating rating={book.userBook.rating} interactive={true} onRatingChange={handleRatingClick} />
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Lesestatus */}
                      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        Lesestatus
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("want-to-read")}
                        className={book.userBook.state === "want-to-read" ? "font-semibold" : ""}
                      >
                        Möchte ich lesen
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("reading")}
                        className={book.userBook.state === "reading" ? "font-semibold" : ""}
                      >
                        Lese ich gerade
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("read")}
                        className={book.userBook.state === "read" ? "font-semibold" : ""}
                      >
                        Gelesen
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {/* Löschen */}
                      <DropdownMenuItem
                        onClick={() => setIsDeleteAlertOpen(true)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Delete Alert Dialog */}
                  <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
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
        onStatusChange={(id, status) => {
          onUpdateStatus?.(id, status)
        }}
      />
    </>
  )
}
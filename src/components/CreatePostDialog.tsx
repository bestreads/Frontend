import { useState, useEffect } from "react"
import { MessageSquare, Star } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Spinner } from "./ui/spinner"
import { getLibrary, type LibraryBook } from "@/api/libraryService"
import { createPost } from "@/api/postService"
import { apiToBookState, bookStateLabels, type BookState } from "@/types/book"

export function CreatePostDialog({ onPostCreated }: { onPostCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>([])
  const [selectedBookId, setSelectedBookId] = useState<string>("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Lade Bücher aus der Bibliothek wenn Dialog geöffnet wird
  useEffect(() => {
    if (open) {
      const fetchLibrary = async () => {
        setLoading(true)
        try {
          const books = await getLibrary()
          setLibraryBooks(books)
        } catch (error) {
          console.error("Fehler beim Laden der Bibliothek:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchLibrary()
    }
  }, [open])

  // Reset wenn Dialog geschlossen wird
  useEffect(() => {
    if (!open) {
      setSelectedBookId("")
      setContent("")
      setSubmitError(null)
    }
  }, [open])

  const selectedBook = libraryBooks.find(
    (book) => book.Book.ID.toString() === selectedBookId
  )

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const diff = rating - (star - 1)
          let fillClass = ""

          if (diff >= 1) {
            fillClass = "fill-primary text-primary"
          } else if (diff > 0) {
            return (
              <div key={star} className="relative w-4 h-4">
                <Star className="w-4 h-4 fill-gray-300 text-gray-300 absolute" />
                <div
                  className="overflow-hidden absolute"
                  style={{ width: `${diff * 100}%` }}
                >
                  <Star className="w-4 h-4 fill-primary text-primary" />
                </div>
              </div>
            )
          } else {
            fillClass = "fill-gray-300 text-gray-300"
          }

          return <Star key={star} className={`w-4 h-4 ${fillClass}`} />
        })}
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!selectedBookId || !content.trim()) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      await createPost({
        bid: parseInt(selectedBookId),
        content: content.trim(),
      })
      setOpen(false)
      onPostCreated?.()
    } catch (error) {
      console.error("Fehler beim Erstellen des Beitrags:", error)
      setSubmitError("Beitrag konnte nicht erstellt werden. Bitte nochmal versuchen.")
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = selectedBookId && content.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 rounded-full size-20 shadow-xl z-50 hover:scale-105 transition-transform"
        >
          <MessageSquare className="size-10" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Neuer Beitrag</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Buch auswählen */}
          <div className="space-y-2">
            <Label htmlFor="book-select">Buch auswählen</Label>
            {loading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : (
              <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                <SelectTrigger id="book-select">
                  <SelectValue placeholder="Wähle ein Buch aus deiner Bibliothek" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {libraryBooks.length === 0 ? (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      Keine Bücher in deiner Bibliothek
                    </div>
                  ) : (
                    libraryBooks.map((libraryBook) => (
                      <SelectItem
                        key={libraryBook.Book.ID}
                        value={libraryBook.Book.ID.toString()}
                      >
                        {libraryBook.Book.Title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Ausgewähltes Buch anzeigen */}
          {selectedBook && (
            <div className="flex gap-4 p-4 bg-accent/50 rounded-lg">
              <img
                src={selectedBook.Book.CoverURL || "/placeholder-book.png"}
                alt={`Cover von ${selectedBook.Book.Title}`}
                className="w-20 h-28 object-cover rounded shadow-sm shrink-0 hidden sm:flex"
              />
              <div className="flex-1 flex flex-col justify-center gap-1 shrink-0">
                <h3 className="font-semibold  bg-red-50">
                  {selectedBook.Book.Title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedBook.Book.Author}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  {bookStateLabels[apiToBookState[selectedBook.State] as BookState]}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Deine Bewertung:</span>
                  {renderStars(selectedBook.Rating)}
                </div>
              </div>
            </div>
          )}

          {/* Beitrag Text */}
          <div className="space-y-2">
            <Label htmlFor="post-content">Dein Beitrag</Label>
            <Textarea
              id="post-content"
              placeholder="Was möchtest du über dieses Buch sagen?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Fehlermeldung anzeigen */}
          {submitError && (
            <div className="text-sm text-destructive font-medium">
              {submitError}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? <Spinner /> : "Posten"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { createPost, getPosts, updatePost } from "@/api/postService"
import { bookStateToApi, type BookState } from "@/types/book"
import { BookCard } from "./BookCard"
import { useLibrary } from "@/contexts/LibraryContext"
import { updateBookState } from "@/api/libraryService"
import { useAuth } from "@/contexts/Authcontext"
import type { Post } from "@/api/postService"

interface CreatePostDialogProps {
  onPostCreated?: () => void
  initialBookId?: number
  onInitialBookIdChange?: (id: number | undefined) => void
  showButton?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreatePostDialog({
  onPostCreated,
  initialBookId,
  onInitialBookIdChange,
  showButton = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: CreatePostDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  const [selectedBookId, setSelectedBookId] = useState<string>("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { libraryBooks, refreshLibrary, updateBookInLocalLibrary, isLoading } = useLibrary()
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const { user } = useAuth()

  const existingPost = userPosts.find((post) => post.Book.ID === Number(selectedBookId))
  const isPostUpdate = !!existingPost

  const selectedBook = libraryBooks.find(
    (book) => book.ID.toString() === selectedBookId
  )

  const canSubmit = selectedBookId && content.trim().length > 0

  // Lade Bücher & Posts wenn Dialog geöffnet wird
  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        const posts = await getPosts({ userId: user?.userId })
        setUserPosts(posts)

        // Setze Buch nachdem Posts geladen wurden
        if (initialBookId) {
          setSelectedBookId(initialBookId.toString())
        }
      } catch (error) {
        console.error("Fehler beim Laden der Posts:", error)
      }
    }

    if (open) {
      refreshLibrary()
      loadUserPosts()
    }
  }, [open, refreshLibrary, user, initialBookId])

  // Lade Content wenn ein Buch ausgewählt wird, das bereits einen Post hat
  useEffect(() => {
    if (selectedBookId && existingPost) {
      setContent(existingPost.Content ?? "")
    } else if (selectedBookId && !existingPost) {
      setContent("")
    }
  }, [selectedBookId, existingPost])

  // Reset wenn Dialog geschlossen wird
  useEffect(() => {
    if (!open) {
      setSelectedBookId("")
      setContent("")
      setSubmitError(null)
      onInitialBookIdChange?.(undefined)
    }
  }, [open, onInitialBookIdChange])

  const handleUpdateStatus = async (bookId: number, status: BookState) => {
    try {
      // API Call - verwende bookStateToApi Helper
      const apiState = bookStateToApi[status]

      await updateBookState(bookId, apiState)

      // Lokale Bibliothek aktualisieren
      updateBookInLocalLibrary(bookId, status)
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Status:", error)
    }
  }

  const handleSubmit = async () => {
    if (!selectedBookId || !content.trim()) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      if (isPostUpdate) {
        // Post existiert bereits -> Update
        await updatePost({
          bid: parseInt(selectedBookId),
          content: content.trim(),
        })
      } else {
        // Kein Post vorhanden -> Neu erstellen
        await createPost({
          bid: parseInt(selectedBookId),
          content: content.trim(),
        })
      }

      setOpen(false)
      onPostCreated?.()
    } catch (error) {
      console.error("Fehler beim Speichern des Beitrags:", error)
      setSubmitError("Beitrag konnte nicht gespeichert werden. Bitte nochmal versuchen.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleBookSelection = (bookId: string) => {
    setSelectedBookId(bookId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showButton && <DialogTrigger asChild>
        <Button
          className="fixed bottom-2 right-2 sm:bottom-8 sm:right-8 rounded-full size-20 shadow-xl z-50 hover:scale-105 transition-transform"
        >
          <MessageSquare className="size-10" />
        </Button>
      </DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{isPostUpdate ? `Beitrag bearbeiten` : "Neuer Beitrag"}</DialogTitle>
          <DialogDescription>
            Teile deine Gedanken zu einem Buch aus deiner Bibliothek.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          {/* Buch auswählen */}
          <div className="space-y-2 w-full">
            <Label htmlFor="book-select">Buch auswählen</Label>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : (
              <Select value={selectedBookId} onValueChange={handleBookSelection}>
                <SelectTrigger id="book-select" className="w-full">
                  <SelectValue placeholder="Wähle ein Buch aus deiner Bibliothek" />
                </SelectTrigger>
                <SelectContent>
                  {libraryBooks.length === 0 ? (
                    <div className="py-2 px-2 text-sm text-muted-foreground">
                      Keine Bücher in deiner Bibliothek
                    </div>
                  ) : (
                    libraryBooks.map((libraryBook) => (
                      <SelectItem
                        key={libraryBook.ID}
                        value={libraryBook.ID.toString()}
                      >
                        {libraryBook.Title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Ausgewähltes Buch anzeigen */}
          {selectedBook && (
            <div className="w-full">
              <BookCard
                book={selectedBook}
                readOnly={true}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          )}

          {/* Beitrag Text */}
          <div className="space-y-2 w-full">
            <Label htmlFor="post-content">Dein Beitrag</Label>
            <Textarea
              id="post-content"
              placeholder="Was möchtest du über dieses Buch sagen?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[100px] resize-none"
            />
          </div>

          {/* Fehlermeldung anzeigen */}
          {submitError && (
            <div className="text-sm text-destructive font-medium w-full">
              {submitError}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? <Spinner /> : isPostUpdate ? "Post aktualisieren" : "Posten"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
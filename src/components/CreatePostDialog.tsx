import { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
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
import { createPost, getPosts, updatePost } from "@/api/postService"
import { bookStateToApi, type BookState } from "@/types/book"
import { BookCard } from "./BookCard"
import { useLibrary } from "@/contexts/LibraryContext"
import { updateBookState } from "@/api/libraryService"
import { useAuth } from "@/contexts/Authcontext"
import type { Post } from "@/api/postService"

export function CreatePostDialog({ onPostCreated }: { onPostCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [selectedBookId, setSelectedBookId] = useState<string>("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPostUpdate, setIsPostUpdate] = useState<boolean>(false)

  const { libraryBooks, refreshLibrary, updateBookInLocalLibrary, isLoading } = useLibrary()
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const { user } = useAuth()

  // Lade Bücher & Posts wenn Dialog geöffnet wird
  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        const posts = await getPosts({ userId: user?.userId })
        setUserPosts(posts)
      } catch (error) {
        console.error("Fehler beim Laden der Posts:", error)
      }
    }

    if (open) {
      refreshLibrary()
      loadUserPosts()
    }
  }, [open, refreshLibrary, user])



  // Reset wenn Dialog geschlossen wird
  useEffect(() => {
    if (!open) {
      setSelectedBookId("")
      setContent("")
      setSubmitError(null)
      setIsPostUpdate(false)
    }
  }, [open])

  const selectedBook = libraryBooks.find(
    (book) => book.ID.toString() === selectedBookId
  )

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
      const existingPost = userPosts.find((post) => post.Book.ID === Number(selectedBookId))

      if (existingPost) {
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

  const handleBookSelection = async (bookId: string) => {
    setSelectedBookId(bookId)

    // Suche bereits erstellt Posts zu diesem Buch & setzte content
    const matchingPost = userPosts.find((post) => post.Book.ID === Number(bookId))
    if (matchingPost) {
      setIsPostUpdate(true)
    }
    setContent(matchingPost?.Content ?? "")
  }


  const canSubmit = selectedBookId && content.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-2 right-2 sm:bottom-8 sm:right-8 rounded-full size-20 shadow-xl z-50 hover:scale-105 transition-transform"
        >
          <MessageSquare className="size-10" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Neuer Beitrag</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto flex-1 p-4">
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
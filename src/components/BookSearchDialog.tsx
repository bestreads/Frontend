import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { BookDetailDialog } from "./BookDetailDialog"
import type { Book } from "@/types/book"
import { searchBooks } from "@/api/bookService"

interface BookSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookSearchDialog({ open, onOpenChange }: BookSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookDetailOpen, setBookDetailOpen] = useState(false)
  const [lastSearchQuery, setLastSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"title" | "author">("title")

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Verhindere doppelte Suche für gleichen Query
    if (query === lastSearchQuery) return
    setLastSearchQuery(query)

    setIsLoading(true)
    try {
      const data = await searchBooks({
        q: query,
        author: searchType === "author" || undefined,
      })
      setSearchResults(data || [])
    } catch (error) {
      console.error("Error during book search:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [lastSearchQuery, searchType])

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    }
  }, [searchQuery, performSearch])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Reset beim Schließen
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSearchResults([])
      setLastSearchQuery("")
    }
  }, [open])

  // Handler für Suchtyp-Wechsel: direkt neu suchen
  const handleSearchTypeChange = async (newType: "title" | "author") => {
    setSearchType(newType)
    setLastSearchQuery("")
    if (searchQuery.trim()) {
      setIsLoading(true)
      try {
        const data = await searchBooks({
          q: searchQuery,
          author: newType === "author" || undefined,
        })
        setSearchResults(data || [])
        setLastSearchQuery(searchQuery)
      } catch (error) {
        console.error("Error during book search:", error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBookClick = (result: Book) => {
    const book: Book = {
      ID: result.ID,
      ISBN: result.ISBN,
      Title: result.Title,
      Author: result.Author,
      CoverURL: result.CoverURL,
      RatingAvg: result.RatingAvg,
      Description: result.Description,
      ReleaseDate: result.ReleaseDate,
      Genre: result.Genre,
    }
    setSelectedBook(book)
    setBookDetailOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Bücher suchen
            </DialogTitle>
            <DialogDescription className="sr-only">
              Suche nach Büchern nach Titel, Autor oder Genre
            </DialogDescription>
          </DialogHeader>

          {/* Suchfeld mit Dropdown */}
          <div className="flex gap-2">
            <div className="relative flex-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchType === "title" ? "Nach Titel suchen..." : "Nach Autor suchen..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 h-12 text-base border-2 focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>

            <Select value={searchType} onValueChange={handleSearchTypeChange}>
              <SelectTrigger className="w-[130px] h-12 border-2 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Titel</SelectItem>
                <SelectItem value="author">Autor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ergebnisanzahl */}
          {searchResults.length > 0 && (
            <div className="flex items-center justify-end">
              <span className="text-sm text-muted-foreground">
                {searchResults.length} {searchResults.length === 1 ? "Ergebnis" : "Ergebnisse"}
              </span>
            </div>
          )}

          {/* Trennlinie */}
          <hr className="border-border" />

          {/* Suchergebnisse */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.ISBN}-${index}`}
                    onClick={() => handleBookClick(result)}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left"
                  >
                    {/* Buchcover */}
                    <div className="w-16 h-24 shrink-0 rounded overflow-hidden bg-muted">
                      {result.CoverURL ? (
                        <img
                          src={result.CoverURL}
                          alt={result.Title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-1">
                          Kein Cover
                        </div>
                      )}
                    </div>

                    {/* Buchinfos */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {result.Title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {result.Author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.ReleaseDate}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : lastSearchQuery.trim() && !isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Bücher gefunden für "{lastSearchQuery}"
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Gib einen Suchbegriff ein und drücke Enter, um Bücher zu finden
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* BookDetailDialog */}
      <BookDetailDialog
        book={selectedBook}
        open={bookDetailOpen}
        onOpenChange={setBookDetailOpen}
      />
    </>
  )
}

export default BookSearchDialog
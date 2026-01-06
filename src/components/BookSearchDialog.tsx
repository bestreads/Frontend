import { useState, useEffect, useCallback, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { BookDetailDialog } from "./BookDetailDialog"
import type { Book } from "@/types/book"

interface SearchResult {
  ID: number
  ISBN: string
  Title: string
  Author: string
  CoverURL: string
  RatingAvg: number
  Description: string
  ReleaseDate: number
  Genre?: string
}

interface BookSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GENRES = [
  "Alle",
  "Fantasy",
  "Science Fiction",
  "Dystopie",
  "Romance",
  "Drama",
  "Klassiker",
  "Coming-of-Age",
  "Philosophie",
] as const

type Genre = (typeof GENRES)[number]

export function BookSearchDialog({ open, onOpenChange }: BookSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookDetailOpen, setBookDetailOpen] = useState(false)
  const [showGenreFilter, setShowGenreFilter] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<Genre>("Alle")
  const [lastSearchQuery, setLastSearchQuery] = useState("")
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchBooks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Verhindere doppelte Suche für gleichen Query
    if (query === lastSearchQuery) return
    setLastSearchQuery(query)

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/v1/books/search?q=${encodeURIComponent(query)}`
      )
      if (response.ok) {
        const data: SearchResult[] = await response.json()
        setSearchResults(data || [])
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Fehler bei der Buchsuche:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [lastSearchQuery])

  // Sofortige Suche (bei Enter oder Blur)
  const handleImmediateSearch = useCallback(() => {
    // Debounce-Timer abbrechen, da wir sofort suchen
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    if (searchQuery.trim()) {
      searchBooks(searchQuery)
    }
  }, [searchQuery, searchBooks])

  // Debounced Suche bei Eingabe
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    debounceTimerRef.current = setTimeout(() => {
      searchBooks(searchQuery)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery, searchBooks])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleImmediateSearch()
    }
  }

  // Reset beim Schließen
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSearchResults([])
      setShowGenreFilter(false)
      setSelectedGenre("Alle")
      setLastSearchQuery("")
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [open])

  // Gefilterte Ergebnisse nach Genre
  const filteredResults = selectedGenre === "Alle"
    ? searchResults
    : searchResults.filter(result => 
        result.Genre?.toLowerCase() === selectedGenre.toLowerCase()
      )

  const handleBookClick = (result: SearchResult) => {
    const book: Book = {
      ISBN: result.ISBN,
      title: result.Title,
      author: result.Author,
      coverurl: result.CoverURL,
      ratingavg: result.RatingAvg,
      description: result.Description,
      releasedate: result.ReleaseDate,
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

          {/* Suchfeld */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Nach Titel, Autor oder Genre suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleImmediateSearch}
              className="pl-10 h-12 text-base border-2 focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </div>

          {/* Genre Filter Toggle und Ergebnisanzahl */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowGenreFilter(!showGenreFilter)}
              className="text-primary hover:underline text-sm font-medium text-left w-fit"
            >
              {showGenreFilter ? "Genre-Filter ausblenden" : "Nach Genre filtern"}
            </button>
            {filteredResults.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {filteredResults.length} {filteredResults.length === 1 ? "Ergebnis" : "Ergebnisse"}
              </span>
            )}
          </div>

          {/* Genre Filter Buttons */}
          {showGenreFilter && (
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {genre}
                </button>
              ))}
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
            ) : filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResults.map((result, index) => (
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
                      {result.Genre && (
                        <p className="text-sm text-primary font-medium">
                          {result.Genre}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : lastSearchQuery.trim() && !isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Bücher gefunden für "{lastSearchQuery}"
                {selectedGenre !== "Alle" && ` im Genre "${selectedGenre}"`}
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

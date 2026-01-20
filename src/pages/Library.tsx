
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookCard } from "@/components/BookCard"
import type { BookWithUserData, BookState } from "@/types/book"
import { apiToBookState, bookStateToApi } from "@/types/book"
import { getLibrary, removeBookFromLibrary, updateBookState, updateRating } from "@/api/libraryService"

function Library() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [filterTab, setFilterTab] = useState("all")
  const [books, setBooks] = useState<BookWithUserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Bücher beim Laden der Komponente abrufen
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const libraryBooks = await getLibrary()
        
        // LibraryBook zu BookWithUserData transformieren
        const transformedBooks: BookWithUserData[] = libraryBooks.map((lb) => ({
          ...lb.Book,
          userBook: {
            state: apiToBookState[lb.State] || "want-to-read",
            rating: lb.Rating,
          },
        }))
        
        setBooks(transformedBooks)
      } catch (err) {
        console.error("Fehler beim Laden der Bibliothek:", err)
        setError("Fehler beim Laden der Bibliothek")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLibrary()
  }, [])

  // API-Funktionen
  const handleDeleteBook = async (id: number) => {
    try {
      await removeBookFromLibrary(id)
      setBooks(books.filter((book) => book.ID !== id))
    } catch (err) {
      console.error("Fehler beim Löschen:", err)
    }
  }

  const handleUpdateStatus = async (id: number, status: BookState) => {
    try {
      await updateBookState(id, bookStateToApi[status])
      setBooks(
        books.map((book) =>
          book.ID === id
            ? { ...book, userBook: { ...book.userBook, state: status } }
            : book
        )
      )
    } catch (err) {
      console.error("Fehler beim Status-Update:", err)
    }
  }

  const handleRateBook = async (id: number, rating: number) => {
    try {
      await updateRating(id, rating)
      setBooks(
        books.map((book) =>
          book.ID === id
            ? { ...book, userBook: { ...book.userBook, rating } }
            : book
        )
      )
    } catch (err) {
      console.error("Fehler beim Bewerten:", err)
    }
  }

  // Filtern und Sortieren der Bücher
  const filteredAndSortedBooks = books
    .filter((book) => {
      // Filter nach Status-Tab
      if (filterTab !== "all" && book.userBook.state !== filterTab) {
        return false
      }
      
      // Filter nach Suchbegriff
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          book.Title.toLowerCase().includes(query) ||
          book.Author.toLowerCase().includes(query)
        )
      }
      
      return true
    })
    .sort((a, b) => {
      // Sortierung
      switch (sortBy) {
        case "title":
          return a.Title.localeCompare(b.Title)
        case "author":
          return a.Author.localeCompare(b.Author)
        case "rating":
          return b.RatingAvg - a.RatingAvg
        default:
          return 0
      }
    })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">Bibliothek</h1>

      {/* Ladezustand */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <p className="text-muted-foreground">Laden...</p>
        </div>
      )}

      {/* Fehlermeldung */}
      {error && (
        <div className="flex justify-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Suchleiste mit Filter-Dropdown */}
      {!isLoading && !error && (
        <>
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Nach Titel oder Autor suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Sortieren nach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Nach Titel sortieren</SelectItem>
              <SelectItem value="author">Nach Autor sortieren</SelectItem>
              <SelectItem value="rating">Nach Bewertung sortieren</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter-Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={filterTab === "all" ? "default" : "outline"}
            onClick={() => setFilterTab("all")}
          >
            Alle
          </Button>
          <Button
            variant={filterTab === "read" ? "default" : "outline"}
            onClick={() => setFilterTab("read")}
          >
            Gelesen
          </Button>
          <Button
            variant={filterTab === "reading" ? "default" : "outline"}
            onClick={() => setFilterTab("reading")}
          >
            Lese ich gerade
          </Button>
          <Button
            variant={filterTab === "want-to-read" ? "default" : "outline"}
            onClick={() => setFilterTab("want-to-read")}
          >
            Möchte ich lesen
          </Button>
        </div>

        {/* Bücherliste */}
        <div className="space-y-4">
          {filteredAndSortedBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-muted-foreground mb-2">
                <svg
                  className="mx-auto h-16 w-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground text-lg">Keine Bücher gefunden</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAndSortedBooks.map((book) => (
                <BookCard
                  key={book.ID}
                  book={book}
                  onDelete={handleDeleteBook}
                  onUpdateStatus={handleUpdateStatus}
                  onRate={handleRateBook}
                />
              ))}
            </div>
          )}
        </div>
        </>
      )}
    </div>
  )
}

export default Library
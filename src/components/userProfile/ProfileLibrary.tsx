import { useState, useEffect } from "react"
import { Search, BookX } from "lucide-react"
import { BookCard } from "../BookCard"
import type { BookWithUserData } from "@/types/book"
import { apiToBookState } from "@/types/book"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getLibrary } from "@/api/libraryService"


interface ProfileLibraryProps {
  userId: string
}

function ProfileLibrary({ userId }: ProfileLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [books, setBooks] = useState<BookWithUserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLibrary = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const libraryBooks = await getLibrary(Number(userId))
        
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
        setError("Bibliothek konnte nicht geladen werden")
      } finally {
        setIsLoading(false)
      }
    }
    fetchLibrary()
  }, [userId])

  // Filtern und Sortieren der Bücher
  const filteredAndSortedBooks = books
    .filter((book) => {
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
    <>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <p className="text-muted-foreground">Laden...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          {/* Suchleiste mit Sortier-Dropdown */}
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

          {/* Bücherliste */}
          <div className="space-y-4">
            {filteredAndSortedBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-muted-foreground mb-2 ">
                  <BookX className="w-20 h-20" />
                </div>
                <p className="text-muted-foreground text-lg">Keine Bücher gefunden</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAndSortedBooks.map((book) => (
                  <BookCard key={book.ID} book={book} readOnly={true} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ProfileLibrary
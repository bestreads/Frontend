
import { useState } from "react"
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
import { removeBookFromLibrary } from "@/api/libraryService"

function Library() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [filterTab, setFilterTab] = useState("all")

  // Beispieldaten
  const [books, setBooks] = useState<BookWithUserData[]>([
    {
      ID: 1,
      ISBN: "978-0441013593",
      Title: "Dune",
      Author: "Frank Herbert",
      CoverURL: "https://m.media-amazon.com/images/I/71oSHCZABCL._SY466_.jpg",
      RatingAvg: 4.2,
      Description: "Arrakis ist eine tödliche Wüstenwelt und der einzige Fundort der Droge 'Spice', die das Reisen zwischen den Sternen ermöglicht. Als seine Familie verraten wird, beginnt für Paul Atreides ein Kampf, der das Schicksal des gesamten Universums verändern wird.",
      ReleaseDate: 1965,
      Genre: "Science Fiction",
      userBook: {
        state: "read",
        rating: 4,
      },
    },
    {
      ID: 2,
      ISBN: "978-0441013594",
      Title: "Harry Potter und der Stein der Weisen",
      Author: "J.K. Rowling",
      CoverURL: "https://images.thalia.media/-/BF2000-2000/94a2302133384639b32d0f09e2e4c0d4/harry-potter-1-and-the-philosopher-s-stone-gebundene-ausgabe-j-k-rowling-englisch.jpeg",
      RatingAvg: 4.9,
      Description: "Harry Potter und der Stein der Weisen (Band 1) handelt von dem Waisenjungen Harry, der an seinem elften Geburtstag erfährt, dass er ein Zauberer ist und nach Hogwarts geht, wo er Freunde findet und gegen den bösen Lord Voldemort kämpft, der hinter dem mächtigen Stein der Weisen her ist, um seine Macht zurückzuerlangen.",
      ReleaseDate: 1997,
      Genre: "Roman",
      userBook: {
        state: "reading",
        rating: 5,
      },
    },
    {
      ID: 3,
      ISBN: "978-3608938289",
      Title: "Der Herr der Ringe: Die Gefährten",
      Author: "J.R.R. Tolkien",
      CoverURL: "https://images-eu.ssl-images-amazon.com/images/I/61rTYQFaxPL._AC_UL600_SR600,600_.jpg",
      RatingAvg: 4.8,
      Description: "Der junge Hobbit Frodo Beutlin erbt einen magischen Ring, der vom dunklen Herrscher Sauron geschmiedet wurde. Zusammen mit einer Gemeinschaft aus Gefährten bricht er auf, um den Ring zu zerstören.",
      ReleaseDate: 1954,
      Genre: "Fantasy",
      userBook: {
        state: "read",
        rating: 5,
      },
    },
    {
      ID: 4,
      ISBN: "978-0451524935",
      Title: "1984",
      Author: "George Orwell",
      CoverURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkdK_06hkWyzxuYeEahTKsIebflxohnhRBn6kUaOXjHRvrajtnlJi-ABVug69qtWBn-tpwZKLL2pFZKydGQbpXN3KQht7wyz2sYDNkpg&s=10",
      RatingAvg: 4.6,
      Description: "In einem totalitären Überwachungsstaat arbeitet Winston Smith im Ministerium für Wahrheit, wo er Geschichte umschreibt. Doch er beginnt, das System und den allgegenwärtigen 'Großen Bruder' zu hinterfragen.",
      ReleaseDate: 1949,
      Genre: "Dystopie",
      userBook: {
        state: "want-to-read",
        rating: 0,
      },
    },
    {
      ID: 5,
      ISBN: "978-0345391803",
      Title: "Per Anhalter durch die Galaxis",
      Author: "Douglas Adams",
      CoverURL: "https://m.media-amazon.com/images/I/81XSN3hA5gL._AC_UF1000,1000_QL80_.jpg",
      RatingAvg: 4.4,
      Description: "Sekunden bevor die Erde gesprengt wird, um einer Hyperraum-Umgehungsstraße Platz zu machen, wird Arthur Dent von seinem Freund Ford Prefect gerettet. Gemeinsam reisen sie durch das Universum.",
      ReleaseDate: 1979,
      Genre: "Science Fiction",
      userBook: {
        state: "read",
        rating: 4,
      },
    },
  ])

  // API-Funktionen
  const handleDeleteBook = (id: number) => {
    console.log("Lösche Buch:", id)
    
    removeBookFromLibrary(id)

    setBooks(books.filter((book) => book.ID !== id))
  }

  const handleUpdateStatus = (id: number, status: BookState) => {
    console.log("Update Status:", id, status)
    // Später: API-Call zum Backend
    setBooks(
      books.map((book) =>
        book.ID === id
          ? { ...book, userBook: { ...book.userBook, state: status } }
          : book
      )
    )
  }

  const handleRateBook = (id: number, rating: number) => {
    console.log("Bewerte Buch:", id, rating)
    // Später: API-Call zum Backend
    setBooks(
      books.map((book) =>
        book.ID === id
          ? { ...book, userBook: { ...book.userBook, rating } }
          : book
      )
    )
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

      {/* Suchleiste mit Filter-Dropdown */}
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
    </div>
  )
}

export default Library
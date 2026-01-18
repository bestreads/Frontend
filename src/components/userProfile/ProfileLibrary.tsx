import { useState } from "react"
import { Search } from "lucide-react"
import { BookCard } from "../BookCard"
import type { BookWithUserData } from "@/types/book"
import { BookX } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function ProfileLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("title")

  // TODO: backend Buchdaten abrufen
  const [books] = useState<BookWithUserData[]>([
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
              <BookCard key={book.ISBN} book={book} readOnly={true} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ProfileLibrary
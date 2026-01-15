import type { Post } from "@/types/post"
import PostCard from "../PostCard"
import { MessageSquareOff, Search } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function ProfileFeed({userId}:{userId: string}) {
  const sortOptions = ["date", "title", "likes", "comments"]
  const [sortBy, setSortBy] = useState(sortOptions[0])
  const [searchQuery, setSearchQuery] = useState("")

  // TODO: Backend-Aufruf für Posts
  const posts: Post[] = [
    {
      id: "post1",
      author: {
        userId: userId,
        username: "test123",
        profilePictureURL: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Ffunny-face-pictures-rgcsg7f53oic3c5t.jpg&f=1&nofb=1&ipt=fa2b5b9d406c7b592380825b46dd476468ee047dcb676c92e47a14d479a29995",
      },
      book: {
        ISBN: "978-0441013593",
        title: "Dune",
        author: "Frank Herbert",
        coverurl: "https://m.media-amazon.com/images/I/71oSHCZABCL._SY466_.jpg",
        ratingavg: 4.2,
        description: "Arrakis ist eine tödliche Wüstenwelt und der einzige Fundort der Droge 'Spice', die das Reisen zwischen den Sternen ermöglicht. Als seine Familie verraten wird, beginnt für Paul Atreides ein Kampf, der das Schicksal des gesamten Universums verändern wird.",
        releasedate: 1965,
        genre: "Science Fiction",
        userBook: {
          state: "read",
          rating: 4,
        },
      },
      content: "Super duper tolles Buch!",
      createdAt: "2025-12-20T14:30:00Z",
      likes: 42,
      commentCount: 5,
    },
    {
      id: "post2",
      author: {
        userId: userId,
        username: "test123",
        profilePictureURL: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Ffunny-face-pictures-rgcsg7f53oic3c5t.jpg&f=1&nofb=1&ipt=fa2b5b9d406c7b592380825b46dd476468ee047dcb676c92e47a14d479a29995",
      },
      book: {
        ISBN: "978-0441013594",
        title: "Harry Potter und der Stein der Weisen",
        author: "J.K. Rowling",
        coverurl: "https://images.thalia.media/-/BF2000-2000/94a2302133384639b32d0f09e2e4c0d4/harry-potter-1-and-the-philosopher-s-stone-gebundene-ausgabe-j-k-rowling-englisch.jpeg",
        ratingavg: 4.9,
        description: "Harry Potter und der Stein der Weisen (Band 1) handelt von dem Waisenjungen Harry, der an seinem elften Geburtstag erfährt, dass er ein Zauberer ist und nach Hogwarts geht, wo er Freunde findet und gegen den bösen Lord Voldemort kämpft, der hinter dem mächtigen Stein der Weisen her ist, um seine Macht zurückzuerlangen.",
        releasedate: 1997,
        genre: "Roman",
        userBook: {
          state: "reading",
          rating: 5,
        },
      },
      content: "Gerade wieder angefangen zu lesen. Die Nostalgie ist real! 🪄✨",
      createdAt: "2025-12-18T10:15:00Z",
      likes: 128,
      commentCount: 12,
    },
    {
      id: "post3",
      author: {
        userId: userId,
        username: "test123",
        profilePictureURL: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Ffunny-face-pictures-rgcsg7f53oic3c5t.jpg&f=1&nofb=1&ipt=fa2b5b9d406c7b592380825b46dd476468ee047dcb676c92e47a14d479a29995",
      },
      book: {
        ISBN: "978-3608938289",
        title: "Der Herr der Ringe: Die Gefährten",
        author: "J.R.R. Tolkien",
        coverurl: "https://images-eu.ssl-images-amazon.com/images/I/61rTYQFaxPL._AC_UL600_SR600,600_.jpg",
        ratingavg: 4.8,
        description: "Der junge Hobbit Frodo Beutlin erbt einen magischen Ring, der vom dunklen Herrscher Sauron geschmiedet wurde. Zusammen mit einer Gemeinschaft aus Gefährten bricht er auf, um den Ring zu zerstören.",
        releasedate: 1954,
        genre: "Fantasy",
        userBook: {
          state: "read",
          rating: 4.7,
        },
      },
      content: "Ein absolutes Meisterwerk! Die Welt, die Tolkien erschaffen hat, ist einfach unglaublich detailliert. Kann es jedem nur empfehlen!",
      createdAt: "2025-12-15T18:45:00Z",
      likes: 256,
      commentCount: undefined,
    }
  ]

  const filteredAndSortedPosts = posts
    .filter((post) => {
      // Filter nach Suchbegriff
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          post.book.title.toLowerCase().includes(query) ||
          post.book.author.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sortierung
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "title":
          return a.book.title.localeCompare(b.book.title)
        case "likes":
          {
            const aLikes = a.likes ?? 0
            const bLikes = b.likes ?? 0
            return bLikes - aLikes
          }
        case "comments": {
          const aComments = a.commentCount ?? 0
          const bComments = b.commentCount ?? 0
          return bComments - aComments
        }
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
            placeholder="Nach Buchtitel oder Autor suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy} defaultValue={sortOptions[0]}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Sortieren nach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Nach Datum sortieren</SelectItem>
            <SelectItem value="title">Nach Titel sortieren</SelectItem>
            <SelectItem value="likes">Nach Likes sortieren</SelectItem>
            <SelectItem value="comments">Nach Kommentaren sortieren</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Beiträge */}
      <div className="space-y-4">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-muted-foreground mb-2 ">
              <MessageSquareOff className="w-20 h-20" />
            </div>
            <p className="text-muted-foreground text-lg">Keine Beiträge gefunden</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedPosts.map((post) => (
              <PostCard postData={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ProfileFeed

import type { Post } from "@/types/post"
import PostCard from "@/components/PostCard"
import { MessageSquareOff } from "lucide-react"

const Feed = () => {
  // TODO: Backend-Aufruf für Feed-Posts
  // evtl. Limit + Aktualisieren button
  const posts: Post[] = [
    {
      id: "post1",
      author: {
        userId: "user456",
        username: "LeseRatte42",
        profilePictureURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      },
      book: {
        ISBN: "978-0441013593",
        title: "Dune",
        author: "Frank Herbert",
        coverurl: "https://m.media-amazon.com/images/I/71oSHCZABCL._SY466_.jpg",
        ratingavg: 4.2,
        description: "Arrakis ist eine tödliche Wüstenwelt und der einzige Fundort der Droge 'Spice', die das Reisen zwischen den Sternen ermöglicht.",
        releasedate: 1965,
        genre: "Science Fiction",
        userBook: {
          state: "read",
          rating: 5,
        },
      },
      content: "Endlich geschafft! Was für ein episches Meisterwerk. Die Welt von Arrakis hat mich komplett in den Bann gezogen. 🏜️",
      createdAt: "2026-01-08T18:30:00Z",
      likes: 89,
      commentCount: 12,
    },
    {
      id: "post2",
      author: {
        userId: "user789",
        username: "BookwormBerlin",
        profilePictureURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      },
      book: {
        ISBN: "978-0441013594",
        title: "Harry Potter und der Stein der Weisen",
        author: "J.K. Rowling",
        coverurl: "https://images.thalia.media/-/BF2000-2000/94a2302133384639b32d0f09e2e4c0d4/harry-potter-1-and-the-philosopher-s-stone-gebundene-ausgabe-j-k-rowling-englisch.jpeg",
        ratingavg: 4.9,
        description: "Harry Potter erfährt an seinem elften Geburtstag, dass er ein Zauberer ist.",
        releasedate: 1997,
        genre: "Fantasy",
        userBook: {
          state: "reading",
          rating: 5,
        },
      },
      content: "Lese es zum dritten Mal und entdecke immer noch neue Details! Die Magie lässt einfach nicht nach ✨",
      createdAt: "2026-01-08T14:15:00Z",
      likes: 234,
      commentCount: 28,
    },
    {
      id: "post3",
      author: {
        userId: "user101",
        username: "SciFiFan2000",
        profilePictureURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      },
      book: {
        ISBN: "978-0451524935",
        title: "1984",
        author: "George Orwell",
        coverurl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkdK_06hkWyzxuYeEahTKsIebflxohnhRBn6kUaOXjHRvrajtnlJi-ABVug69qtWBn-tpwZKLL2pFZKydGQbpXN3KQht7wyz2sYDNkpg&s=10",
        ratingavg: 4.6,
        description: "In einem totalitären Überwachungsstaat arbeitet Winston Smith im Ministerium für Wahrheit.",
        releasedate: 1949,
        genre: "Dystopie",
        userBook: {
          state: "want-to-read",
          rating: 0,
        },
      },
      content: "Wurde mir von einem Freund empfohlen. Bin sehr gespannt, ob es wirklich so relevant für heute ist wie alle sagen! 📚",
      createdAt: "2026-01-07T20:00:00Z",
      likes: 45,
      commentCount: 8,
    },
    {
      id: "post4",
      author: {
        userId: "user202",
        username: "FantasyQueen",
        profilePictureURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      },
      book: {
        ISBN: "978-3608938289",
        title: "Der Herr der Ringe: Die Gefährten",
        author: "J.R.R. Tolkien",
        coverurl: "https://images-eu.ssl-images-amazon.com/images/I/61rTYQFaxPL._AC_UL600_SR600,600_.jpg",
        ratingavg: 4.8,
        description: "Der junge Hobbit Frodo Beutlin erbt einen magischen Ring.",
        releasedate: 1954,
        genre: "Fantasy",
        userBook: {
          state: "read",
          rating: 5,
        },
      },
      content: "Nach den Filmen endlich auch das Buch gelesen. Die Details sind unglaublich! Tolkien ist ein Genie. 🧙‍♂️💍",
      createdAt: "2026-01-06T12:30:00Z",
      likes: 312,
      commentCount: 41,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Beiträge</h1>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-muted-foreground mb-2">
              <MessageSquareOff className="w-20 h-20" />
            </div>
            <p className="text-muted-foreground text-lg">Keine Beiträge gefunden</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard postData={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed

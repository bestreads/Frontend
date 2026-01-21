import type { Post } from "@/types/post"
import PostCard from "../PostCard"
import { MessageSquareOff, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getPosts, type Post as ApiPost } from "@/api/postService"
import { Spinner } from "@/components/ui/spinner"
import { apiToBookState } from "@/types/book"

function ProfileFeed({ userId }: { userId: string }) {
  const sortOptions = ["date", "title", "likes", "comments"]
  const [sortBy, setSortBy] = useState(sortOptions[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const data = await getPosts({ userId: Number(userId) })

        // Backend-Response zu Frontend-Post-Type mappen
        const mappedPosts: Post[] = data.map((apiPost: ApiPost) => ({
          id: `post-${apiPost.Uid}-${apiPost.Book.ID}`,
          author: {
            userId: apiPost.Uid.toString(),
            username: apiPost.Username,
            profilePictureURL: apiPost.ProfilePicture || undefined,
          },
          book: {
            ...apiPost.Book,
            userBook: {
              state: apiToBookState[apiPost.State] || "want-to-read",
              rating: apiPost.Rating,
            },
          },
          content: apiPost.Content,
          createdAt: apiPost.CreatedAt,
          likes: 0,
          commentCount: 0,
        }))

        setPosts(mappedPosts)
      } catch {
        setError("Fehler beim Laden der Beiträge")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [userId])

  const filteredAndSortedPosts = posts
    .filter((post) => {
      // Filter nach Suchbegriff
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          post.book.Title.toLowerCase().includes(query) ||
          post.book.Author.toLowerCase().includes(query)
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
          return a.book.Title.localeCompare(b.book.Title)
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
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-destructive text-lg">{error}</p>
        </div>
      ) : (
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
                  <PostCard postData={post} key={`${post.id}-${post.createdAt}`}/>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ProfileFeed
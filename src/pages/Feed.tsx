
import type { Post } from "@/types/post"
import PostCard from "@/components/PostCard"
import { MessageSquareOff } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { getPosts, type Post as ApiPost } from "@/api/postService"
import { Spinner } from "@/components/ui/spinner"
import { apiToBookState } from "@/types/book"
import { Button } from "@/components/ui/button"
import { CreatePostDialog } from "@/components/CreatePostDialog"

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPosts({ limit })

      // Backend-Response zu Frontend-Post-Type mappen
      const mappedPosts: Post[] = data.map((apiPost: ApiPost) => ({
        id: `post-${apiPost.Uid}-${apiPost.Book.ID}-${apiPost.CreatedAt}`,  
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
        createdAt: apiPost.CreatedAt
      }))

      setPosts(mappedPosts)
      setHasMore(data.length >= limit)
    } catch (err) {
      setError("Fehler beim Laden der Beiträge")
      console.error("Fehler beim Laden der Beiträge:", err)  
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const loadMore = async () => {
    setLoadingMore(true)
    setLimit(prev => prev + 10)
    setLoadingMore(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Beiträge</h1>
        <div className="flex justify-center items-center py-16">
          <Spinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Beiträge</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-destructive text-lg">{error}</p>
        </div>
      </div>
    )
  }

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
              <PostCard postData={post} key={`${post.id}-${post.createdAt}`} />
            ))}
          </div>
        )}

        {/* Mehr laden Button */}
        {posts.length > 0 && hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              disabled={loadingMore}
              variant="outline"
              size="lg"
            >
              {loadingMore ? <Spinner /> : "Mehr Beiträge laden"}
            </Button>
          </div>
        )}
      </div>

      {/* Neuer Beitrag Button */}
      <CreatePostDialog onPostCreated={fetchPosts} />
    </div>
  )
}

export default Feed

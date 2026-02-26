import type { Post } from "@/types/post"
import PostCard from "../PostCard"
import { MessageSquareOff } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { getPosts, type Post as ApiPost } from "@/api/postService"
import { Spinner } from "@/components/ui/spinner"
import { apiToBookState } from "@/types/book"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePostDialog } from "@/contexts/PostDialogContext"

const POSTS_PER_PAGE = 25

function ProfileFeed({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const { openDialog, registerRefreshCallback, unregisterRefreshCallback } = usePostDialog()

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * POSTS_PER_PAGE
      const data = await getPosts({ userId: Number(userId), offset })

      // Backend-Response zu Frontend-Post-Type mappen
      const mappedPosts: Post[] = data.map((apiPost: ApiPost) => ({
        id: `post-${apiPost.Uid}-${apiPost.Book.ID}-${apiPost.UpdatedAt}`,
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
        updatedAt: apiPost.UpdatedAt,
      }))

      setPosts(mappedPosts)
      // Wenn weniger als POSTS_PER_PAGE zurückkommen, sind wir auf der letzten Seite
      if (data.length < POSTS_PER_PAGE) {
        setTotalPages(currentPage)
      } else {
        // Ansonsten gibt es mindestens eine weitere Seite
        setTotalPages((prev) => Math.max(prev, currentPage + 1))
      }
    } catch (error) {
      console.error("Error fetching posts for ProfileFeed:", error)
      setError("Fehler beim Laden der Beiträge")
    } finally {
      setLoading(false)
    }
  }, [userId, currentPage])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Registriere fetchPosts als Refresh-Callback für den PostDialog
  useEffect(() => {
    registerRefreshCallback(fetchPosts)
    return () => unregisterRefreshCallback(fetchPosts)
  }, [fetchPosts, registerRefreshCallback, unregisterRefreshCallback])

  const handleEditPost = (post: Post) => {
    openDialog(post.book.ID)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
      )
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            isActive={page === currentPage}
            onClick={() => handlePageChange(page)}
            className="cursor-pointer"
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

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
          {/* Beiträge */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-muted-foreground mb-2 ">
                  <MessageSquareOff className="w-20 h-20" />
                </div>
                <p className="text-muted-foreground text-lg">Keine Beiträge gefunden</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <PostCard
                      postData={post}
                      key={`${post.id}-${post.updatedAt}`}
                      onRatingChange={fetchPosts}
                      onEditPost={handleEditPost}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {posts.length > 0 && totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ProfileFeed
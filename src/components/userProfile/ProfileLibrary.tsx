import { useState, useEffect } from "react"
import { BookX } from "lucide-react"
import { BookCard } from "../BookCard"
import type { BookWithUserData } from "@/types/book"
import { apiToBookState } from "@/types/book"
import { getLibrary } from "@/api/libraryService"
import { Spinner } from "@/components/ui/spinner"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const BOOKS_PER_PAGE = 25

interface ProfileLibraryProps {
  userId: string
}

function ProfileLibrary({ userId }: ProfileLibraryProps) {
  const [books, setBooks] = useState<BookWithUserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchLibrary = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const offset = (currentPage - 1) * BOOKS_PER_PAGE
        const libraryBooks = await getLibrary(Number(userId), offset)

        // LibraryBook zu BookWithUserData transformieren
        const transformedBooks: BookWithUserData[] = libraryBooks.map((lb) => ({
          ...lb.Book,
          userBook: {
            state: apiToBookState[lb.State] || "want-to-read",
            rating: lb.Rating,
          },
        }))

        setBooks(transformedBooks)
        // Wenn weniger als BOOKS_PER_PAGE zurückkommen, sind wir auf der letzten Seite
        if (libraryBooks.length < BOOKS_PER_PAGE) {
          setTotalPages(currentPage)
        } else {
          // Ansonsten gibt es mindestens eine weitere Seite
          setTotalPages((prev) => Math.max(prev, currentPage + 1))
        }
      } catch (err) {
        console.error("Fehler beim Laden der Bibliothek:", err)
        setError("Bibliothek konnte nicht geladen werden")
      } finally {
        setIsLoading(false)
      }
    }
    fetchLibrary()
  }, [userId, currentPage])

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
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex justify-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          {/* Bücherliste */}
          <div className="space-y-4">
            {books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-muted-foreground mb-2 ">
                  <BookX className="w-20 h-20" />
                </div>
                <p className="text-muted-foreground text-lg">Keine Bücher gefunden</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {books.map((book) => (
                    <BookCard key={book.ID} book={book} readOnly={true} />
                  ))}
                </div>

                {/* Pagination */}
                {books.length > 0 && totalPages > 1 && (
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

export default ProfileLibrary
import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from "react"
import type { Book, BookState, BookWithUserData } from "@/types/book"
import { apiToBookState } from "@/types/book"
import { getLibrary } from "@/api/libraryService"

interface LibraryContextType {
  libraryBooks: BookWithUserData[]
  isLoading: boolean
  error: string | null
  refreshLibrary: () => Promise<void>
  addBookToLocalLibrary: (book: Book, status: BookState) => void
  updateBookInLocalLibrary: (bookId: number, status: BookState) => void
  removeBookFromLocalLibrary: (bookId: number) => void
  updateBookRating: (bookId: number, rating: number) => void
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [libraryBooks, setLibraryBooks] = useState<BookWithUserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshLibrary = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const libraryData = await getLibrary()
      
      const transformedBooks: BookWithUserData[] = libraryData.map((lb) => ({
        ...lb.Book,
        userBook: {
          state: apiToBookState[lb.State] || "want-to-read",
          rating: lb.Rating,
        },
      }))
      
      setLibraryBooks(transformedBooks)
    } catch (err) {
      console.error("Fehler beim Laden der Bibliothek:", err)
      setError("Fehler beim Laden der Bibliothek")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addBookToLocalLibrary = useCallback((book: Book, status: BookState) => {
    setLibraryBooks((prev) => {
      // Prüfe ob das Buch bereits vorhanden ist
      if (prev.some((b) => b.ID === book.ID)) {
        // Wenn ja, aktualisiere den Status
        return prev.map((b) =>
          b.ID === book.ID
            ? { ...b, userBook: { ...b.userBook, state: status } }
            : b
        )
      }
      // Sonst füge es hinzu
      return [...prev, { ...book, userBook: { state: status, rating: 0 } }]
    })
  }, [])

  const updateBookInLocalLibrary = useCallback((bookId: number, status: BookState) => {
    setLibraryBooks((prev) =>
      prev.map((book) =>
        book.ID === bookId
          ? { ...book, userBook: { ...book.userBook, state: status } }
          : book
      )
    )
  }, [])

  const removeBookFromLocalLibrary = useCallback((bookId: number) => {
    setLibraryBooks((prev) => prev.filter((book) => book.ID !== bookId))
  }, [])

  const updateBookRating = useCallback((bookId: number, rating: number) => {
    setLibraryBooks((prev) =>
      prev.map((book) =>
        book.ID === bookId
          ? { ...book, userBook: { ...book.userBook, rating } }
          : book
      )
    )
  }, [])

  return (
    <LibraryContext.Provider
      value={{
        libraryBooks,
        isLoading,
        error,
        refreshLibrary,
        addBookToLocalLibrary,
        updateBookInLocalLibrary,
        removeBookFromLocalLibrary,
        updateBookRating,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider')
  }
  return context
}

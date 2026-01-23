import apiClient from "./client"
import type { Book } from "../types/book"

export interface SearchBooksParams {
  q: string
  author?: boolean
  offset?: number
}

/**
 * Holt Buch mit der ID
 * @param bookId - Die ID des zuholenden Buches
 * @returns Die Response-Daten vom Server
 */
export const getBook = async (bookId: number): Promise<Book> => {
  const response = await apiClient.get<Book>(`/book/${bookId}`)
  return response.data
}

/**
 * Sucht nach einem bestimmten Buch oder Author
 * @param params - Der String nach dem gesucht werden soll und das Limit
 * @returns Die Response-Daten vom Server
 */
export const searchBooks = async (params: SearchBooksParams): Promise<Book[]> => {
  const response = await apiClient.get<Book[]>("/book/search", { params })
  return response.data
}

import apiClient from "./client"
import type { Book } from "../types/book"

export interface LibraryBook {
  Uid: number
  Book: Book
  State: number
  Rating: number
}

export interface AddBookData {
  bid: number
  state: number
}

export interface UpdateRating {
  bookId: number
  rating: number // 1-5
}

/**
 * Holt alle Bücher aus der Bibliothek eines Benutzers.
 * @param userId - Die ID des Benutzers (optional, wenn leer wird die eigene Bibliothek geladen)
 * @param limit - Maximale Anzahl der Bücher (optional)
 * @returns Die Bücher in der Bibliothek
 */
export const getLibrary = async (userId?: number, limit?: number): Promise<LibraryBook[]> => {
  const params = new URLSearchParams()
  if (userId) params.append("userId", userId.toString())
  if (limit) params.append("limit", limit.toString())
  
  const queryString = params.toString()
  const response = await apiClient.get<LibraryBook[]>(`/lib${queryString ? `?${queryString}` : ""}`)
  return response.data
}

/**
 * Fügt ein Buch zur Bibliothek eines Benutzers hinzu.
 * @param userId - Die ID des Benutzers
 * @param data - Die Buch-ID und der Status
 * @returns Die Response-Daten vom Server
 */
export const addBookToLibrary = async (data: AddBookData): Promise<LibraryBook> => {
  const response = await apiClient.post<LibraryBook>(`/lib`, data)
  return response.data
}

export const updateRating = async (bookId: number, rating: number) => {
  const response = await apiClient.put(`/lib/review`, { bookId, rating })
  return response.data
}

/**
 * Aktualisiert den Status eines Buches in der Bibliothek
 * @param bookId - Die ID des Buches
 * @param state - Der Status des Buches (0 = want-to-read, 1 = reading, 2 = read)
 */
export const updateBookState = async (bookId: number, state: number): Promise<void> => {
  await apiClient.put(`/lib/${bookId}`, { state })
}

/**
 * Entfernt ein Buch aus der Bibliothek.
 * @param userId - Die ID des Benutzers
 * @param bookId - Die ID des Benutzers
 */
export const removeBookFromLibrary = async (bookId: number): Promise<void> => {
  await apiClient.delete(`/lib/${bookId}`)
}

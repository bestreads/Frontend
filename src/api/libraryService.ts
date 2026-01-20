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
 * @param userId - Die ID des Benutzers
 * @returns Die Bücher in der Bibliothek
 */
export const getLibrary = async (userId: number, limit: number): Promise<LibraryBook[]> => {
  const response = await apiClient.get<LibraryBook[]>(`/lib?limit=${limit}&${userId}`)
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

export const updateRating = async (data: UpdateRating) => {
  const response = await apiClient.put<LibraryBook>(`/lib`, data)
  return response.data
}

/**
 * Aktualisiert den Status eines Buches in der Bibliothek
 * @param userId - Die ID des Benutzers
 * @param bookId - Die ID des Buches
 * @param state - Der Status des Buches
 * @returns Die Response-Daten vom Server
 */
export const updateBookState = async (bookId: number, state: number): Promise<LibraryBook> => {
  const response = await apiClient.put<LibraryBook>(`/lib/${bookId}`, state)
  return response.data
}

/**
 * Entfernt ein Buch aus der Bibliothek.
 * @param userId - Die ID des Benutzers
 * @param bookId - Die ID des Benutzers
 */
export const removeBookFromLibrary = async (bookId: number): Promise<void> => {
  await apiClient.delete(`/lib/${bookId}`)
}

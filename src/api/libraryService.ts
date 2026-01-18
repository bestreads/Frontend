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

/**
 * Holt alle Bücher aus der Bibliothek eines Benutzers.
 * @param userId - Die ID des Benutzers
 * @returns Die Bücher in der Bibliothek
 */
export const getLibrary = async (userId: number): Promise<LibraryBook[]> => {
  const response = await apiClient.get<LibraryBook[]>(`/user/${userId}/lib`)
  return response.data
}

/**
 * Fügt ein Buch zur Bibliothek eines Benutzers hinzu.
 * @param userId - Die ID des Benutzers
 * @param data - Die Buch-ID und der Status
 * @returns Die Response-Daten vom Server
 */
export const addBookToLibrary = async (userId: number, data: AddBookData): Promise<LibraryBook> => {
  const response = await apiClient.post<LibraryBook>(`/user/${userId}/lib`, data)
  return response.data
}

/**
 * Aktualisiert den Status eines Buches in der Bibliothek
 * @param userId - Die ID des Benutzers
 * @param bookId - Die ID des Buches
 * @param state - Der Status des Buches
 * @returns Die Response-Daten vom Server
 */
export const updateBookState = async (userId: number, bookId: number, state: number): Promise<LibraryBook> => {
  const response = await apiClient.put<LibraryBook>(`/user/${userId}/lib/${bookId}`, state)
  return response.data
}

/**
 * Entfernt ein Buch aus der Bibliothek.
 * @param userId - Die ID des Benutzers
 * @param bookId - Die ID des Benutzers
 */
export const removeBookFromLibrary = async (userId: number, bookId: number): Promise<void> => {
  await apiClient.delete(`/user/${userId}/lib/${bookId}`)
}

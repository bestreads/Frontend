import axios from 'axios';
import type { Book } from '../types/book.ts';

const API_BASE_URL = '/api/v1';

interface LibraryBook {
  Uid: number;
  Book: Book;
  State: number;
  Rating: number;
}

/**
 * Holt alle Bücher aus der Bibliothek eines Benutzers.
 * @param userId - Die ID des Benutzers
 * @returns Die Bücher in der Bibliothek
 */
export const getLibrary = async (userId: number): Promise<LibraryBook[]> => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}/lib`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Fügt ein Buch zur Bibliothek eines Benutzers hinzu.
 * @param userId - Die ID des Benutzers
 * @param bookData - Die Buch-ID und der Status
 * @returns Die Response-Daten vom Server
 */
export const addBookToLibrary = async (userId: number, bookId: number, state: number): Promise<LibraryBook> => {
  const response = await axios.post(
    `${API_BASE_URL}/user/${userId}/lib`,
    {
        bid: bookId,
        state: state,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Ändert den Status eines Buches in der Bibliothek.
 * @param userId - Die ID des Benutzers
 * @param bookId - Die ID des Buches
 * @param stateData - Der neue Status
 * @returns Die Response-Daten vom Server
 */
export const updateBookState = async (userId: number, bookId: number, state: number): Promise<LibraryBook> => {
  const response = await axios.put(
    `${API_BASE_URL}/user/${userId}/lib/${bookId}`,
    state,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Entfernt ein Buch aus der Bibliothek.
 * @param userId - Die ID des Benutzers
 * @param bookId - Die ID des Buches
 * @returns Die Response-Daten vom Server
 */
export const removeBookFromLibrary = async (userId: number, bookId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/user/${userId}/lib/${bookId}`, {
    withCredentials: true,
  });
};

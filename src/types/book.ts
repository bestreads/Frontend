export type BookState = "read" | "reading" | "want-to-read"

export const bookStateLabels: Record<BookState, string> = {
  read: "Gelesen",
  reading: "Lese ich gerade",
  "want-to-read": "Möchte ich lesen",
}

export const bookStateLabelsThirdPerson: Record<BookState, string> = {
  read: "hat gelesen",
  reading: "liest gerade",
  "want-to-read": "möchte lesen",
}

// Mapping von BookState zu API-Wert (0 = Want to read, 1 = Reading, 2 = Read)
export const bookStateToApi: Record<BookState, number> = {
  "want-to-read": 0,
  "reading": 1,
  "read": 2,
}

// Mapping von API-Wert zu BookState
export const apiToBookState: Record<number, BookState> = {
  0: "want-to-read",
  1: "reading",
  2: "read",
}

export interface BookRating {
  Avg: number
  Count: number
}

export interface Book {
  ID: number
  ISBN: string
  Title: string
  Author: string
  CoverURL: string
  RatingAvg: number
  Rating?: BookRating
  Description: string
  ReleaseDate: number
  Genre: string
}

export interface UserBook {
  state?: BookState
  rating?: number
}

export interface BookWithUserData extends Book {
  userBook: UserBook
}

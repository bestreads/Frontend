export type BookState = "read" | "reading" | "want-to-read"

export interface Book {
  ISBN: string
  title: string
  author: string
  coverurl: string
  ratingavg: number
  description: string
  releasedate: number
  genre?: string
}

export interface UserBook {
  state: BookState
  rating: number
}

export interface BookWithUserData extends Book {
  userBook: UserBook
}

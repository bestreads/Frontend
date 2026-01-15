import type { BookWithUserData } from "./book"

export interface PostAuthor {
  userId: string
  username: string
  profilePictureURL?: string
}

export interface Comment {
  id: string
  author: PostAuthor
  content: string
  createdAt: string
  likes?: number
}

export interface Post {
  id: string
  author: PostAuthor
  book: BookWithUserData
  content: string
  createdAt: string
  likes?: number
  commentCount?: number
  comments?: Comment[] // erst bei Klick laden? 
}

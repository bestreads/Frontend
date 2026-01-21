import apiClient from "./client"
import type { Book } from "../types/book"

export interface Post {
  ProfilePicture: string
  Username: string
  Uid: number
  Book: Book
  Content: string
}

export interface GetPostsParams {
  uid?: number
}

export interface CreatePostData {
  bid: number
  content: string
}

/**
 * Holt alle Posts von einem bestimmten Benutzer
 * @param params - Die ID des Benutzers und die ID des Buches
 * @returns Die Response-Daten vom Server
 */
export const getPosts = async (params: GetPostsParams): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>("/post", { data: params })
  return response.data
}

/**
 * Erstellt einen Post zu einem Buch von einem Benutzer
 * @param userId - Die ID des Benutzers
 * @param data - Der Inhalt des Posts
 * @returns Die Response-Daten vom Server
 */
export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await apiClient.post<Post>(`/post`, data)
  return response.data
}

import apiClient from "./client"
import type { Book } from "../types/book"

export interface Post {
  ProfilePicture: string
  Username: string
  Uid: number
  Book: Book
  Content: string
  CreatedAt: string
  State: number
  Rating: number
}

export interface GetPostsParams {
  userId?: number
  offset?: number
}

export interface CreatePostData {
  bid: number
  content: string
}

export interface UpdatePost {
  bid: number
  content: string
}

export interface DeletePost {
  bid: number
}

/**
 * Holt alle Posts von einem bestimmten Benutzer
 * @param params - Die ID des Benutzers und die ID des Buches
 * @returns Die Response-Daten vom Server
 */
export const getPosts = async (params: GetPostsParams): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>("/post", { params })
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

/**
 * Löscht einen Post.
 * @param id - Id des zu löschenden Posts
 */
export const deletePost = async (data: DeletePost): Promise<void> => {
  const response = await apiClient.delete(`/post`, { params: data })
  return response.data
}

/**
 * Aktualisiert einen Post.  
 * @param data - Die Daten zum Aktualisieren des Posts  
 */
export const updatePost = async (data: UpdatePost): Promise<Post> => {
  const response = await apiClient.put<Post>(`/post`, data)
  return response.data
}

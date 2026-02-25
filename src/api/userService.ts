import apiClient from "./client"

export interface User {
  userId: number
  username: string
  email: string
  profilePicture: string
}

export interface UserProfile {
  userId: number
  username: string
  profilePicture: string
  accountCreatedAtYear: number
  booksInLibrary: number
  posts: number
  description: string
  followersCount: number
  followingCount: number
}

export interface OwnUserProfile {
  userId: number
  username: string
  profilePicture: string
  accountCreatedAtYear: number
  booksInLibrary: number
  posts: number
  email: string
}

/**
 * Holt die Daten des aktuell eingeloggten Benutzers
 * @returns Die User-Daten vom Server
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/user")
  return response.data
}

/**
 * Holt die Profil-Daten von einem Benutzer
 * @param userId - Die ID des Benutzers
 * @returns Die Response-Daten vom Server
 */
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(`/user/${userId}`)
  return response.data
}

/**
 * Holt die Daten des aktiven Benutzers (mit Email)
 * @returns Die Response-Daten vom Server
 */
export const getUser = async (): Promise<OwnUserProfile> => {
  const response = await apiClient.get<OwnUserProfile>(`/user`)
  return response.data
}

export interface FollowUser {
  userId: number
  username: string
  profilePicture: string
}

/**
 * Holt die Follower-Liste eines Benutzers.
 * Ruft zuerst die IDs ab und löst dann jedes Profil einzeln auf.
 * @param userId - Die ID des Benutzers
 * @returns Liste der Nutzer, die dem Benutzer folgen
 */
export const getFollowers = async (userId: number): Promise<FollowUser[]> => {
  const idsResponse = await apiClient.get<number[]>(`/user/${userId}/followers`)
  const profiles = await Promise.all(
    idsResponse.data.map((id) => apiClient.get<FollowUser>(`/user/${id}`))
  )
  return profiles.map((r) => r.data)
}

/**
 * Holt die Following-Liste eines Benutzers.
 * Ruft zuerst die IDs ab und löst dann jedes Profil einzeln auf.
 * @param userId - Die ID des Benutzers
 * @returns Liste der Nutzer, denen der Benutzer folgt
 */
export const getFollowing = async (userId: number): Promise<FollowUser[]> => {
  const idsResponse = await apiClient.get<number[]>(`/user/${userId}/following`)
  const profiles = await Promise.all(
    idsResponse.data.map((id) => apiClient.get<FollowUser>(`/user/${id}`))
  )
  return profiles.map((r) => r.data)
}

export interface UpdateUserData {
  username?: string
  email?: string
  password?: string
  profilePicture?: File
  description?: string
}

/**
 * Aktualisiert die Benutzerdaten. Alle Felder sind optional.
 * Es werden nur die übergebenen Felder aktualisiert.
 * @param data - Die zu aktualisierenden Daten
 */
export const updateUserData = async (data: UpdateUserData): Promise<void> => {
  const formData = new FormData()

  if (data.username) formData.append("username", data.username)
  if (data.email) formData.append("email", data.email)
  if (data.password) formData.append("password", data.password)
  if (data.profilePicture) formData.append("profile_picture", data.profilePicture)
  if (data.description !== undefined) formData.append("description", data.description)

  await apiClient.put("/user", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
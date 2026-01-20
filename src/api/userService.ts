import apiClient from "./client"

export interface UserProfile {
  userId: number
  username: string
  profilePicture: string
  accountCreatedAtYear: number
  booksInLibrary: number
  posts: number
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
export const getUser = async () => {
  const response = await apiClient.get<OwnUserProfile>(`/user`)
  return response.data
}
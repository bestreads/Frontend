import apiClient from "./client"

export interface UserProfile {
  userId: number
  username: string
  profilePicture: string
  accountCreatedAtYear: number
  booksInLibrary: number
  posts: number
  follower: number
  following: number
}

/**
 * Holt die Profil-Daten von einem Benutzer
 * @param userId - Die ID des Benutzers
 * @returns Die Response-Daten vom Server
 */
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(`/user/profile/${userId}`)
  return response.data
}

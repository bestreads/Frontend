import apiClient from "./client"

/**
 * Folgt einem Benutzer
 * @param id - Die ID des Benutzers, dem gefolgt werden soll
 * @returns Die Response-Daten vom Server
 */
export const followUser = async (id: number): Promise<void> => {
  console.log(`[followService] Calling POST /follow?id=${id}`)
  await apiClient.post(`/follow?id=${id}`)
}

/**
 * Entfolgt einem Benutzer
 * @param id - Die ID des Benutzers, dem entfolgt werden soll
 * @returns Die Response-Daten vom Server
 */
export const unfollowUser = async (id: number): Promise<void> => {
  console.log(`[followService] Calling DELETE /follow?id=${id}`)
  await apiClient.delete(`/follow?id=${id}`)
}

import apiClient from "./client"

/**
 * Folgt einem Benutzer
 * @param id - Die ID des Benutzers, dem gefolgt werden soll
 * @returns Die Response-Daten vom Server
 */
export const followUser = async (id: number): Promise<void> => {
  await apiClient.post("/follow", null, { params: { id } })
}

/**
 * Entfolgt einem Benutzer
 * @param id - Die ID des Benutzers, dem entfolgt werden soll
 * @returns Die Response-Daten vom Server
 */
export const unfollowUser = async (id: number): Promise<void> => {
  await apiClient.delete("/follow", { params: { id } })
}

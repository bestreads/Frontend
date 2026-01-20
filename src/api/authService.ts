import apiClient from "./client"

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  message?: string
}

/**
 * Loggt einen Benutzer ein.
 * @param data - Email und Passwort des Benutzers
 * @returns Die Response-Daten vom Server
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  // Wichtig: apiClient mit withCredentials: true damit Cookies gesetzt werden
  const response = await apiClient.post<AuthResponse>("/auth/login", data)
  return response.data
}

/**
 * Loggt den aktuellen Benutzer aus.
 * @returns Die Response-Daten vom Server
 */
export const logout = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/logout")
  return response.data
}

/**
 * Erneuert das Auth-Token des Benutzers.
 * @returns Die Response-Daten vom Server
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/refresh")
  return response.data
}

/**
 * Erstellt einen neuen Benutzer.
 * @param data - Email, Username und Passwort des Benutzers
 * @returns Die Response-Daten vom Server
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/user", data)
  return response.data
}

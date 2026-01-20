import axios from "axios"

const API_BASE_URL = "/api/v1"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Einfacher Interceptor: Bei 401 → Refresh versuchen
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const url = originalRequest.url || ""

    // Diese Routen sollen NICHT refreshen (Auth-Check, Login, etc.)
    const skipRefresh =
      url.includes("/auth/") ||
      url === "/user" // getCurrentUser beim App-Start

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRefresh
    ) {
      originalRequest._retry = true

      try {
        await apiClient.post("/auth/refresh")
        return apiClient(originalRequest)
      } catch {
        // Refresh fehlgeschlagen → zur Login-Seite
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

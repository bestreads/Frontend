import axios from "axios"

const API_BASE_URL = "/api/v1"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Interceptor: 401 anywhere → try to refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const url = originalRequest.url || ""

    // skip refresh for auth endpoints or when already on login/signup page
    const isOnPublicPage = ['/login', '/signup'].includes(window.location.pathname)
    const skipRefresh = url.includes("/auth/") || isOnPublicPage

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRefresh
    ) {
      originalRequest._retry = true

      try {
        await apiClient.post("/auth/refresh")
        return apiClient(originalRequest)
      } catch (refreshError){
        console.log(`Error refreshing token: ${refreshError}`)
        // Only redirect if not already on a public page
        if (!isOnPublicPage) {
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

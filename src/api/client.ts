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

    // skip refresh 
    const skipRefresh = url.includes("/auth/") || (url.includes("/user") && window.location.pathname === "/login")

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
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

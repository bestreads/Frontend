import axios from "axios"

const isDev = import.meta.env.VITE_DEV === "true"
const API_BASE_URL = isDev ? "http://localhost:3000/api/v1" : "/api/v1"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export default apiClient

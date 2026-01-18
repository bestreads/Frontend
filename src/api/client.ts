import axios from "axios"

// TODO: env oder so?
const API_BASE_URL = "http://localhost:3000/api/v1" 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

export default apiClient

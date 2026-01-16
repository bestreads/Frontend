import apiClient from "./client"

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface RegisterResponse {
  message?: string
}

/* Sign up new user */
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const formData = new URLSearchParams()
  formData.append("email", data.email)
  formData.append("username", data.username)
  formData.append("password", data.password)

  const response = await apiClient.post<RegisterResponse>("/user", formData.toString())
  return response.data
}

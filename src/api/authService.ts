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
  const response = await apiClient.post<RegisterResponse>("/user", data)
  return response.data
}

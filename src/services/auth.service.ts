import apiClient from "@/lib/api/apiClient"
import { setAuthToken } from "@/lib/api/token"

interface LoginResponse {
  message: string
  access_token: string
}

export async function login(email: string, password: string) {
  const response = await apiClient.post<LoginResponse>("/auth/login", { email, password })
  const { access_token } = response.data
  setAuthToken(access_token)
  return response.data
}

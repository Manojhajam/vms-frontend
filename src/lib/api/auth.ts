import apiClient from "./apiClient"

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

export function setAuthToken(token: string) {
  localStorage.setItem("access_token", token)
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export function clearAuthToken() {
  localStorage.removeItem("access_token")
}

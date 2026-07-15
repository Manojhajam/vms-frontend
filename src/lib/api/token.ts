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

"use client"

import axios from "axios"
import { API_CONFIG } from "./config"
import { getNotification } from "./notification"
import { clearAuthToken } from "./auth"

const apiClient = axios.create(API_CONFIG)

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.method !== "get" && response.data?.message) {
      getNotification()?.success({
        description: response.data.message,
        duration: 3,
      })
    }
    return response
  },
  (error) => {
    const status = error.response?.status
    const notify = getNotification()

    if (status === 401) {
      const isLoginRequest = error.config?.url === "/auth/login"
      if (isLoginRequest) {
        notify?.error({
          message: "Login Failed",
          description: error.response?.data?.message || "Invalid email or password.",
          duration: 4,
        })
      } else {
        if (typeof window !== "undefined") {
          clearAuthToken()
          window.location.href = "/login"
        }
      }
    } else if (status === 403 && error.config?.method?.toLowerCase() !== "get") {
      notify?.error({
        message: "Access Denied",
        description: error.response?.data?.message || "You don't have permission for this action.",
        duration: 4,
      })
    } else if (status >= 500) {
      notify?.error({
        message: "Server Error",
        description: error.response?.data?.message || "Something went wrong. Please try again later.",
        duration: 4,
      })
    } else if (status && status >= 400) {
      notify?.error({
        message: "Request Failed",
        description: error.response?.data?.message || error.message || "An unexpected error occurred.",
        duration: 4,
      })
    } else {
      notify?.error({
        message: "Network Error",
        description: "Unable to connect to the server. Please check your connection.",
        duration: 4,
      })
    }

    return Promise.reject(error)
  },
)

export default apiClient

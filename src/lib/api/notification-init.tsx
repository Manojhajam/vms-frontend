"use client"

import { App } from "antd"
import { useEffect } from "react"
import { setNotificationInstance } from "./notification"

export default function NotificationInit() {
  const { notification } = App.useApp()

  useEffect(() => {
    setNotificationInstance(notification)
  }, [notification])

  return null
}

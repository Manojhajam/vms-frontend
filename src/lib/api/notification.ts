import type { NotificationInstance } from "antd/es/notification"

let api: NotificationInstance | null = null

export function setNotificationInstance(instance: NotificationInstance) {
  api = instance
}

export function getNotification() {
  return api
}

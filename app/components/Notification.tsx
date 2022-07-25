import { useTransition } from "@remix-run/react"
import { useEffect, useState } from "react"
import {
  FaBan,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa"

import type { NotificationData } from "~/utils/notification.server"

type Props = {
  notification: NotificationData
}
export default function Notification({ notification }: Props) {
  const Icon = {
    success: FaCheckCircle,
    error: FaBan,
    warning: FaExclamationCircle,
    info: FaInfoCircle,
  }[notification.type]

  const alertClass = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  }[notification.type]

  const [isActive, setIsActive] = useState(true)
  const onNotificationClose = () => setIsActive(false)
  const { state } = useTransition()

  useEffect(() => {
    setIsActive(true)
  }, [notification])

  useEffect(() => {
    if (state === "loading") setIsActive(false)
  }, [state])

  if (!isActive) return null

  return (
    <div className={`alert ${alertClass} mb-4`}>
      <div className="flex-1">
        <Icon className="mx-2 h-6 w-6 flex-shrink-0" />
        <label>
          <h4 cy-data="notificationTitle">{notification.message}</h4>
          {notification.detail && (
            <p
              className="text-sm text-base-content text-opacity-60"
              cy-data="notificationDetail"
            >
              {notification.detail}
            </p>
          )}
        </label>
      </div>
      <div className="flex-none">
        <button
          type="button"
          className="btn btn-ghost btn-square btn-sm"
          onClick={onNotificationClose}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  )
}

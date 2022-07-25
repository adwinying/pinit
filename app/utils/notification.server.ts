import type { Session } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { commitSession } from "~/utils/session.server"

export enum NotificationType {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}

export type NotificationData = {
  type: NotificationType
  message: string
  detail?: string
}

export const getNotification = (
  session: Session,
): NotificationData | undefined => session.get("notification")

export const flashNotificationAndRedirect = async ({
  session,
  type,
  message,
  redirectTo,
  detail,
}: NotificationData & {
  session: Session
  redirectTo: string
}) => {
  session.flash("notification", { type, message, detail })

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}

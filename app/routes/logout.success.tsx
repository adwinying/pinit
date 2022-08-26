import type { LoaderFunction } from "@remix-run/node"

import { requireGuest } from "~/utils/auth.server"
import {
  flashNotificationAndRedirect,
  NotificationType,
} from "~/utils/notification.server"
import { getCurrentSession } from "~/utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  await requireGuest(request)

  const session = await getCurrentSession(request)

  return flashNotificationAndRedirect({
    session,
    type: NotificationType.Success,
    message: "Successfully logged out",
    redirectTo: "/",
  })
}

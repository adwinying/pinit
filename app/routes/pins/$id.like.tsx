import type { ActionFunction, LoaderFunction } from "@remix-run/node"

import { getPinById } from "~/libs/getPinById"
import { togglePinLike } from "~/libs/togglePinLike"
import { requireUser } from "~/utils/auth.server"
import {
  flashNotificationAndRedirect,
  NotificationType,
} from "~/utils/notification.server"
import { getCurrentSession } from "~/utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getCurrentSession(request)

  return flashNotificationAndRedirect({
    session,
    type: NotificationType.Success,
    message: "Successfully liked pin",
    redirectTo: "/",
  })
}

export const action: ActionFunction = async ({ params, request }) => {
  const pinId = params.id

  if (!pinId) throw new Response("Invalid pin ID", { status: 422 })

  const pin = await getPinById({ id: pinId })

  if (!pin) throw new Response("Invalid pin ID", { status: 422 })

  const user = await requireUser(request)

  await togglePinLike({ user, pin })

  return null
}

export default function LikePinRoute() {
  return null
}

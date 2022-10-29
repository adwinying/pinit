import type { ActionFunction, LoaderFunction } from "@remix-run/node"

import { deletePin } from "~/libs/deletePin"
import { getPinById } from "~/libs/getPinById"
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
    message: "Successfully deleted pin",
    redirectTo: "/",
  })
}

export const action: ActionFunction = async ({ request, params }) => {
  const pinId = params.id

  if (!pinId) throw new Response("Invalid pin ID", { status: 422 })

  const pin = await getPinById({ id: pinId })

  if (!pin) throw new Response("Invalid pin ID", { status: 422 })

  const user = await requireUser(request)

  if (user.id !== pin.ownerId)
    throw new Response("Not your pin!", { status: 401 })

  await deletePin({ pin })

  return null
}

export default function DeletePin() {
  return null
}

import type { ActionFunction } from "@remix-run/node"

import { authenticator, requireUser } from "~/utils/auth.server"

export let action: ActionFunction = async ({ request }) => {
  await requireUser(request)

  await authenticator.logout(request, { redirectTo: "/logout/success" })
}

import type { ActionFunction } from "@remix-run/node"

import { authenticator } from "~/utils/auth.server"

export const action: ActionFunction = async ({ request }) => {
  await authenticator.authenticate("twitter", request, {
    successRedirect: "/",
  })
}

import type { LoaderFunction } from "@remix-run/node"

import { authenticator } from "~/utils/auth.server"

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("twitter", request, {
    successRedirect: "/login/success",
    failureRedirect: "/login/failed",
  })
}

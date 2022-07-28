import type { LoaderFunction, MetaFunction } from "@remix-run/node"

import PageTitle from "~/components/PageTitle"
import { requireGuest } from "~/utils/auth.server"

export const meta: MetaFunction = () => ({
  title: "Login Failed - Pinit",
})

export const loader: LoaderFunction = async ({ request }) => {
  await requireGuest(request)

  return null
}

export default function LoginFailed() {
  return (
    <>
      <PageTitle>Login Failed</PageTitle>
      <p>
        Failed to login. Try again by clicking the Login button on the top
        right.
      </p>
    </>
  )
}

import type { LoaderFunction, MetaFunction } from "@remix-run/node"

import PageTitle from "~/components/PageTitle"
import { requireGuest } from "~/utils/auth.server"

export const meta: MetaFunction = () => ({
  title: "Unauthenticated - Pinit",
})

export const loader: LoaderFunction = async ({ request }) => {
  await requireGuest(request)

  return null
}

export default function LoginUnauthenticated() {
  return (
    <>
      <PageTitle>Unauthenticated</PageTitle>

      <p>
        You'll need to login to see this page or perform this action. Click the
        Login button on the top right to get started.
      </p>
    </>
  )
}

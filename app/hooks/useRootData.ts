import { useMatches } from "@remix-run/react"
import { useMemo } from "react"

import type { LoaderData as RootLoaderData } from "~/root"

export const useRootData = (): RootLoaderData => {
  const routes = useMatches()
  const rootRoute = useMemo(
    () => routes.find((route) => route.id === "root"),
    [routes],
  )

  if (!rootRoute) throw new Error("Root route not found")

  return rootRoute?.data
}

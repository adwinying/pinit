import type { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import PinsGrid from "~/components/PinsGrid"
import getPins from "~/libs/getPins"

type LoaderData = {
  pins: {
    id: string
    title: string
    imageUrl: string
    username: string
    userImgUrl: string
  }[]
}
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const count = 20
  const page = Number(url.searchParams.get("page") ?? "1")
  const offset = (page - 1) * count

  const pins = await getPins({ offset, count })

  const response: LoaderData = {
    pins: pins.map(({ id, title, imageUrl, owner }) => ({
      id,
      title,
      imageUrl,
      username: owner.username,
      userImgUrl: owner.profileImgUrl,
    })),
  }

  return response
}

export default function Index() {
  const { pins } = useLoaderData<LoaderData>()

  return <PinsGrid pins={pins} className="my-5" />
}

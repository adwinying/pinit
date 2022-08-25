import type { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import Pagination from "~/components/Pagination"
import PinsGrid from "~/components/PinsGrid"
import getPins from "~/libs/getPins"
import getPinsCount from "~/libs/getPinsCount"

type LoaderData = {
  pins: {
    id: string
    title: string
    imageUrl: string
    username: string
    userImgUrl: string
  }[]
  pagination: {
    baseUrl: string
    perPage: number
    currentPage: number
    total: number
  }
}
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const count = 20
  const page = Number(url.searchParams.get("page") ?? "1")
  const offset = (page - 1) * count

  const pins = await getPins({ offset, count })
  const total = await getPinsCount()

  const response: LoaderData = {
    pins: pins.map(({ id, title, imageUrl, owner }) => ({
      id,
      title,
      imageUrl,
      username: owner.username,
      userImgUrl: owner.profileImgUrl,
    })),
    pagination: {
      baseUrl: url.toString(),
      perPage: count,
      currentPage: page,
      total,
    },
  }

  return response
}

export default function Index() {
  const { pins, pagination } = useLoaderData<LoaderData>()

  return (
    <>
      <PinsGrid pins={pins} className="my-5" />
      <Pagination
        baseUrl={pagination.baseUrl}
        total={pagination.total}
        perPage={pagination.perPage}
        currentPage={pagination.currentPage}
      />
    </>
  )
}

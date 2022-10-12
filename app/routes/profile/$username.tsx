import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import PageTitle from "~/components/PageTitle"
import Pagination from "~/components/Pagination"
import PinsGrid from "~/components/PinsGrid"
import { getUserByUsername } from "~/libs/getUserByUsername"
import { getUserPins } from "~/libs/getUserPins"
import { getUserPinsCount } from "~/libs/getUserPinsCount"
import { getUser } from "~/utils/auth.server"

export type LoaderData = {
  user: {
    id: string
    username: string
  }
  isOwner: boolean
  pinCount: number
  pins: {
    id: string
    title: string
    imageUrl: string
    username: string
    userImgUrl: string
    likedBy: string[]
  }[]
  pagination: {
    baseUrl: string
    perPage: number
    currentPage: number
    total: number
  }
}
export const loader: LoaderFunction = async ({ params, request }) => {
  const { username } = params

  if (!username) throw new Response("Not Found", { status: 404 })

  const user = await getUserByUsername({ username })

  if (user === null) throw new Response("Not Found", { status: 404 })

  const authUser = await getUser(request)
  const pinCount = await getUserPinsCount({ user })

  const url = new URL(request.url)
  const count = 20
  const page = Number(url.searchParams.get("page") ?? 1)
  const offset = (page - 1) * count
  const pins = await getUserPins({ user, offset, count })

  return json<LoaderData>({
    user: {
      id: user.id,
      username: user.username,
    },
    isOwner: user.id === authUser?.id,
    pinCount,
    pins: pins.map(({ id, title, imageUrl, owner, likes }) => ({
      id,
      title,
      imageUrl,
      username: owner.username,
      userImgUrl: owner.profileImgUrl,
      likedBy: likes.map(({ userId }) => userId),
    })),
    pagination: {
      baseUrl: url.toString(),
      perPage: count,
      currentPage: page,
      total: pinCount,
    },
  })
}

export default function UserProfile() {
  const { user, pins, pagination } = useLoaderData<LoaderData>()

  return (
    <div>
      <PageTitle>{user.username}'s Pins</PageTitle>

      <PinsGrid pins={pins} className="my-5" />

      <Pagination {...pagination} />
    </div>
  )
}

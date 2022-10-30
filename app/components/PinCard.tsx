import { Link, useFetcher } from "@remix-run/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { FaRegStar, FaStar, FaSync, FaTrash } from "react-icons/fa"

import { useUser } from "~/hooks/useUser"

type Props = {
  id: string
  pinImgUrl: string
  pinCaption: string
  username: string
  profileImgUrl: string
  likedBy: string[]
}
export default function PinCard({
  id,
  pinImgUrl,
  pinCaption,
  profileImgUrl,
  username,
  likedBy,
}: Props) {
  const [key, setKey] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const likePin = useFetcher()
  const deletePin = useFetcher()
  const user = useUser()
  const isLikedByUser = useMemo(() => {
    if (!user) return false
    return likedBy.includes(user.id)
  }, [user, likedBy])

  const resizeCard = () => {
    const $card = cardRef?.current

    if (!$card) return

    const $parent = $card.parentElement as HTMLDivElement | null

    if (!$parent) return

    const rowHeight = parseInt(
      window.getComputedStyle($parent).getPropertyValue("grid-auto-rows"),
      10,
    )
    const rowGap = parseInt(
      window.getComputedStyle($parent).getPropertyValue("grid-row-gap"),
      10,
    )
    const cardHeight = $card.getBoundingClientRect().height
    const rowSpan = Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap))

    $card.style.gridRowEnd = `span ${rowSpan}`
    $card.style.alignSelf = "stretch"
  }

  // force re-render on component hydration to trigger image onLoad event
  useEffect(() => {
    setKey((k) => k + 1)
  }, [])

  return (
    <div
      className="card card-compact bg-white shadow-xl"
      ref={cardRef}
      key={key}
    >
      {deletePin.state !== "idle" && (
        <div
          className="absolute top-0 bottom-0 left-0 right-0
          flex items-center justify-center bg-gray-500/70 text-white"
        >
          <FaSync className="mr-2 animate-spin" />
          Deleting...
        </div>
      )}

      <figure>
        <img
          src={pinImgUrl}
          alt=""
          className="max-h-80 w-full object-cover"
          onLoad={resizeCard}
        />
      </figure>
      <div className="card-body">
        <p className="mb-2 text-center text-lg">{pinCaption}</p>
        <div className="flex items-center justify-between">
          <Link
            to={`/profile/${username}`}
            className="btn btn-ghost btn-sm pl-0 normal-case"
          >
            <img
              src={profileImgUrl}
              alt=""
              className="mask mask-circle mr-2 w-8"
            />
            <span>{username}</span>
          </Link>

          <div className="flex">
            <likePin.Form method="post" action={`/pins/${id}/like`}>
              <button
                type="submit"
                className="btn btn-ghost btn-sm space-x-1 text-lg text-yellow-500"
              >
                {isLikedByUser ? <FaStar /> : <FaRegStar />}
                <span>{likedBy.length}</span>
              </button>
            </likePin.Form>

            {username === user?.username && (
              <deletePin.Form method="post" action={`/pins/${id}/delete`}>
                <button
                  type="submit"
                  className="btn btn-ghost btn-sm space-x-1 text-lg text-red-500"
                >
                  <FaTrash />
                </button>
              </deletePin.Form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

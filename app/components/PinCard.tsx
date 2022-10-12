import { Link, useFetcher } from "@remix-run/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { FaRegStar, FaStar } from "react-icons/fa"

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
  const like = useFetcher()
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

          <div>
            <like.Form method="post" action={`/pins/${id}/like`}>
              <button
                type="submit"
                className="btn btn-ghost btn-sm space-x-1 text-lg text-yellow-500"
              >
                {isLikedByUser ? <FaStar /> : <FaRegStar />}
                <span>{likedBy.length}</span>
              </button>
            </like.Form>
          </div>
        </div>
      </div>
    </div>
  )
}

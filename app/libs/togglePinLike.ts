import type { Pin, User } from "@prisma/client"

import db from "~/utils/db.server"

export type TogglePinLike = {
  user: User
  pin: Pin
}

export async function togglePinLike({ user, pin }: TogglePinLike) {
  const userId = user.id
  const pinId = pin.id

  const likeEntry = await db.like.findFirst({ where: { userId, pinId } })
  const isPinLikedByUser = likeEntry !== null

  if (isPinLikedByUser) return db.like.delete({ where: { id: likeEntry.id } })

  return db.like.create({ data: { userId, pinId } })
}

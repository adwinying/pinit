import type { User } from "@prisma/client"

import db from "~/utils/db.server"

export type GetUserPins = {
  user: User
  offset?: number
  count?: number
}

export async function getUserPins({
  user,
  offset = 0,
  count = 20,
}: GetUserPins) {
  return db.pin.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: "desc" },
    skip: offset,
    take: count,
    include: { owner: true },
  })
}

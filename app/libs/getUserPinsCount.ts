import type { User } from "@prisma/client"

import db from "~/utils/db.server"

export type GetUserPinsCount = {
  user: User
}

export async function getUserPinsCount({ user }: GetUserPinsCount) {
  return db.pin.count({
    where: { ownerId: user.id },
  })
}

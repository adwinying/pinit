import type { User } from "@prisma/client"

import db from "~/utils/db.server"

export type CreatePin = {
  owner: User
  title: string
  imageUrl: string
}

export async function createPin({ owner, title, imageUrl }: CreatePin) {
  return db.pin.create({
    data: {
      title,
      imageUrl,
      ownerId: owner.id,
    },
  })
}

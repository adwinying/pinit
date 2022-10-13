import type { Pin } from "@prisma/client"

import db from "~/utils/db.server"

export type DeletePin = {
  pin: Pin
}

export async function deletePin({ pin }: DeletePin) {
  return db.pin.delete({ where: { id: pin.id } })
}

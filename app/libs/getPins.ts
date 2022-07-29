import db from "~/utils/db.server"

export type GetPins = {
  offset?: number
  count?: number
}

export default async function getPins({ offset = 0, count = 20 }: GetPins) {
  return db.pin.findMany({
    orderBy: { updatedAt: "desc" },
    skip: offset,
    take: count,
    include: { owner: true },
  })
}

import db from "~/utils/db.server"

type GetPinById = {
  id: string
}

export async function getPinById({ id }: GetPinById) {
  return db.pin.findFirst({ where: { id } })
}

import db from "~/utils/db.server"

export async function getPinsCount() {
  return db.pin.count()
}

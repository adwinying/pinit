import db from "~/utils/db.server"

export default async function getPinsCount() {
  return db.pin.count()
}

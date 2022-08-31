import db from "~/utils/db.server"

export type GetUserByUsername = {
  username: string
}

export async function getUserByUsername({ username }: GetUserByUsername) {
  return db.user.findFirst({ where: { username } })
}

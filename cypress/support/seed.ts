import type { ScriptInput } from "./commands"

import db from "~/utils/db.server"

const input = JSON.parse(process.argv[2])

async function seed(input: ScriptInput["seed"]) {
  const users = input.users
    ? Promise.all(input.users.map((data) => db.user.create({ data })))
    : undefined

  const pins = input.pins
    ? Promise.all(input.pins.map((data) => db.pin.create({ data })))
    : undefined

  const likes = input.likes
    ? Promise.all(input.likes.map((data) => db.like.create({ data })))
    : undefined

  console.log(
    JSON.stringify({
      users: await users,
      pins: await pins,
      likes: await likes,
    }),
  )
}

seed(input)

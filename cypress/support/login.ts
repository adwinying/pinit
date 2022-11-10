import { parse } from "cookie"

import type { ScriptInput } from "./commands"

import { authenticator } from "~/utils/auth.server"
import db from "~/utils/db.server"
import { sessionStorage } from "~/utils/session.server"

const input = JSON.parse(process.argv[2])

async function login(input: ScriptInput["login"]) {
  const user = await db.user.create({ data: input.user })

  // obtain session
  const session = await sessionStorage.getSession()

  // set session user
  session.set(authenticator.sessionKey, user)

  // generate new cookie containing session
  const cookie = await sessionStorage.commitSession(session)

  // get session cookie value
  const sessionString: string = parse(cookie).__session

  // return cookie string as stdout
  console.log(JSON.stringify({ user, session: sessionString }))
}

login(input)

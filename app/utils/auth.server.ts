import type { User } from "@prisma/client"
import { redirect } from "@remix-run/node"
import { Authenticator } from "remix-auth"
import { TwitterStrategy } from "remix-auth-twitter"

import { updateOrCreateUser } from "~/libs/updateOrCreateUser"
import { sessionStorage } from "~/utils/session.server"

export const authenticator = new Authenticator<User>(sessionStorage)

const clientID = process.env.TWITTER_CONSUMER_KEY
const clientSecret = process.env.TWITTER_CONSUMER_SECRET
const baseUrl = process.env.BASE_URL

if (!clientID)
  throw new Error(`environment variable missing: TWITTER_CONSUMER_KEY`)
if (!clientSecret)
  throw new Error(`environment variable missing: TWITTER_CONSUMER_SECRET`)
if (!baseUrl) throw new Error(`environment variable missing: BASE_URL`)

authenticator.use(
  new TwitterStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${baseUrl}/login/callback`,
      includeEmail: false,
    },
    async ({ profile }) => {
      const twitterId = profile.id.toString()
      const profileImgUrl = profile.profile_image_url_https
      const username = profile.screen_name

      return updateOrCreateUser({ twitterId, username, profileImgUrl })
    },
  ),
  "twitter",
)

export const getUser = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request)

  if (!user) return null

  return user
}

export const requireUser = async (request: Request) => {
  const user = await getUser(request)

  if (!user) throw redirect("/login/unauthenticated")

  return user
}

export const requireGuest = async (request: Request) => {
  const user = await getUser(request)

  if (user) throw redirect("/")
}

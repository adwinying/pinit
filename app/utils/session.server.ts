import { createCookieSessionStorage } from "@remix-run/node"

const { SESSION_SECRET } = process.env

if (!SESSION_SECRET) {
  throw new Error("No client secret. Set SESSION_SECRET environment variable.")
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage

export const getCurrentSession = async (request: Request) => {
  const cookieHeader = request.headers.get("cookie")

  return getSession(cookieHeader)
}

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

import Header from "~/components/Header"
import Notification from "~/components/Notification"
import tailwind from "~/tailwind.css"
import { getUser } from "~/utils/auth.server"
import type { NotificationData } from "~/utils/notification.server"
import { getNotification } from "~/utils/notification.server"
import { commitSession, getCurrentSession } from "~/utils/session.server"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "PinIt",
  viewport: "width=device-width,initial-scale=1",
  "theme-color": "#65c3c8",
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "icon", href: "favicon.svg" },
  { rel: "mask-icon", href: "mask-icon.svg", color: "#65c3c8" },
  { rel: "apple-touch-icon", href: "apple-touch-icon.png" },
  { rel: "manifest", href: "manifest.json" },
]

type LoaderData = {
  notification?: NotificationData
  user?: {
    id: string
    username: string
    profileImgUrl: string
  }
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const session = await getCurrentSession(request)
  const notification = getNotification(session)

  return json<LoaderData>(
    {
      notification,
      user: user
        ? {
            id: user.id,
            username: user.username,
            profileImgUrl: user.profileImgUrl,
          }
        : undefined,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  )
}

type LayoutProps = {
  children: JSX.Element
}
function Layout({ children }: LayoutProps) {
  const { user, notification } = useLoaderData<LoaderData>()

  return (
    <div className="container mx-auto px-3">
      <Header user={user} />
      {notification && <Notification notification={notification} />}
      {children}
    </div>
  )
}

export default function App() {
  return (
    <html lang="en" data-theme="cupcake">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react"

import PageTitle from "./components/PageTitle"

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
  { rel: "icon", href: "/favicon.svg" },
  { rel: "mask-icon", href: "/mask-icon.svg", color: "#65c3c8" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/manifest.json" },
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

type ErrorBoundaryProps = {
  error: Error
}
export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  // eslint-disable-next-line no-console
  console.error(error)

  return (
    <Page>
      <>
        <PageTitle>Oops, something went wrong!</PageTitle>
        <p>
          Try again later, or go back to the{" "}
          <Link to="/" className="link">
            home page
          </Link>
          .
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mockup-code mt-3 bg-error text-error-content">
            <pre className="whitespace-pre-wrap">
              <code>{error.toString()}</code>
            </pre>
          </div>
        )}
      </>
    </Page>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status !== 404)
    return <ErrorBoundary error={new Error(JSON.stringify(caught))} />

  return (
    <Page>
      <>
        <PageTitle>404: Not Found</PageTitle>
        <p>
          The page you are looking for does not exist. Perhaps you would like to
          go to the{" "}
          <Link to="/" className="link">
            home page
          </Link>
          ?
        </p>
      </>
    </Page>
  )
}

type LayoutProps = {
  children: JSX.Element
}
function Layout({ children }: LayoutProps) {
  const { user, notification } = useLoaderData<LoaderData>() ?? {}

  return (
    <div className="container mx-auto px-3">
      <Header user={user} />
      {notification && <Notification notification={notification} />}
      {children}
    </div>
  )
}

type PageProps = {
  children: JSX.Element
}
function Page({ children }: PageProps) {
  return (
    <html lang="en" data-theme="cupcake">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>{children}</Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Page>
      <Outlet />
    </Page>
  )
}

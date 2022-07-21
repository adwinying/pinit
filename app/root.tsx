import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

import Header from "~/components/Header"
import tailwind from "~/tailwind.css"

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

type LayoutProps = {
  children: JSX.Element
}
function Layout({ children }: LayoutProps) {
  return (
    <div className="container mx-auto">
      <Header />
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

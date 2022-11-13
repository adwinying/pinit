import { Link } from "@remix-run/react"

type Props = {
  baseUrl: string
  total: number
  currentPage: number
  perPage: number
}

export default function Pagination({
  baseUrl,
  total,
  currentPage,
  perPage,
}: Props) {
  if (total === 0) return null

  const offset = (currentPage - 1) * perPage
  const start = offset + 1
  const end = Math.min(offset + perPage, total)

  const pageCount = Math.ceil(total / perPage)
  const pages = new Array(pageCount).fill(0).map((_, i) => i + 1)

  const getPageUrl = (page: number): string => {
    const url = new URL(baseUrl)
    url.searchParams.set("page", page.toString())
    return url.toString().replace(url.origin, "")
  }

  return (
    <nav
      className="mb-6 items-center justify-between space-y-1"
      aria-label="Pagination"
    >
      <span>
        Showing {start.toLocaleString()} - {end.toLocaleString()} of{" "}
        {total.toLocaleString()}
      </span>

      <div className="btn-group">
        {pageCount > 1 &&
          pages.map((page) => (
            <Link
              key={page}
              className={`btn btn-sm ${
                page === currentPage ? "btn-active" : ""
              }`}
              data-page={page}
              to={getPageUrl(page)}
              prefetch="intent"
              aria-label={`Page ${page}`}
            >
              {page}
            </Link>
          ))}
      </div>
    </nav>
  )
}

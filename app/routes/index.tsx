export default function Index() {
  return (
    <div>
      <h1 className="mb-3 text-4xl font-bold">Welcome to Remix</h1>
      <ul className="ml-6">
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
            className="link link-neutral"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
            className="link link-neutral"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
            className="link link-neutral"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  )
}

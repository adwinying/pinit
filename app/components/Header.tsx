import { FaThumbtack } from "react-icons/fa"

export default function Header() {
  return (
    <header className="py-4">
      <h1 className="flex items-center">
        <FaThumbtack className="mr-2 text-3xl text-primary" />
        <span className="text-4xl font-bold">PinIt</span>
      </h1>
    </header>
  )
}

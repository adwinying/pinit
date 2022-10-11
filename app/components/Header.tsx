import { Form, Link } from "@remix-run/react"
import {
  FaPlus,
  FaSignOutAlt,
  FaThumbtack,
  FaTwitter,
  FaUser,
} from "react-icons/fa"

import { useUser } from "~/hooks/useUser"

export default function Header() {
  const user = useUser()
  const isLoggedIn = !!user

  return (
    <header className="flex items-center justify-between py-4">
      <div>
        <Link to="/">
          <span className="flex items-center">
            <FaThumbtack className="mr-2 text-3xl text-primary" />
            <span className="text-4xl font-bold">PinIt</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        {isLoggedIn ? (
          <>
            <div>
              <Link
                to="pins/new"
                className="btn btn-primary btn-sm hidden sm:flex"
              >
                <FaPlus className="mr-1" />
                New Pin
              </Link>
            </div>
            <div className="dropdown-end dropdown">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-sm m-1 flex pl-0 normal-case"
              >
                <img
                  src={user.profileImgUrl}
                  alt=""
                  className="mask mask-circle mr-2 h-8 w-8"
                />
                {user.username}
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <Link to={`/profile/${user.username}`}>
                    <FaUser />
                    My Pins
                  </Link>
                </li>
                <li>
                  <Form method="post" action="/logout">
                    <button
                      type="submit"
                      className="flex items-center gap-x-3 text-error"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </Form>
                </li>
              </ul>
            </div>
            <div className="fixed bottom-5 right-5 z-50 sm:hidden">
              <Link to="/pins/new" className="btn btn-primary btn-circle">
                <FaPlus className="text-xl" />
              </Link>
            </div>
          </>
        ) : (
          <Form method="post" action="/login">
            <button type="submit" className="btn btn-primary btn-sm">
              <FaTwitter className="mr-1" />
              Login
            </button>
          </Form>
        )}
      </div>
    </header>
  )
}

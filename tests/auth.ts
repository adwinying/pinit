import type { User } from "@prisma/client"

import { authenticator } from "~/utils/auth.server"
import db from "~/utils/db.server"

export const actingAs = async (userOverride?: Partial<User>) => {
  const user = await db.user.create({
    data: {
      username: "test",
      twitterId: "test",
      profileImgUrl: "https://test.com/test.png",
      ...(userOverride ?? {}),
    },
  })

  const authMock = vi.spyOn(authenticator, "isAuthenticated")
  authMock.mockResolvedValue(user)

  return user
}

import type { User } from "@prisma/client"

import { dbMock } from "~/../tests/mockDb"
import { getUserByUsername } from "~/libs/getUserByUsername"

describe("getUserByUsername", () => {
  const user: User = {
    id: "asdf-qwer-1234-5678",
    twitterId: "foo",
    username: "bar",
    profileImgUrl: "https://test.com/test.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it("should be able to get user by username", async () => {
    dbMock.user.findFirst.mockResolvedValue(user)

    const { username } = user
    const result = await getUserByUsername({ username })

    expect(dbMock.user.findFirst).toHaveBeenCalledWith({ where: { username } })
    expect(result).toEqual(user)
  })

  it("should return null when user not fould", async () => {
    dbMock.user.findFirst.mockResolvedValue(null)

    const { username } = user
    const result = await getUserByUsername({ username })

    expect(dbMock.user.findFirst).toHaveBeenCalledWith({ where: { username } })
    expect(result).toBeNull()
  })
})

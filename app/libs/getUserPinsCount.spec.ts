import type { User } from "@prisma/client"

import { dbMock } from "~/../tests/mockDb"
import { getUserPinsCount } from "~/libs/getUserPinsCount"

describe("getUserPinsCount", () => {
  const user: User = {
    id: "asdf-qwer-1234-5678",
    twitterId: "foo",
    username: "bar",
    profileImgUrl: "https://test.com/test.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it("returns the total number of pins a user has", async () => {
    const count = 69

    dbMock.pin.count.mockResolvedValue(count)

    const result = await getUserPinsCount({ user })

    expect(dbMock.pin.count).toHaveBeenCalledWith({
      where: { ownerId: user.id },
    })
    expect(result).toEqual(count)
  })
})

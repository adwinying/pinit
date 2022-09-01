import type { Pin, User } from "@prisma/client"

import { dbMock } from "~/../tests/mockDb"
import { getUserPins } from "~/libs/getUserPins"

describe("getUserPins", () => {
  const user: User = {
    id: "asdf-qwer-1234-5678",
    twitterId: "foo",
    username: "bar",
    profileImgUrl: "https://test.com/test.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const pins: Pin[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `${i + 1}`,
    title: `Pin ${i + 1}`,
    imageUrl: "https://test.com/test.png",
    ownerId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  it("should able to get pins", async () => {
    dbMock.pin.findMany.mockResolvedValue(pins)

    const offset = 100
    const count = 200
    const result = await getUserPins({ user, offset, count })

    expect(dbMock.pin.findMany).toHaveBeenCalledWith({
      where: { ownerId: user.id },
      orderBy: { updatedAt: "desc" },
      skip: offset,
      take: count,
      include: { owner: true },
    })

    expect(result).toEqual(pins)
  })

  it("should use default values if no params passed", async () => {
    dbMock.pin.findMany.mockResolvedValue(pins)

    const result = await getUserPins({ user })

    expect(dbMock.pin.findMany).toHaveBeenCalledWith({
      where: { ownerId: user.id },
      orderBy: { updatedAt: "desc" },
      skip: 0,
      take: 20,
      include: { owner: true },
    })

    expect(result).toEqual(pins)
  })
})

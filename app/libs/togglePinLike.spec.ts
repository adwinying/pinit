import type { Like, Pin, User } from "@prisma/client"

import { dbMock } from "~/../tests/mockDb"
import { togglePinLike } from "~/libs/togglePinLike"

describe("togglePinLike", () => {
  const pin: Pin = {
    id: "1234-5678-asdf-qwer",
    title: "Pin",
    imageUrl: "https://test.com/test.png",
    ownerId: "asdf-qwer-1234-5678",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const user: User = {
    id: "asdf-qwer-1234-5678",
    twitterId: "foo",
    username: "bar",
    profileImgUrl: "https://test.com/test.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const like: Like = {
    id: "asdf-1234-qwer-5678",
    userId: user.id,
    pinId: pin.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it("should create like entry if pin is not liked by user", async () => {
    dbMock.like.findFirst.mockResolvedValue(null)
    dbMock.like.create.mockResolvedValue(like)

    const result = await togglePinLike({ user, pin })
    expect(dbMock.like.findFirst).toHaveBeenCalledWith({
      where: { userId: user.id, pinId: pin.id },
    })
    expect(dbMock.like.create).toHaveBeenCalledWith({
      data: { userId: user.id, pinId: pin.id },
    })
    expect(result).toEqual(like)
  })

  it("should delete like entry if pin is already liked by user", async () => {
    dbMock.like.findFirst.mockResolvedValue(like)
    dbMock.like.delete.mockResolvedValue(like)

    const result = await togglePinLike({ user, pin })
    expect(dbMock.like.findFirst).toHaveBeenCalledWith({
      where: { userId: user.id, pinId: pin.id },
    })
    expect(dbMock.like.delete).toHaveBeenCalledWith({
      where: { id: like.id },
    })
    expect(result).toEqual(like)
  })
})

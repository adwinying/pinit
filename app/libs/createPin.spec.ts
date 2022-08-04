import type { Pin, User } from "@prisma/client"

import { prismaMock } from "~/../tests/database"
import createPin from "~/libs/createPin"

describe("createPin", () => {
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

  it("should be able to create pin", async () => {
    prismaMock.pin.create.mockResolvedValue(pin)

    const result = await createPin({
      owner: user,
      title: pin.title,
      imageUrl: pin.imageUrl,
    })

    expect(prismaMock.pin.create).toHaveBeenCalledWith({
      data: {
        title: pin.title,
        imageUrl: pin.imageUrl,
        ownerId: user.id,
      },
    })

    expect(result).toEqual(pin)
  })
})

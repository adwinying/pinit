import type { User } from "@prisma/client"

import { dbMock } from "~/../tests/mockDb"
import { updateOrCreateUser } from "~/libs/updateOrCreateUser"

describe("updateOrCreateUser", () => {
  const twitterId = "foo"
  const username = "bar"
  const profileImgUrl = "https://test.com/test.png"

  const user: User = {
    id: "asdf-qwer-1234-5678",
    twitterId,
    username,
    profileImgUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it("should be able to upsert user", async () => {
    dbMock.user.upsert.mockResolvedValue(user)

    const result = await updateOrCreateUser({
      twitterId,
      username,
      profileImgUrl,
    })

    expect(dbMock.user.upsert).toHaveBeenCalledWith({
      where: { twitterId },
      create: {
        twitterId,
        username,
        profileImgUrl,
      },
      update: {
        username,
        profileImgUrl,
      },
    })

    expect(result).toEqual(user)
  })
})

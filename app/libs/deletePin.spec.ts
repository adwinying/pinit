import type { Pin } from "@prisma/client"

import { dbMock } from "~/../tests/mockDb"
import { deletePin } from "~/libs/deletePin"

describe("deletePin", () => {
  const pin: Pin = {
    id: "1234-5678-asdf-qwer",
    title: "Pin",
    imageUrl: "https://test.com/test.png",
    ownerId: "asdf-qwer-1234-5678",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it("should be able to delete pin", async () => {
    dbMock.pin.delete.mockResolvedValue(pin)

    const result = await deletePin({ pin })

    expect(dbMock.pin.delete).toHaveBeenCalledWith({
      where: { id: pin.id },
    })

    expect(result).toEqual(pin)
  })
})

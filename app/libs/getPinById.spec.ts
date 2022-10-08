import type { Pin } from "@prisma/client"

import { dbMock } from "~/../tests/mockDb"
import { getPinById } from "~/libs/getPinById"

describe("getPinById", () => {
  const pin: Pin = {
    id: "1234-5678-asdf-qwer",
    title: "Pin",
    imageUrl: "https://test.com/test.png",
    ownerId: "asdf-qwer-1234-5678",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it("should return a pin that matches the ID given", async () => {
    dbMock.pin.findFirst.mockResolvedValue(pin)

    const pinId = pin.id
    const result = await getPinById({ id: pinId })

    expect(dbMock.pin.findFirst).toHaveBeenCalledWith({ where: { id: pinId } })
    expect(result).toEqual(pin)
  })

  it("should return null when pin with given ID is not found", async () => {
    dbMock.pin.findFirst.mockResolvedValue(null)

    const pinId = pin.id
    const result = await getPinById({ id: pinId })

    expect(dbMock.pin.findFirst).toHaveBeenCalledWith({ where: { id: pinId } })
    expect(result).toEqual(null)
  })
})

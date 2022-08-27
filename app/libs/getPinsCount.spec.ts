import { dbMock } from "~/../tests/mockDb"
import { getPinsCount } from "~/libs/getPinsCount"

describe("getPinsCount", () => {
  it("returns the total number of pins", async () => {
    const count = 69

    dbMock.pin.count.mockResolvedValue(count)

    const result = await getPinsCount()

    expect(dbMock.pin.count).toHaveBeenCalledOnce()
    expect(result).toEqual(count)
  })
})

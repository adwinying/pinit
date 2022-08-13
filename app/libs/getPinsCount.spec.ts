import getPinsCount from "./getPinsCount"

import { dbMock } from "~/../tests/mockDb"

test("getPinsCount", () => {
  it("returns the total number of pins", async () => {
    const count = 69

    dbMock.pin.count.mockResolvedValue(count)

    const result = await getPinsCount()

    expect(dbMock.pin.count).toHaveBeenCalled()
    expect(result).toEqual(count)
  })
})

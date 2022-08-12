import getPinsCount from "./getPinsCount"

import { prismaMock } from "~/../tests/database"

test("getPinsCount", () => {
  it("returns the total number of pins", async () => {
    const count = 69

    prismaMock.pin.count.mockResolvedValue(count)

    const result = await getPinsCount()

    expect(prismaMock.pin.count).toHaveBeenCalled()
    expect(result).toEqual(count)
  })
})

import type { PrismaClient } from "@prisma/client"
import { mockDeep, mockReset } from "vitest-mock-extended"

export const dbMock = mockDeep<PrismaClient>()

// when we import dbMock this mock will be automatically registered
vi.mock("~/utils/db.server", () => ({
  default: dbMock,
}))

beforeEach(() => {
  mockReset(dbMock)
})

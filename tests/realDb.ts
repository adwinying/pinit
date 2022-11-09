import { execSync } from "child_process"

// to run tests with actual db, call this function before running those tests
export const prepareRealDb = () => {
  const poolId = process.env.VITEST_POOL_ID ?? "e2e"
  const testDbFile = `test-${poolId}.db`

  // append poolId to avoid race conditions when running tests in parallel
  // don't reset DB when running E2E tests (DB is manually reset via cypress)
  if (poolId !== "e2e") execSync(`cp ./prisma/test.db ./prisma/${testDbFile}`)

  // update db url to newly created db file
  process.env.DATABASE_URL = `file:./${testDbFile}`
}

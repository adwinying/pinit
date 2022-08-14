import { PrismaClient } from "@prisma/client"

import { prepareRealDb } from "~/../tests/realDb"

let client: PrismaClient

declare global {
  var __db: PrismaClient | undefined
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  client = new PrismaClient()
  client.$connect()
} else if (process.env.NODE_ENV === "test") {
  if (!global.__db) {
    // create new db file for testing
    prepareRealDb()

    // create new connection with new created db file
    global.__db = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
    })
    global.__db.$connect()
  }
  client = global.__db
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
    global.__db.$connect()
  }
  client = global.__db
}

const db = client

export default db

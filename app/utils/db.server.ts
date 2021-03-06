import { PrismaClient } from "@prisma/client"

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
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
    global.__db.$connect()
  }
  client = global.__db
}

const db = client

export default db

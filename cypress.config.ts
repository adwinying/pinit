import { defineConfig } from "cypress"

export default defineConfig({
  videoCompression: false,
  e2e: {
    baseUrl: "http://localhost:3002",
  },
})

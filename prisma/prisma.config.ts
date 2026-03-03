// prisma/prisma.config.ts
import { defineConfig } from 'prisma/config'

export default defineConfig({
  url: process.env.DATABASE_URL,
})
import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // เพิ่มส่วนนี้เข้าไปเพื่อให้ Prisma รู้จัก URL
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
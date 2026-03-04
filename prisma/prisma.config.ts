import { PrismaClient } from "@prisma/client";

// ใช้เทคนิคเดิมคือครอบด้วย Backticks เพื่อยืนยันว่าเป็น string แน่นอน
const dbUrl = `${process.env.DATABASE_URL}`;

export const prismaConfig = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});
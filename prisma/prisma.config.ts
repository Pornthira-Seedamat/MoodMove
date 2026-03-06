import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// ป้องกันการสร้าง Connection ซ้ำซ้อนใน Next.js (Singleton Pattern)
const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        // ดึงค่า DATABASE_URL โดยตรงจาก env
        url: process.env.DATABASE_URL,
      },
    },
    log: ["query"],
  }).$extends(withAccelerate()); // ต้องมีบรรทัดนี้เพื่อรองรับ Accelerate

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
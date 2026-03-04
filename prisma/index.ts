import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. ตั้งค่าการเชื่อมต่อผ่าน Pool (ช่วยให้ Database เสถียรขึ้น)
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. ป้องกันการสร้าง Connection ซ้ำซ้อน (Best Practice สำหรับ Next.js)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query"], // ช่วยให้เราเห็น SQL ที่รันใน Terminal
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
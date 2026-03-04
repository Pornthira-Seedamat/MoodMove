// prisma/prisma.config.ts (หรือไฟล์ที่ Error แจ้ง)
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. ตั้งค่าการเชื่อมต่อผ่าน Pool และบังคับให้เป็น string เพื่อแก้ Type Error
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. ป้องกันการสร้าง Connection ซ้ำซ้อน (Singleton Pattern) สำหรับ Next.js
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // จุดสำคัญ: ใส่เพื่อให้ TypeScript มั่นใจว่ามี URL แน่นอน
    datasources: { 
      db: { 
        url: connectionString 
      } 
    }, 
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
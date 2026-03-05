import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// 1. ป้องกันการสร้าง Connection ซ้ำซ้อน (Singleton Pattern) สำหรับ Next.js
const globalForPrisma = globalThis as unknown as { 
  prisma: ReturnType<typeof prismaClientSingleton> | undefined 
};

const prismaClientSingleton = () => {
  // ใช้ .extends(withAccelerate()) เพื่อรองรับ URL แบบ prisma://
  return new PrismaClient().$extends(withAccelerate());
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// 1. ตรวจสอบว่ามี DATABASE_URL หรือไม่ ถ้าไม่มีให้ใช้ค่าว่างเพื่อไม่ให้แอปพังตอนคอมไพล์
const url = process.env.DATABASE_URL;

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: url, // บังคับส่งค่า URL เข้าไปตรงๆ ที่นี่
      },
    },
  }).$extends(withAccelerate());
};

type PrismaClientWithAccelerate = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientWithAccelerate | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
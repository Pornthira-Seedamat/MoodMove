import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// ก๊อปปี้ URL prisma://... ของคุณมาวางตรงนี้เลยครับ (เพื่อทดสอบว่าต่อได้จริงไหม)
const DATABASE_URL_TEST = "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19DaUV6NjhsdzBhNHMySTBsRjYza2EiLCJhcGlfa2V5IjoiMDFLSlpaMEFNQTZaMUtIOUhHN0pGOTZCMjQiLCJ0ZW5hbnRfaWQiOiI5YWE3YjVmOTExOTUyYmE3Njg5NmEwMWYzZTczNmYyZmVjYTlmMjA5MjVhMWNkZjc5YWUyODAxNWFhNWI2Y2UzIiwiaW50ZXJuYWxfc2VjcmV0IjoiMmNjZmJhODctYzZkYi00ZGE1LTgzNTAtZTBlY2U1NDhiNmIzIn0.teWECxEJ4Ok5brVx3j2LYXzAFhhoETKDNc2JKUIxNyI";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL_TEST, // ใช้ค่าที่เราแปะไว้ตรงๆ
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
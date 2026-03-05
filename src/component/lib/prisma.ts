// src/component/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  // เพิ่ม .$extends(withAccelerate()) ต่อท้ายตรงนี้ครับ
  return new PrismaClient().$extends(withAccelerate());
};

type PrismaClientWithAccelerate = ReturnType<typeof prismaClientSingleton>;

declare global {
  var prisma: undefined | PrismaClientWithAccelerate;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
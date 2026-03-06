import { prisma } from "@/component/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ค้นหา User จาก email ใน Prisma
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // เช็คว่าเจอ User ไหม และรหัสผ่านตรงกันไหม
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // ถ้าถูก ส่งข้อมูล User กลับไป (ไม่ต้องส่งรหัสผ่านไปนะ)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
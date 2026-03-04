// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password,
      },
    });

    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      id: user.id,
      email: user.email 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Database error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
  }
}
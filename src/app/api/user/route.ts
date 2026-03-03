// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma'; // ตรวจสอบ Path import ให้ถูกต้อง

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, moodLevel } = body;

    // 1. สร้าง User ใหม่ (สำหรับหน้าสมัครสมาชิก)
    // ในโปรเจกต์จริงควรตรวจสอบ email ซ้ำ และทำ Password Hashing!
    const user = await prisma.user.create({
      data: {
        email,
        name,
        // password: hashedPassword,
      },
    });

    // 2. ถ้ามีการส่ง moodLevel มาด้วย ให้บันทึก Task/History
    if (moodLevel) {
      await prisma.task.create({
        data: {
          title: `Mood check: ${moodLevel}`,
          level: moodLevel,
          userId: user.id, // ใช้ user.id ที่ได้จากฐานข้อมูลโดยตรง
        },
      });
    }

    // ส่ง id ถาวรกลับไปให้ frontend
    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      id: user.id,
      email: user.email 
    }, { status: 201 });

  } catch (error) {
    console.error("Database error:", error);
    // ตรวจสอบ error กรณี email ซ้ำ (P2002)
    return NextResponse.json({ error: "บันทึกไม่สำเร็จหรืออีเมลซ้ำ" }, { status: 500 });
  }
}
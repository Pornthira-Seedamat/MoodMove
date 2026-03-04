// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!email || !username || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 2. บันทึกข้อมูลลงฐานข้อมูล
    // หมายเหตุ: ตอนนี้คุณรัน npx prisma generate ผ่านแล้ว 
    // เราสามารถใช้ prisma.user.create ได้โดยตรง ไม่ต้องใช้ (as any) แล้วครับ
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: password, // ในอนาคตแนะนำให้ใช้ bcrypt ช่วย hash รหัสผ่านนะครับ
      },
    });

    // 3. ส่งคำตอบกลับเมื่อสำเร็จ
    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      user: {
        id: user.id,
        username: user.username,
        email: user.email 
      }
    }, { status: 201 });

  } catch (error: any) {
    // แสดง Error ใน Console ของ Vercel เพื่อให้เราหาจุดผิดได้ง่ายขึ้น
    console.error("Registration Error:", error);

    // กรณีอีเมลซ้ำ (Unique Constraint)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "อีเมลหรือชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว" }, { status: 400 });
    }

    // กรณีอื่นๆ เช่น ติดต่อฐานข้อมูลไม่ได้
    return NextResponse.json({ 
      error: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่ภายหลัง",
      details: error.message 
    }, { status: 500 });
  }
}
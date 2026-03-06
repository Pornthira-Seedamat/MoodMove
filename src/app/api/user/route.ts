// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma'; 
import bcrypt from 'bcryptjs'; // 1. นำเข้า bcrypt

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 2. เข้ารหัสผ่านก่อนบันทึก (Salt round = 10)
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        email: String(email).toLowerCase().trim(),
        username: String(username).trim(),
        password: hashedPassword, // 3. บันทึกตัวที่เข้ารหัสแล้วลงไป
      },
    });

    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      user: { id: user.id, username: user.username, email: user.email } 
    }, { status: 201 });

  } catch (error: any) {
    // Log error ลง Console ของ Server เพื่อดูสาเหตุที่แท้จริง
    console.error("Prisma Registration Error:", error);

    // กรณี Email หรือ Username ซ้ำ (Unique Constraint จาก Prisma)
    if (error.code === 'P2002') {
      const target = error.meta?.target || "ข้อมูลนี้";
      return NextResponse.json({ 
        error: `ขออภัย ${target} ถูกใช้งานไปแล้ว`,
        code: "DUPLICATE_ENTRY"
      }, { status: 400 });
    }

    // กรณีเชื่อมต่อ Database ไม่ได้ หรือ Prisma ยังไม่ได้ Generate
    if (error.message.includes("is not a function") || error.message.includes("Cannot read properties")) {
      return NextResponse.json({ 
        error: "ระบบฐานข้อมูลขัดข้อง (Prisma Client Error)",
        details: "โปรดตรวจสอบไฟล์ที่ @/component/lib/prisma ว่าตั้งค่าถูกต้องหรือไม่"
      }, { status: 500 });
    }

    // กรณี Error อื่นๆ ทั่วไป
    return NextResponse.json({ 
      error: "เกิดข้อผิดพลาดในการบันทึกข้อมูลลง Database",
      debug: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// เพิ่มฟังก์ชันสำหรับรองรับ Method อื่นๆ เพื่อป้องกัน Error 405
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
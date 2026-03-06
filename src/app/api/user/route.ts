// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma'; 
import bcrypt from 'bcryptjs'; // ต้องรัน npm install bcryptjs ก่อน

export async function POST(request: Request) {
  try {
    // 1. ตรวจสอบว่ามี Body ส่งมาหรือไม่
    const body = await request.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json({ error: "ไม่พบข้อมูลที่ส่งมา (Invalid JSON)" }, { status: 400 });
    }

    const { email, username, password } = body;

    // 2. Validation ขั้นพื้นฐาน
    if (!email || !username || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 3. ทำความสะอาดข้อมูล (Data Sanitization)
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanUsername = String(username).trim();

    // 4. เข้ารหัสผ่าน (Hashing Password) ด้วย bcrypt
    // เลข 10 คือ Salt Rounds ยิ่งเยอะยิ่งปลอดภัยแต่ยิ่งใช้เวลาคำนวณนาน
    const hashedPassword = await bcrypt.hash(String(password), 10);

    // 5. บันทึกลงฐานข้อมูลผ่าน Prisma
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        username: cleanUsername,
        password: hashedPassword, // บันทึกตัวที่เข้ารหัสแล้ว
      },
    });

    // 6. Return ข้อมูลกลับไป (ไม่ส่ง password กลับไปเพื่อความปลอดภัย)
    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      } 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Prisma Registration Error:", error);

    // กรณี Email หรือ Username ซ้ำ (Unique Constraint)
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || "ข้อมูลนี้";
      return NextResponse.json({ 
        error: `ขออภัย ${field} ถูกใช้งานไปแล้ว`,
        code: "DUPLICATE_ENTRY"
      }, { status: 400 });
    }

    // กรณี Error อื่นๆ
    return NextResponse.json({ 
      error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      debug: error.message,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
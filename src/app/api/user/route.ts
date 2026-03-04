// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
// ตรวจสอบให้แน่ใจว่า path @/component/lib/prisma มีการ export const prisma = new PrismaClient() ไว้จริงๆ
import { prisma } from '@/component/lib/prisma'; 

export async function POST(request: Request) {
  try {
    // 1. ตรวจสอบว่ามี Body ส่งมาหรือไม่ และจัดการ Error กรณี JSON พัง
    const body = await request.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json({ error: "ไม่พบข้อมูลที่ส่งมา (Invalid JSON)" }, { status: 400 });
    }

    const { email, username, password } = body;

    // 2. Validation ขั้นพื้นฐานก่อนส่งเข้า Prisma
    if (!email || !username || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 3. ทำความสะอาดข้อมูล (Data Sanitization)
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanUsername = String(username).trim();

    // 4. บันทึกลงฐานข้อมูลผ่าน Prisma
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        username: cleanUsername,
        password: String(password), // ในอนาคตแนะนำให้ใช้ bcrypt hash ก่อนบันทึก
      },
    });

    // 5. Return ข้อมูลกลับไปที่หน้าบ้าน (ไม่ส่ง password กลับไปเพื่อความปลอดภัย)
    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      } 
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
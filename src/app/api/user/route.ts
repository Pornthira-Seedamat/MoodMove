// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
// ตรวจสอบว่า Path ตรงกับที่เก็บไฟล์ prisma instance ของคุณ (เช่น @/prisma/index หรือ @/lib/prisma)
import { prisma } from '@/component/lib/prisma'; 

export async function POST(request: Request) {
  try {
    // เพิ่มการดักจับกรณี Body ว่างเปล่า
    const body = await request.json().catch(() => ({}));
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: String(email).toLowerCase().trim(), // ป้องกันปัญหาเรื่องตัวพิมพ์เล็ก/ใหญ่และช่องว่าง
        username: String(username).trim(),
        password: String(password), 
      },
    });

    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      user: { id: user.id, username: user.username, email: user.email } 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error Detail:", error.message);

    if (error.code === 'P2002') {
      return NextResponse.json({ error: "อีเมลหรือชื่อผู้ใช้นี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    // ส่งข้อความ Error กลับไปดูที่หน้าบ้านเพื่อช่วยให้เราแก้จุดที่พังได้ง่ายขึ้น
    return NextResponse.json({ 
      error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      debug: error.message // บรรทัดนี้จะบอกเราว่า Database พังตรงไหน
    }, { status: 500 });
  }
}
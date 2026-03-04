// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
// ตรวจสอบว่า Path ตรงกับที่เก็บไฟล์ prisma instance ของคุณ (เช่น @/prisma/index หรือ @/lib/prisma)
import { prisma } from '@/component/lib/prisma'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // 1. ตรวจสอบข้อมูลเบื้องต้น (Validation)
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, 
        { status: 400 }
      );
    }

    // 2. บันทึกข้อมูลลงฐานข้อมูล
    // ใช้ prisma.user.create ได้ทันทีเพราะเราเซ็ตอัป Client เรียบร้อยแล้ว
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: password, // เก็บแบบ Plain text ตามที่คุณใช้งานตอนนี้
      },
    });

    // 3. ส่งคำตอบกลับเมื่อสำเร็จ (ไม่ส่ง Password กลับไปเพื่อความปลอดภัย)
    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      user: {
        id: user.id,
        username: user.username,
        email: user.email 
      }
    }, { status: 201 });

  } catch (error: any) {
    // พิมพ์ Error ออกทาง Console เพื่อดูผ่าน Vercel Logs
    console.error("Registration Error:", error);

    // กรณี P2002: อีเมลซ้ำ (Unique constraint failed)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "อีเมลหรือชื่อผู้ใช้นี้ถูกใช้งานแล้ว" }, 
        { status: 400 }
      );
    }

    // กรณีข้อผิดพลาดอื่นๆ (เช่น เชื่อมต่อ Database ไม่ได้)
    return NextResponse.json(
      { 
        error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}
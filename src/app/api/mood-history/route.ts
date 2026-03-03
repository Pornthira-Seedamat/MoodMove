// src/app/api/mood-history/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, moodKey, moodLevel, stepsCompleted } = body;

    if (!userId) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้งาน" }, { status: 400 });
    }

    // แก้ไขส่วน data ให้มีค่า day และ user ตามที่ TypeScript/Prisma ต้องการ
    const history = await prisma.statusHistory.create({
      data: {
        userId: userId,
        moodKey: moodKey,
        moodLevel: Number(moodLevel), // ป้องกันกรณีส่งมาเป็น String
        stepsCompleted: stepsCompleted || {}, 
        day: new Date().getDate(), // เพิ่มวันที่ 1-31 เพื่อให้ Build ผ่าน
      },
    });

    return NextResponse.json({ message: "บันทึกประวัติสำเร็จ", id: history.id }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "ไม่สามารถบันทึกประวัติได้" }, { status: 500 });
  }
}
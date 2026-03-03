// src/app/api/mood-history/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma'; // ตรวจสอบ Path import ให้ถูกต้อง

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, moodKey, moodLevel, stepsCompleted } = body;

    // ตรวจสอบว่ามี userId หรือไม่
    if (!userId) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้งาน" }, { status: 400 });
    }

    // บันทึกประวัติลงตาราง StatusHistory
    const history = await prisma.statusHistory.create({
      data: {
        userId: userId,
        moodKey: moodKey,
        moodLevel: moodLevel,
        // day จะถูกตั้งค่าเป็นวันที่ปัจจุบันอัตโนมัติจาก createdAt ใน schema
        // หรือถ้าต้องการระบุวันที่เอง ให้เพิ่ม field day ใน data นี้
        stepsCompleted: stepsCompleted, // บันทึกเป็น JSON
      },
    });

    return NextResponse.json({ message: "บันทึกประวัติสำเร็จ", history }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "ไม่สามารถบันทึกประวัติได้" }, { status: 500 });
  }
}
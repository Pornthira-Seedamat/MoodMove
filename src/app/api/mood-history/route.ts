import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma';

// --- 1. ส่วนดึงข้อมูล (GET) ---
// ดึงข้อมูลประวัติการบันทึกอารมณ์
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // ถ้ามีการส่ง userId มา ให้ดึงเฉพาะของคนนั้น ถ้าไม่ส่งมาให้ดึงทั้งหมด (เพื่อความยืดหยุ่น)
    const history = await prisma.statusHistory.findMany({
      where: userId ? { userId: String(userId) } : {},
      orderBy: {
        createdAt: 'desc' // แนะนำให้ใช้ createdAt ถ้ามีใน Schema เพื่อความแม่นยำของเวลา
      },
      take: 31 
    });
    
    return NextResponse.json(history);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

// --- 2. ส่วนบันทึกข้อมูล (POST) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, moodKey, moodLevel, stepsCompleted } = body;

    // ตรวจสอบ userId เพราะเป็นหัวใจหลักในการเชื่อมตาราง
    if (!userId) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้งาน (userId is required)" }, { status: 400 });
    }

    const history = await prisma.statusHistory.create({
      data: {
        userId: String(userId), 
        moodKey: moodKey || 'happy',
        moodLevel: Number(moodLevel) || 3, // ค่าเริ่มต้นเป็น 3 (ปกติ)
        stepsCompleted: stepsCompleted || {}, // เก็บเป็น Json 
        day: new Date().getDate(), // เก็บวันที่ 1-31
      },
    });

    return NextResponse.json({ 
      message: "บันทึกประวัติสำเร็จ", 
      id: history.id 
    }, { status: 201 });

  } catch (error: any) {
    console.error("History error details:", error);
    return NextResponse.json({ 
      error: "ไม่สามารถบันทึกประวัติได้", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
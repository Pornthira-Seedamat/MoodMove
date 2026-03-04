import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma';

// --- 1. ส่วนดึงข้อมูล (GET) เพื่อให้หน้าประวัติและสถิติมีข้อมูลล่าสุดแสดง ---
export async function GET() {
  try {
    const history = await prisma.statusHistory.findMany({
      orderBy: {
        id: 'desc' // ดึง ID ล่าสุดขึ้นก่อนเสมอ แก้ปัญหาประวัติไม่อัปเดตอันล่าสุด
      },
      take: 31 // ดึงมาเผื่อสำหรับข้อมูลทั้งเดือน
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

    if (!userId) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้งาน" }, { status: 400 });
    }

    // แก้ไขจุดนี้: เปลี่ยนจาก String เป็น Number เพื่อให้ Build ผ่านตาม Schema
    const history = await prisma.statusHistory.create({
      data: {
        userId: Number(userId), 
        moodKey: moodKey || 'happy',
        moodLevel: Number(moodLevel) || 0,
        stepsCompleted: stepsCompleted || {},
        // บันทึกเลขวันที่ปัจจุบัน
        day: new Date().getDate(), 
      },
    });

    return NextResponse.json({ 
      message: "บันทึกประวัติสำเร็จ", 
      id: history.id 
    }, { status: 201 });

  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ 
      error: "ไม่สามารถบันทึกประวัติได้", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
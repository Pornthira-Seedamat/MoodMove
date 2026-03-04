import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma';

// --- 1. ส่วนดึงข้อมูล (GET) เพื่อให้หน้าประวัติมีข้อมูลล่าสุดแสดง ---
export async function GET(request: Request) {
  try {
    // ในอนาคตควรดึง userId จาก session หรือ query params
    const history = await prisma.statusHistory.findMany({
      orderBy: {
        id: 'desc' // ดึง ID ล่าสุดขึ้นก่อนเสมอ (แก้ปัญหาประวัติไม่เรียงลำดับ)
      },
      take: 20 // ดึงมาแค่ 20 รายการล่าสุด
    });
    return NextResponse.json(history);
  } catch (error) {
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

    // ตรวจสอบค่าก่อนบันทึก
    const history = await prisma.statusHistory.create({
      data: {
        userId: String(userId),
        moodKey: moodKey || 'happy',
        moodLevel: Number(moodLevel) || 0,
        stepsCompleted: stepsCompleted || {},
        // ใช้ getDate() ตามเดิมเพื่อให้เข้ากับ UI หน้า StatusPage ที่คุณมี
        day: new Date().getDate(), 
      },
    });

    return NextResponse.json({ 
      message: "บันทึกประวัติสำเร็จ", 
      id: history.id 
    }, { status: 201 });

  } catch (error) {
    console.error("History error:", error);
    // ส่ง error ที่ละเอียดขึ้นไปที่ console เพื่อ debug ง่ายขึ้น
    return NextResponse.json({ 
      error: "ไม่สามารถบันทึกประวัติได้", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma';

// --- [GET] ดึงประวัติทั้งหมดของ User ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || userId === "undefined" || userId === "null") {
      return NextResponse.json({ error: "กรุณาระบุ userId" }, { status: 400 });
    }

    const history = await prisma.statusHistory.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: 'desc' },
      take: 31 
    });
    
    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Fetch history error:", error.message);
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว", details: error.message }, { status: 500 });
  }
}

// --- [POST] บันทึกอารมณ์ใหม่ ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, moodKey, moodLevel, stepsCompleted, day } = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!userId || userId === "undefined" || userId === "null") {
      return NextResponse.json({ error: "ไม่พบ ID ผู้ใช้งานที่ถูกต้อง" }, { status: 400 });
    }

    // สร้างข้อมูลใน StatusHistory
    const history = await prisma.statusHistory.create({
      data: {
        userId: String(userId), 
        moodKey: moodKey || 'happy',
        moodLevel: Number(moodLevel) || 3,
        // สำคัญ: จัดการ stepsCompleted ให้เป็น Object เสมอ
        stepsCompleted: stepsCompleted || {}, 
        // แปลง day ให้เป็น Number เพื่อรองรับ SQLite/Prisma Int field
        day: day ? Number(day) : new Date().getDate(),
      },
    });

    return NextResponse.json(history, { status: 201 });
  } catch (error: any) {
    // พ่น error ลง terminal เพื่อดูสาเหตุที่แท้จริง (เช่น database connection)
    console.error("PRISMA POST ERROR:", error);
    return NextResponse.json({ 
      error: "บันทึกประวัติล้มเหลว", 
      details: error.message 
    }, { status: 500 });
  }
}

// --- [PATCH] อัปเดต Step (ติ๊กถูกในหน้า Status) ---
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) return NextResponse.json({ error: "ไม่พบ ID ที่ต้องการอัปเดต" }, { status: 400 });

    const updated = await prisma.statusHistory.update({
      where: { id: String(id) },
      data: { stepsCompleted: body.stepsCompleted }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update error:", error.message);
    return NextResponse.json({ error: "Update failed", details: error.message }, { status: 500 });
  }
}

// --- [DELETE] ลบประวัติ ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ไม่พบ ID ที่ต้องการลบ" }, { status: 400 });

    await prisma.statusHistory.delete({
      where: { id: String(id) }
    });

    return NextResponse.json({ message: "ลบประวัติสำเร็จ" });
  } catch (error: any) {
    console.error("Delete history error:", error.message);
    return NextResponse.json({ error: "ลบล้มเหลว", details: error.message }, { status: 500 });
  }
}
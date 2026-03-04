import { NextResponse } from 'next/server';
import { prisma } from '@/component/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const history = await prisma.statusHistory.findMany({
      where: userId ? { userId: String(userId) } : {},
      orderBy: {
        createdAt: 'desc' 
      },
      take: 31 
    });
    
    return NextResponse.json(history);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, moodKey, moodLevel, stepsCompleted } = body;

    if (!userId) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้งาน (userId is required)" }, { status: 400 });
    }

    const history = await prisma.statusHistory.create({
      data: {
        userId: String(userId), 
        moodKey: moodKey || 'happy',
        moodLevel: Number(moodLevel) || 3,
        stepsCompleted: stepsCompleted || {}, 
        day: new Date().getDate(),
      },
    });

    return NextResponse.json({ 
      message: "บันทึกประวัติสำเร็จ", 
      id: history.id 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ 
      error: "ไม่สามารถบันทึกประวัติได้", 
      details: error.message 
    }, { status: 500 });
  }
}

// เพิ่ม DELETE เพื่อให้ลบข้อมูลได้จริง
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.statusHistory.delete({
      where: { id: Number(id) }
    });
    return NextResponse.json({ message: "ลบสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "ลบล้มเหลว" }, { status: 500 });
  }
}
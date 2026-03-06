import { prisma } from "@/component/lib/prisma"; // <--- เช็คว่า path นี้มีไฟล์ prisma.ts อยู่จริงไหมimport { NextResponse } from "next/server";

export async function POST(req: Request) {
  try 
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // ค้นหาผู้ใช้
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // ถ้าไม่เจอ user หรือรหัสไม่ตรง
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // ลบรหัสผ่านก่อนส่งกลับไปที่หน้าบ้าน
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });

  } catch (error) {
    console.error("❌ Login Error:", error);
    // ถ้าพังตรงนี้ จะขึ้นว่า "เกิดข้อผิดพลาดเซิร์ฟเวอร์"
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
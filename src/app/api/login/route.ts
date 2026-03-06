import { NextResponse } from "next/server";
import { prisma } from "@/component/lib/prisma"; 
import bcrypt from "bcryptjs"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. ตรวจสอบเบื้องต้น
    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    // 2. ค้นหาผู้ใช้
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // --- 🔍 ส่วน DEBUG เริ่มตรงนี้ ---
    console.log("-----------------------------------------");
    console.log("1. Email ที่รับมาจากหน้าบ้าน:", email);
    console.log("2. เจอ User ใน DB ไหม:", user ? "เจอ ✅" : "ไม่เจอ ❌");
    
    if (user) {
      const check = await bcrypt.compare(String(password), user.password);
      console.log("3. รหัสผ่านตรงกันไหม (bcrypt.compare):", check ? "ตรงกัน ✨" : "ไม่ตรง ⚠️");
      console.log("4. รหัสใน DB ขึ้นต้นด้วย $2a$ ไหม:", user.password.startsWith("$2a$") ? "ใช่ (เป็น Hash)" : "ไม่ใช่ (เป็นข้อความธรรมดา)");
      console.log("5. ค่ารหัสใน DB จริงๆ คือ:", user.password);
    }
    console.log("-----------------------------------------");
    // --- 🔍 จบส่วน DEBUG ---

    // 3. ตรวจสอบเงื่อนไข Login
    const isPasswordCorrect = user 
      ? await bcrypt.compare(String(password), user.password) 
      : false;

    if (!user || !isPasswordCorrect) {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, 
        { status: 401 }
      );
    }

    // 4. ส่งข้อมูลกลับ
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      message: "เข้าสู่ระบบสำเร็จ",
      user: userWithoutPassword 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ 
      error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      debug: error.message 
    }, { status: 500 });
  }
}
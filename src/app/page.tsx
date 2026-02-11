"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function MoodMove() {
  // เก็บสถานะอารมณ์ที่เลือก
  const [mood, setMood] = useState('tired');

  // ข้อมูลสีพื้นหลังตามอารมณ์
  const moodData: Record<string, { color: string; label: string }> = {
    angry: { color: 'bg-[#C34A4A]', label: 'โกรธ?' },
    tired: { color: 'bg-[#5B7EE3]', label: 'เหนื่อย?' },
    happy: { color: 'bg-[#F4D03F]', label: 'ดีจัง!' },
    laugh: { color: 'bg-[#F39C12]', label: 'ตลก!' },
    star: { color: 'bg-[#FF8C00]', label: 'สุดยอด!' },
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 flex flex-col items-center ${moodData[mood].color} relative overflow-hidden`}>
      
      {/* Navbar ส่วนบน */}
      <nav className="w-full p-6 flex justify-between items-center max-w-6xl">
        <h1 className="text-3xl font-bold">MoodMove</h1>
        <div className="flex items-center gap-6">
          <span className="border-b-2 border-white cursor-pointer">Home</span>
          <span className="cursor-pointer opacity-80">ประวัติ</span>
          <span className="cursor-pointer opacity-80">สถิติ</span>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-500 text-xl">👤</span>
          </div>
        </div>
      </nav>

      {/* รูปก้อนเมฆ (วางแบบ Absolute ตามรูป) */}
      <div className="absolute top-20 right-10 opacity-80">
        <span className="text-[150px]">☁️</span>
      </div>
      <div className="absolute bottom-10 left-10 opacity-80 scale-x-[-1]">
        <span className="text-[150px]">☁️</span>
      </div>

      {/* ส่วนกลางของหน้าจอ */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="bg-white text-black px-10 py-3 rounded-md shadow-md mb-12">
          <h2 className="text-xl font-medium">วันนี้คุณรู้สึกอย่างไร?</h2>
        </div>

        {/* แถบเลือก Emoji */}
        <div className="relative bg-white rounded-md p-8 flex gap-8 shadow-xl">
          {/* ป้ายข้อความบอกอารมณ์ที่ลอยอยู่บนหัว Emoji */}
          <div className="absolute -top-10 left-1/4 transform -translate-x-1/2">
             <div className="bg-white text-black px-3 py-1 rounded-full text-sm font-bold border-2 border-black relative">
               {moodData[mood].label}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
             </div>
          </div>

          {/* ปุ่ม Emoji ต่างๆ */}
          <button onClick={() => setMood('angry')} className="text-5xl hover:scale-110 transition">😡</button>
          <button 
            onClick={() => setMood('tired')} 
            className={`text-5xl hover:scale-110 transition rounded-full ${mood === 'tired' ? 'ring-4 ring-blue-500 p-1' : ''}`}
          >
            😔
          </button>
          <button onClick={() => setMood('happy')} className="text-5xl hover:scale-110 transition">😊</button>
          <button onClick={() => setMood('laugh')} className="text-5xl hover:scale-110 transition">😄</button>
          <button onClick={() => setMood('star')} className="text-5xl hover:scale-110 transition">🤩</button>
        </div>

        <p className="mt-6 text-white/80 underline decoration-white/40">เลือกอารมณ์ของคุณในวันนี้</p>

        <button className="mt-12 bg-white text-black text-2xl font-bold px-20 py-4 shadow-lg hover:bg-gray-100 transition-transform active:scale-95">
          ยืนยัน
        </button>
      </div>
    </main>
  );
}
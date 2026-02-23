"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem('mood_stats') || '[]');
    // เรียงข้อมูลตามวันที่เพื่อให้เส้นกราฟลากไปในทิศทางที่ถูกต้อง
    const sortedStats = savedStats.sort((a: any, b: any) => a.day - b.day);
    setStats(sortedStats);
  }, []);

  const emojis = ['😡', '😔', '😐', '😊', '🤩'];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-[#C34A4A] flex flex-col items-center relative overflow-hidden">
      <nav className="w-full p-6 flex justify-between items-center max-w-6xl z-30">
        <h1 className="text-3xl font-bold text-white">MoodMove</h1>
        <div className="flex items-center gap-6 text-white">
          <div onClick={() => router.push('/')} className="relative group cursor-pointer">
            <span className="opacity-80 font-bold">Home</span>
          </div>
          <div className="relative group cursor-pointer">
            <span className="font-bold">ประวัติ</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"></div>
          </div>
          <span 
            onClick={() => router.push('/status')} 
            className="cursor-pointer opacity-80 font-bold hover:opacity-100 transition"
          >
            สถิติ
          </span>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl text-blue-500">👤</div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full px-4">
        <div className="bg-white p-8 shadow-2xl rounded-sm max-w-5xl w-full relative min-h-[550px]">
          
          <div className="flex justify-between items-start mb-4">
             <div className="flex flex-col gap-4">
                {emojis.slice().reverse().map((emoji, i) => (
                  <span key={i} className="text-4xl">{emoji}</span>
                ))}
             </div>
             <span className="text-black font-bold text-2xl uppercase">เดือน</span>
          </div>

          <div className="absolute left-20 bottom-24 right-10 top-10 border-l-4 border-b-4 border-black">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* เส้นกราฟเชื่อมต่อ - ไม่ใช้จุดวงกลม ตามคำขอ */}
              {stats.map((point, i) => {
                if (i === 0) return null;
                const prevPoint = stats[i-1];
                
                // คำนวณตำแหน่ง X สำหรับ 30 วัน
                const x1 = ((prevPoint.day - 1) / 29) * 100;
                const x2 = ((point.day - 1) / 29) * 100;
                
                // คำนวณตำแหน่ง Y (level 1-5)
                const y1 = 100 - (prevPoint.level * 20);
                const y2 = 100 - (point.level * 20);

                return (
                  <line 
                    key={`line-${i}`}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={point.color.includes('#') ? point.color : `#${point.color}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ strokeWidth: '6px' }} // ความหนาของเส้นกราฟ 6px
                  />
                )
              })}
            </svg>
            
            <div className="absolute -bottom-10 left-0 w-full flex justify-between px-1">
               {days.map(d => (
                 <span key={d} className={`font-bold text-black ${d % 5 === 0 || d === 1 ? 'text-xl' : 'text-[10px] opacity-50'}`}>
                   {d}
                 </span>
               ))}
            </div>
            <span className="absolute -bottom-12 -right-10 text-2xl font-bold text-black">วันที่</span>
          </div>
        </div>
      </div>
    </main>
  );
}
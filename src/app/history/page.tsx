"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any[]>([]);
  
  // คำนวณเดือนปัจจุบันและจำนวนวันแบบ Real-time
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonthName = currentDate.toLocaleString('th-TH', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // หาวันสุดท้ายของเดือนปัจจุบัน
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // --- แก้ไข Logic การดึงข้อมูลให้ดึงจาก API ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('moodmove_user') || '{}');
        const userId = savedUser.id;

        if (!userId) return;

        // ✅ แก้ไข URL เป็น /api/mood-history
        const response = await fetch(`/api/mood-history?userId=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          const processedStats = data
            .map((item: any) => ({
              ...item,
              level: Number(item.moodLevel) || 3, 
              color: item.moodKey === 'angry' ? '#C34A4A' : 
                     item.moodKey === 'tired' ? '#5B7EE3' :
                     item.moodKey === 'happy' ? '#F4D03F' :
                     item.moodKey === 'laugh' ? '#F39C12' : '#FF8C00'
            }))
            .filter((item: any) => {
              // กรองเฉพาะเดือนปัจจุบัน
              const itemDate = new Date(item.createdAt);
              return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
            })
            .sort((a: any, b: any) => a.day - b.day);

          setStats(processedStats);
        }
      } catch (error) {
        console.error("Fetch history error:", error);
      }
    };
    fetchStats();
  }, [currentMonth, currentYear]);

  const emojis = ['😡', '😔', '😐', '😊', '🤩'];

  const getXPos = (day: number, index: number) => {
    const totalDays = daysInMonth > 1 ? daysInMonth - 1 : 1;
    const base = ((day - 1) / totalDays) * 100;
    // ป้องกันเส้นซ้อนกันในวันเดียวกัน
    const sameDayEntries = stats.filter((s, idx) => s.day === day && idx < index).length;
    return base + (sameDayEntries * 1.5); 
  };

  const getYPos = (level: number) => 100 - ((Number(level) - 1) / 4) * 100;

  return (
    <main className="min-h-screen bg-[#C34A4A] flex flex-col items-center relative overflow-hidden">
      
      <div onClick={() => router.back()} className="absolute top-8 left-6 z-50 cursor-pointer text-white text-4xl font-light hover:scale-110 transition">←</div>
      <div className="absolute top-12 left-10 text-4xl opacity-20 pointer-events-none">✨</div>
      <div className="absolute bottom-10 right-10 text-7xl opacity-20 pointer-events-none">🌸</div>

      <nav className="w-full p-6 flex justify-between items-center max-w-6xl z-30 ml-12">
        <h1 className="text-3xl font-bold text-white">MoodMove</h1>
        <div className="flex items-center gap-6 text-white font-bold">
          <span onClick={() => router.push('/')} className="cursor-pointer">Home</span>
          <div className="relative cursor-pointer">
            <span>สถิติ</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"></div>
          </div>
          <span onClick={() => router.push('/status')} className="cursor-pointer">ประวัติ</span>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl overflow-hidden">👤</div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full px-4 mb-10">
        <div className="bg-white p-8 shadow-2xl rounded-sm max-w-[95%] w-full relative min-h-[550px]">
          
          <div className="flex justify-between items-start mb-4">
             <div className="w-10"></div> 
             <span className="text-black font-bold text-2xl uppercase mr-4">{currentMonthName}</span>
          </div>

          <div className="absolute left-20 bottom-24 right-16 top-10">
            <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between items-center z-20 py-0">
               {emojis.slice().reverse().map((emoji, i) => (
                 <span 
                   key={i} 
                   className="text-2xl leading-none flex items-center justify-center"
                   style={{ height: '0px', marginTop: i === 0 ? '0%' : '25%' }}
                 >
                   {emoji}
                 </span>
               ))}
            </div>

            <div className="absolute inset-0 border-l-[4px] border-b-[4px] border-black pointer-events-none"></div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {stats.map((point, i) => {
                if (i === 0) return null;
                const prev = stats[i-1];
                const x1 = getXPos(prev.day, i - 1);
                const y1 = getYPos(prev.level);
                const x2 = getXPos(point.day, i);
                const y2 = getYPos(point.level);

                return (
                  <line 
                    key={`line-${i}`}
                    x1={`${x1}%`} y1={`${y1}%`}
                    x2={`${x2}%`} y2={`${y2}%`}
                    stroke={point.color || "#4A90E2"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>
            
            <div className="absolute -bottom-8 left-0 w-full flex justify-between px-1">
               {days.map(d => (
                 <span key={d} className={`font-bold text-black ${d % 5 === 0 || d === 1 || d === daysInMonth ? 'text-lg' : 'text-[10px]'}`}>
                    {d}
                 </span>
               ))}
            </div>
            <span className="absolute -bottom-10 -right-12 text-lg font-bold text-black">วันที่</span>
          </div>
        </div>
      </div>
    </main>
  );
}
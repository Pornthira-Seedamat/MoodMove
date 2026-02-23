"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function StatusPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem('mood_stats') || '[]');
    setStats(savedStats);
  }, []);

  const moodDetails: Record<string, any> = {
    angry: { icon: '😡', bg: 'bg-[#C34A4A]', label: 'โกรธ', bgIcon: '💢' },
    tired: { icon: '😔', bg: 'bg-[#5B7EE3]', label: 'เศร้า', bgIcon: '🌧️' },
    happy: { icon: '😐', bg: 'bg-[#F4D03F]', label: 'ปกติ', bgIcon: '☀️' },
    laugh: { icon: '😊', bg: 'bg-[#F39C12]', label: 'ดีจัง', bgIcon: '🌳' },
    star: { icon: '🤩', bg: 'bg-[#FF8C00]', label: 'สุดยอด', bgIcon: '🔥' },
  };

  // ฟังก์ชันดึงรายละเอียดท่าออกกำลังกายตามอารมณ์ (ให้ตรงกับ Logic หน้าเล่น)
  const getExerciseByMood = (moodKey: string) => {
    const sets: Record<string, { title: string; detail: string }[]> = {
      angry: [
        { title: "STEP 1 : Shadow boxing", detail: "ระบายไฟ 1 นาที" },
        { title: "STEP 2 : Squat เร็วๆ", detail: "20 ครั้ง (เน้นเร็ว+แรง)" },
        { title: "STEP 3 : Mountain climber", detail: "30 วินาที" },
        { title: "STEP 4 : Push-up", detail: "10-15 ครั้ง" },
        { title: "STEP 5 : Plank กำหมัด", detail: "1 นาที" }
      ],
      tired: [
        { title: "STEP 1 : ยืดอกพิงกำแพง", detail: "ค้างไว้ 1 นาที" },
        { title: "STEP 2 : Cat–Cow", detail: "ขยับเบาๆ 1 นาที" },
        { title: "STEP 3 : Glute bridge", detail: "15 ครั้ง" },
        { title: "STEP 4 : เดินอยู่กับที่", detail: "เดินช้าๆ 2 นาที" }
      ],
      happy: [
        { title: "STEP 1 : Squat 15 ครั้ง", detail: "รักษาฟอร์มให้ดี" },
        { title: "STEP 2 : Push-up 10 ครั้ง", detail: "อกแตะพื้น" },
        { title: "STEP 3 : Glute bridge", detail: "15 ครั้ง" },
        { title: "STEP 4 : Plank 40 วินาที", detail: "เกร็งหน้าท้อง" }
      ],
      laugh: [
        { title: "STEP 1 : Jump squat", detail: "40 วิ / พัก 20 วิ" },
        { title: "STEP 2 : Mountain climber", detail: "40 วิ / พัก 20 วิ" },
        { title: "STEP 3 : Push-up", detail: "40 วิ / พัก 20 วิ" },
        { title: "STEP 4 : High knees", detail: "วิ่งยกเข่าสูง 40 วิ" },
        { title: "STEP 5 : Burpees", detail: "40 วิ / พัก 20 วิ" }
      ],
      star: [
        { title: "STEP 1 : Push-up 100 ครั้ง", detail: "แบ่งเซ็ตตามไหว" },
        { title: "STEP 2 : Squat 150 ครั้ง", detail: "ทำให้ครบจำนวน" },
        { title: "STEP 3 : Plank รวม 3 นาที", detail: "ห้ามหลังแอ่น" },
        { title: "STEP 4 : Wall sit 2 นาที", detail: "พิงกำแพงค้างไว้" }
      ]
    };
    return sets[moodKey] || sets['happy'];
  };

  const handleDelete = (id: number) => {
    const updated = stats.filter(item => item.id !== id);
    setStats(updated);
    localStorage.setItem('mood_stats', JSON.stringify(updated));
    setDeleteTarget(null);
  };

  return (
    <main className="min-h-screen bg-[#C34A4A] flex flex-col items-center relative overflow-hidden">
      <nav className="w-full p-6 flex justify-between items-center max-w-6xl z-30">
        <h1 className="text-3xl font-bold text-white">MoodMove</h1>
        <div className="flex items-center gap-6 text-white">
          <div onClick={() => router.push('/')} className="relative group cursor-pointer text-white">
            <span className="opacity-100 font-bold">Home</span>
          </div>
          <div onClick={() => router.push('/history')} className="relative group cursor-pointer text-white">
            <span className="opacity-100 font-bold">ประวัติ</span>
          </div>
          <div className="relative group cursor-pointer text-white">
            <span className="font-bold opacity-100">สถิติ</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl text-blue-500 cursor-pointer">👤</div>
        </div>
      </nav>

      <button onClick={() => router.back()} className="absolute top-24 left-10 text-5xl text-white z-40">‹</button>

      <div className="flex-1 flex flex-col items-center justify-start z-10 w-full px-4 pt-10">
        <div className="bg-white p-8 shadow-2xl rounded-sm max-w-4xl w-full relative min-h-[600px] flex flex-col border-none">
          
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className="absolute top-6 right-8 text-3xl text-black hover:scale-110 transition"
          >
            {isEditMode ? '✕' : '✎'}
          </button>

          <div className="flex justify-between items-center mb-8 px-4 border-b-2 border-black pb-2">
            <span className="text-black font-bold text-2xl">วันที่</span>
            <span className="text-black font-bold text-2xl">ออกกำลังกาย</span>
            <span className="text-black font-bold text-2xl">อารมณ์</span>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[450px] pr-2">
            {stats.map((item) => {
              const moodKey = item.moodKey || 'happy';
              const mood = moodDetails[moodKey];
              const isExpanded = expandedId === item.id;
              const currentExercises = getExerciseByMood(moodKey);

              return (
                <div key={item.id} className="relative flex items-center gap-4">
                  <div 
                    onClick={() => !isEditMode && setExpandedId(isExpanded ? null : item.id)}
                    className={`flex-1 ${mood.bg} p-4 rounded-sm flex items-center justify-between cursor-pointer shadow-md min-h-[100px] relative overflow-hidden transition-all duration-300`}
                  >
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 text-6xl opacity-40 pointer-events-none">
                      {mood.bgIcon}
                    </div>

                    <span className="text-2xl font-bold text-black z-10 w-12 text-center opacity-100">{item.day}</span>
                    
                    <div className="flex-1 px-8 z-10">
                      <AnimatePresence mode="wait">
                        {isExpanded ? (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 py-2"
                          >
                            {currentExercises.map((ex, idx) => (
                              <div key={idx} className="flex justify-between items-start text-black font-bold">
                                <div>
                                  <p className="text-lg uppercase opacity-100">{ex.title}</p>
                                  <p className="text-sm ml-4 opacity-100">{ex.detail}</p>
                                </div>
                                {/* วงกลม Checkbox สำหรับโหมดกางออก */}
                                <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center bg-white shrink-0">
                                  {item.stepsCompleted?.[idx] && <span className="text-black font-bold">✓</span>}
                                </div>
                              </div>
                            ))}
                            <button 
                              onClick={(e) => { e.stopPropagation(); router.push('/'); }}
                              className="bg-white text-black px-4 py-1 font-bold mt-2 shadow-sm border border-black hover:bg-gray-100 transition"
                            >
                              ดำเนินการต่อ
                            </button>
                          </motion.div>
                        ) : (
                          <div className="flex flex-col gap-2 items-center">
                            {/* แสดง Step จริงๆ ตามจำนวนท่าของอารมณ์นั้น (ไม่ fix แค่ 3 ท่า) */}
                            {currentExercises.map((ex, idx) => (
                              <div key={idx} className="flex items-center gap-4 w-full justify-center">
                                <span className="text-black font-bold text-lg opacity-100">
                                  {ex.title.split(":")[0].trim().toLowerCase()} {/* แสดงเป็น step 1, step 2 */}
                                </span>
                                {/* วงกลม Checkbox: จะขึ้น ✓ เฉพาะท่าที่ทำเสร็จแล้วในข้อมูล item.stepsCompleted */}
                                <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center bg-white text-black font-bold">
                                  {item.stepsCompleted?.[idx] && '✓'}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    <span className="text-5xl z-10 opacity-100">{mood.icon}</span>
                  </div>

                  {isEditMode && (
                    <motion.button 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setDeleteTarget(item.id)}
                      className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center text-2xl font-bold text-black hover:bg-white/20 shrink-0"
                    >
                      ✕
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Modal ยืนยันการลบ */}
      <AnimatePresence>
        {deleteTarget !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-0 border-2 border-black shadow-2xl max-w-sm w-full text-center overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black opacity-100">คุณต้องการลบ?</h3>
              </div>
              <div className="flex border-t-2 border-black">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-4 bg-gray-200 text-black font-bold text-xl hover:bg-gray-300 border-r-2 border-black">
                  ยกเลิก
                </button>
                <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-4 bg-[#C34A4A] text-white font-bold text-xl hover:bg-red-700">
                  ลบ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
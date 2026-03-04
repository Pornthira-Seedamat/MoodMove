"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const quotes = [
  "ตื่นเต้นกว่าวัดใจ คือวัดรอบเอว", "เหงื่อที่ไหล คือไขมันที่ร้องไห้", "วันนี้ไม่ไหว วันหน้าค่อยว่ากัน",
  "สุขภาพดีไม่มีขาย อยากได้ต้องทำเอง", "แค่เริ่มเดิน ก็ถือว่าชนะใจตัวเองแล้ว", "อุปสรรคที่น่ากลัวที่สุด คือใจของเราเอง",
  "กินเหมือนปล้น ออกกำลังกายเหมือนโดนป้ายยา", "ร่างกายไม่ใช่ถังขยะ อย่าเอาของไม่ดีใส่ลงไป", "เจ็บตอนนี้ ดีกว่าป่วยวันหน้า",
  "ไม่มีคำว่าสาย สำหรับการเริ่มต้น", "ความพยายามไม่เคยทรยศใคร ยกเว้นคนที่ไม่ทำอะไรเลย", "ออกกำลังกายวันละนิด จิตแจ่มใส พุงหายไปทีละหน่อย"
];

const encouragementQuotes = [
  "เก่งมาก! ร่างกายต้องขอบคุณคุณแน่ๆ",
  "สุดยอดไปเลย! วันนี้คุณชนะใจตัวเองแล้ว",
  "ภูมิใจในตัวคุณนะ พักผ่อนให้เต็มที่ล่ะ",
  "Mission Accomplished! พรุ่งนี้มาเจอกันใหม่นะ",
  "คุณทำได้! ร่างกายแข็งแรงขึ้นอีกระดับแล้ว"
];

const exerciseDataByMood: Record<string, { id: number; name: string; duration: number; gif?: string; img?: string }[]> = {
  angry: [
    { id: 1, name: "Shadow boxing (1 นาที)", duration: 60, gif: "/boxing.gif" },
    { id: 2, name: "Squat เร็วๆ (20 ครั้ง)", duration: 30, gif: "/squats.gif" },
    { id: 3, name: "Mountain climber (30 วิ)", duration: 30, gif: "/mountain.gif" },
    { id: 4, name: "Push-up (15 ครั้ง)", duration: 40, gif: "/pushups.gif" },
    { id: 5, name: "Plank กำหมัดแน่นๆ (1 นาที)", duration: 60, img: "/plank.jpg" }
  ],
  tired: [
    { id: 1, name: "ยืดอกพิงกำแพง (1 นาที)", duration: 60, img: "/stretching.jpg" },
    { id: 2, name: "Cat–Cow (1 นาที)", duration: 60, gif: "/cat-cow.gif" },
    { id: 3, name: "Glute bridge (15 ครั้ง)", duration: 40, gif: "/bridge.gif" },
    { id: 4, name: "เดินอยู่กับที่ช้าๆ (2 นาที)", duration: 120, gif: "/walking.gif" }
  ],
  happy: [
    { id: 1, name: "Squat (15 ครั้ง)", duration: 30, gif: "/squats.gif" },
    { id: 2, name: "Push-up (10 ครั้ง)", duration: 30, gif: "/pushups.gif" },
    { id: 3, name: "Glute bridge (15 ครั้ง)", duration: 40, gif: "/bridge.gif" },
    { id: 4, name: "Plank (40 วิ)", duration: 40, img: "/plank.jpg" }
  ],
  laugh: [
    { id: 1, name: "Jump squat (40 วิ)", duration: 40, gif: "/jump-squat.gif" },
    { id: 2, name: "Mountain climber (40 วิ)", duration: 40, gif: "/mountain.gif" },
    { id: 3, name: "Push-up (40 วิ)", duration: 40, gif: "/pushups.gif" },
    { id: 4, name: "High knees (40 วิ)", duration: 40, gif: "/high-knees.gif" },
    { id: 5, name: "Burpees (40 วิ)", duration: 40, gif: "/burpees.gif" }
  ],
  star: [
    { id: 1, name: "Push-up (รวม 100 ครั้ง)", duration: 180, gif: "/pushups.gif" },
    { id: 2, name: "Squat (150 ครั้ง)", duration: 200, gif: "/squats.gif" },
    { id: 3, name: "Plank รวม (3 นาที)", duration: 180, img: "/plank.jpg" },
    { id: 4, name: "Wall sit (2 นาที)", duration: 120, gif: "/wallsit.gif" }
  ]
};

export default function MoodMove() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUpPage, setIsSignUpPage] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "", password: "", id: "" });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [mood, setMood] = useState('tired');
  const [isWhiteMode, setIsWhiteMode] = useState(true);
  const [step, setStep] = useState(1);
  const [currentQuote, setCurrentQuote] = useState("");
  const [encouragement, setEncouragement] = useState("");
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [preSeconds, setPreSeconds] = useState(10);
  const [isActive, setIsActive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const preTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loopAudioRef = useRef<HTMLAudioElement | null>(null);

  const moodData: Record<string, { color: string; label: string; bgIcon: string; level: number }> = {
    angry: { color: 'bg-[#C34A4A]', label: 'โกรธ?', bgIcon: '💢', level: 1 },
    tired: { color: 'bg-[#5B7EE3]', label: 'เศร้าหรอ?', bgIcon: '🌧️', level: 2 },
    happy: { color: 'bg-[#F4D03F]', label: 'ปกติ', bgIcon: '☀️', level: 3 },
    laugh: { color: 'bg-[#F39C12]', label: 'ดีจัง!', bgIcon: '🌳', level: 4 },
    star: { color: 'bg-[#FF8C00]', label: 'สุดยอด!', bgIcon: '🔥', level: 5 },
  };

  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleSignUp = async () => {
    if (!userData.username || !userData.email || !userData.password) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    if (!validateEmail(userData.email)) {
      alert('กรุณากรอกรูปแบบอีเมลให้ถูกต้อง');
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ดึง ID จาก data.user หรือ data (แล้วแต่โครงสร้าง API ของคุณ)
        const userId = data.user?.id || data.id;
        const userWithId = { 
            id: userId, 
            username: userData.username, 
            email: userData.email, 
            password: userData.password 
        };
        localStorage.setItem('moodmove_user', JSON.stringify(userWithId));
        localStorage.setItem('isLoggedIn', 'true');
        setUserData(userWithId);
        setIsLoggedIn(true);
        setIsSignUpPage(false);
        alert('สมัครสมาชิกสำเร็จ!');
      } else {
        alert(data.error || 'อีเมลนี้อาจถูกใช้งานแล้ว');
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ Prisma');
    }
  };

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem('moodmove_user') || '{}');
    if (loginInput.email === savedUser.email && loginInput.password === savedUser.password && savedUser.email) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setUserData(savedUser);
      setLoginError(false);
      setIsWhiteMode(true);
    } else {
      setLoginError(true);
      alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleConfirmMood = async () => {
    // 1. เริ่มกระบวนการบันทึก
    try {
      const savedUser = JSON.parse(localStorage.getItem('moodmove_user') || '{}');
      const userId = savedUser.id;

      if (!userId) {
        alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const payload = {
        userId: userId,
        moodKey: mood, // อารมณ์ที่เลือก
        moodLevel: Number(moodData[mood].level),
        day: new Date().getDate(), // ส่งเป็น Number ให้ Prisma
        stepsCompleted: {}
      };

      // 2. ส่งข้อมูลไปที่ API
      const response = await fetch('/api/mood-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("บันทึกลงฐานข้อมูลเรียบร้อย!");
        
        // 3. ✅ สำคัญ: ห้าม router.push('/status') ตรงนี้
        // ให้เซตค่าเพื่อเปิดหน้าแนะนำกิจกรรมในหน้านี้แทน
        setIsConfirmed(true); 
        setStep(1); // เริ่มที่ Step 1 ของการแนะนำกิจกรรม
      } else {
        const errorData = await response.json();
        alert("บันทึกไม่สำเร็จ: " + (errorData.details || "เกิดข้อผิดพลาดที่ Server"));
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("การเชื่อมต่อล้มเหลว");
    }
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loop = new Audio("/countdown-loop.mp3");
      loop.loop = true;
      loop.preload = "auto";
      loopAudioRef.current = loop;
    }
  }, []);

  const playAudio = async (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    try {
      audio.currentTime = 0; 
      await audio.play();
    } catch (err) { console.log("Audio play blocked:", err); }
  };

  const stopAudio = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  const currentExerciseSteps = exerciseDataByMood[mood] || exerciseDataByMood['happy'];

  const resetToHome = () => {
    setIsConfirmed(false);
    setStep(1);
    setCurrentExIndex(0);
    setIsActive(false);
    setIsWhiteMode(true);
    stopAudio(loopAudioRef.current);
  };

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const nextValue = prev - 1;
          if (nextValue === 10) playAudio(loopAudioRef.current);
          return nextValue;
        });
      }, 1000);
    } else if (seconds <= 0 && isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAudio(loopAudioRef.current); 
      setIsActive(false);

      if (currentExIndex < currentExerciseSteps.length - 1) {
        setCurrentExIndex(prev => prev + 1);
        setStep(3); 
      } else {
        setEncouragement(encouragementQuotes[Math.floor(Math.random() * encouragementQuotes.length)]);
        setStep(5);
      }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, seconds, currentExIndex, currentExerciseSteps]);

  useEffect(() => {
    if (step === 3) {
      setPreSeconds(10);
      stopAudio(loopAudioRef.current);
      playAudio(loopAudioRef.current);
      preTimerRef.current = setInterval(() => {
        setPreSeconds((prev) => {
          const nextVal = prev - 1;
          if (nextVal <= 0) {
            if (preTimerRef.current) clearInterval(preTimerRef.current);
            stopAudio(loopAudioRef.current); 
            setStep(4);
            setSeconds(currentExerciseSteps[currentExIndex].duration);
            setIsActive(true);
            return 0;
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => { if (preTimerRef.current) clearInterval(preTimerRef.current); };
  }, [step, currentExIndex, currentExerciseSteps]);

  useEffect(() => {
    const savedUser = localStorage.getItem('moodmove_user');
    if (savedUser) { setUserData(JSON.parse(savedUser)); }
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') { setIsLoggedIn(true); }
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const handleMoodSelect = (m: string) => {
    if (m === mood) {
      setIsWhiteMode(!isWhiteMode);
    } else {
      setMood(m);
      setIsWhiteMode(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setShowProfile(false);
    resetToHome();
  };

  return (
    <main className={`min-h-screen transition-colors duration-700 flex flex-col items-center ${!isLoggedIn ? 'bg-white' : (isWhiteMode ? 'bg-white' : moodData[mood].color)} relative overflow-hidden`}>
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div key={isSignUpPage ? "signup" : "login"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4">
              <div className="absolute top-40 left-[15%] text-6xl pointer-events-none">😁</div>
              <div className="absolute top-[45%] left-[10%] text-8xl pointer-events-none">🤩</div>
              <div className="absolute bottom-[10%] right-[15%] text-9xl pointer-events-none">😊</div>
              <div className="absolute bottom-[35%] right-[10%] text-4xl opacity-80 pointer-events-none">😔</div>
              <div className="absolute top-[65%] right-[12%] text-2xl opacity-80 pointer-events-none">😡</div>
              
            <div className="w-full max-w-2xl bg-white border-2 border-black p-10 flex flex-col items-center z-10">
              <h1 className="text-8xl font-black mb-2 text-black">{isSignUpPage ? "Sign Up" : "Login"}</h1>
              <p className="text-xl font-bold text-black mb-8">{isSignUpPage ? "สร้างบัญชีผู้ใช้ใหม่" : "ออกกำลังกายด้วยความรู้สึก ในแต่ละวัน"}</p>
              <div className="w-full space-y-4 max-w-md text-left">
                {isSignUpPage && (
                  <div>
                    <label className="text-2xl font-bold text-black">ชื่อผู้ใช้</label>
                    <input type="text" value={userData.username} onChange={(e) => setUserData({...userData, username: e.target.value})} className="w-full p-3 bg-gray-100 text-black text-xl font-bold outline-none border-2 border-transparent focus:border-black" />
                  </div>
                )}
                <div>
                  <label className="text-2xl font-bold text-black">อีเมล</label>
                  <input type="email" placeholder="example@mail.com" value={isSignUpPage ? userData.email : loginInput.email} onChange={(e) => isSignUpPage ? setUserData({...userData, email: e.target.value}) : setLoginInput({...loginInput, email: e.target.value})} className={`w-full p-3 bg-gray-100 text-black text-xl font-bold outline-none border-2 transition-all ${loginError && !isSignUpPage ? 'border-red-500' : 'border-transparent focus:border-black'}`} />
                </div>
                <div>
                  <label className="text-2xl font-bold text-black">รหัสผ่าน</label>
                  <input type="password" value={isSignUpPage ? userData.password : loginInput.password} onChange={(e) => isSignUpPage ? setUserData({...userData, password: e.target.value}) : setLoginInput({...loginInput, password: e.target.value})} className={`w-full p-3 bg-gray-100 text-black text-xl font-bold outline-none border-2 transition-all ${loginError && !isSignUpPage ? 'border-red-500' : 'border-transparent focus:border-black'}`} />
                </div>
                {!isSignUpPage && (
                  <div className="flex justify-between text-gray-500 font-bold">
                    <span className="cursor-pointer hover:underline" onClick={() => setIsSignUpPage(true)}>สมัครสมาชิก</span>
                    <span className="cursor-pointer">ลืมรหัสผ่าน?</span>
                  </div>
                )}
                {isSignUpPage && (
                  <div className="text-center">
                    <span className="text-gray-500 font-bold cursor-pointer hover:underline" onClick={() => setIsSignUpPage(false)}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</span>
                  </div>
                )}
              </div>
              <button onClick={isSignUpPage ? handleSignUp : handleLogin} className="mt-8 w-full max-w-md bg-black text-white text-3xl font-bold py-4 active:scale-95 transition-transform">
                {isSignUpPage ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="main-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
            <nav className="w-full p-6 flex justify-between items-center max-w-6xl z-30">
              <h1 className={`text-3xl font-bold ${isWhiteMode ? 'text-black' : 'text-white'}`}>MoodMove</h1>
              <div className={`flex items-center gap-6 ${isWhiteMode ? 'text-black' : 'text-white'}`}>
                <div className="relative group cursor-pointer" onClick={resetToHome}>
                  <span className="font-bold">Home</span>
                  {!isWhiteMode && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"></div>}
                </div>
                <div onClick={() => router.push('/history')} className="relative group cursor-pointer">
                  <span className="opacity-80 font-bold">สถิติ</span>
                </div>
                <div onClick={() => router.push('/status')} className="cursor-pointer opacity-80 font-bold hover:opacity-100 transition">ประวัติ</div>
                <div onClick={() => setShowProfile(!showProfile)} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl text-blue-500 cursor-pointer relative">
                  👤
                  <AnimatePresence>
                    {showProfile && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-12 w-64 bg-white border border-gray-300 shadow-xl z-50 overflow-hidden">
                        <div className="bg-black p-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black">👤</div>
                          <span className="text-white font-bold truncate">{userData.username || "User"}</span>
                        </div>
                        <div className="p-3 flex justify-end">
                          <button onClick={handleLogout} className="px-4 py-1 border border-black text-black font-bold hover:bg-gray-100">logout</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </nav>

            <AnimatePresence>
              {isConfirmed && step < 5 && (
                <motion.button 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  onClick={resetToHome} 
                  className={`${isWhiteMode ? 'text-black' : 'text-white'} absolute top-24 left-10 text-5xl z-40`}
                >
                  ‹
                </motion.button>
              )}
            </AnimatePresence>

            <div className="absolute top-20 right-10 text-[150px] opacity-30 pointer-events-none">{moodData[mood].bgIcon}</div>
            <div className="absolute bottom-10 left-10 scale-x-[-1] text-[150px] opacity-30 pointer-events-none">{moodData[mood].bgIcon}</div>

            <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
              <AnimatePresence mode="wait">
                {!isConfirmed ? (
                  <motion.div key="select-mood" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                    <div className="bg-white text-black px-10 py-3 rounded-md shadow-md mb-12 border border-gray-100">
                      <h2 className="text-xl font-bold">วันนี้คุณรู้สึกอย่างไร?</h2>
                    </div>
                    <div className="relative bg-white rounded-md p-8 flex gap-8 shadow-xl border border-gray-50">
                      {Object.keys(moodData).map((m) => (
                        <button 
                          key={m} onClick={() => handleMoodSelect(m)} 
                          className={`text-5xl transition relative z-10 hover:scale-110`}
                        >
                          {mood === m && !isWhiteMode && (
                            <>
                              <motion.div layoutId="active-ring" className="absolute inset-[-10px] ring-4 ring-blue-500 rounded-full" />
                              <motion.div layoutId="mood-label" className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 rounded-full text-sm font-bold border-2 border-black whitespace-nowrap">
                                {moodData[m].label}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                              </motion.div>
                            </>
                          )}
                          <span>{m === 'angry' && '😡'}{m === 'tired' && '😔'}{m === 'happy' && '😐'}{m === 'laugh' && '😊'}{m === 'star' && '🤩'}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={handleConfirmMood} className="mt-12 bg-white text-black text-2xl font-bold px-20 py-4 shadow-lg active:scale-95 border border-gray-200">ยืนยัน</button>
                  </motion.div>
                ) : (
                  <motion.div key={`${step}-${currentExIndex}`} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="relative px-4 w-full flex justify-center">
                    <div className="absolute inset-0 bg-white/40 translate-x-3 translate-y-3 -rotate-2 rounded-sm -z-10 max-w-xl mx-auto"></div>
                    
                    <div className="bg-white p-10 md:p-14 shadow-2xl rounded-sm max-w-xl w-full relative min-h-[450px] flex flex-col">
                      <div className="text-black flex-1 flex flex-col relative">
                        
                        {step === 4 && (
                          <div className="flex-1 flex flex-col">
                            <div className="absolute -top-16 -left-10 bg-[#FDF5E6] p-4 shadow-md border border-gray-200 rotate-[-2deg]">
                              <span className="text-2xl font-bold">จับเวลา 00:{seconds.toString().padStart(2, '0')}</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                              <img 
                                src={currentExerciseSteps[currentExIndex].gif || currentExerciseSteps[currentExIndex].img} 
                                alt="workout" 
                                className="max-h-[300px] object-contain" 
                              />
                            </div>
                            <div className="flex justify-between items-end mt-auto pt-4">
                              <button 
                                onClick={() => { stopAudio(loopAudioRef.current); setSeconds(currentExerciseSteps[currentExIndex].duration); setIsActive(true); }} 
                                className="bg-[#C34A4A] text-white px-6 py-2 font-bold shadow-md"
                              >
                                เริ่มใหม่
                              </button>
                              <button 
                                onClick={() => { isActive ? stopAudio(loopAudioRef.current) : (seconds <= 10 && playAudio(loopAudioRef.current)); setIsActive(!isActive); }} 
                                className="bg-[#C34A4A] text-white px-10 py-2 font-bold shadow-md"
                              >
                                {isActive ? "หยุด" : "เล่นต่อ"}
                              </button>
                            </div>
                          </div>
                        )}

                        {step === 5 && (
                          <div className="flex-1 flex flex-col justify-center items-center text-center">
                            <div className="text-6xl mb-6">🎉</div>
                            <h2 className="text-4xl font-black mb-4 text-black">ยินดีด้วย!</h2>
                            <p className="text-2xl font-bold text-gray-700 italic">"{encouragement}"</p>
                            <div className="w-full flex justify-end mt-auto pt-10">
                              <button onClick={resetToHome} className="text-3xl font-black text-black uppercase hover:translate-x-2 transition-transform">กลับหน้าหลัก ›</button>
                            </div>
                          </div>
                        )}

                        {step < 4 && (
                          <div className="flex-1 flex flex-col justify-center items-center text-center">
                             {step === 1 && (
                               <>
                                 <h2 className="text-2xl font-bold mb-4 text-black">โปรแกรมที่เหมาะสมกับคุณวันนี้</h2>
                                 <div className="text-left space-y-2 text-black font-bold">
                                    {currentExerciseSteps.map(ex => <p key={ex.id}>STEP {ex.id}: {ex.name}</p>)}
                                 </div>
                               </>
                             )}
                             {step === 2 && <h2 className="text-4xl font-bold italic text-black">"{currentQuote}"</h2>}
                             {step === 3 && (
                               <>
                                 <h1 className="text-6xl font-black text-gray-300">STEP {currentExerciseSteps[currentExIndex].id}</h1>
                                 <h2 className="text-3xl font-bold mt-2 text-black">{currentExerciseSteps[currentExIndex].name}</h2>
                                 <p className="mt-4 text-gray-500 font-bold">เตรียมตัว... {preSeconds} วินาที</p>
                               </>
                             )}
                             
                             {step !== 3 && (
                               <div className="w-full flex justify-end mt-auto pt-8">
                                 <button 
                                   onClick={() => setStep(step + 1)} 
                                   className="text-4xl font-black text-black uppercase hover:translate-x-2 transition-transform"
                                 >
                                   {step === 1 ? "ถัดไป" : "เริ่ม"}
                                 </button>
                               </div>
                             )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
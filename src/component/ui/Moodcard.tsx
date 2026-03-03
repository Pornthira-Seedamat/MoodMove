"use client";

interface MoodCardProps {
  emoji: string;
  isActive: boolean;
  onClick: () => void;
}

// src/component/ui/Moodcard.tsx

export default function MoodCard({ emoji, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`text-5xl transition-all duration-300 transform hover:scale-125 
        ${isActive ? 'ring-4 ring-blue-500 rounded-full p-2 scale-110 bg-white/50' : 'grayscale-[30%] hover:grayscale-0'}
      `}
    >
      {emoji}
    </button>
  ); // <--- วงเล็บปิดของ return
} // <--- ** ต้องมีปีกกาอันนี้เพื่อปิดฟังก์ชัน MoodCard **
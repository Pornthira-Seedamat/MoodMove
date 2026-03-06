import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // 🛠 เพิ่มส่วนนี้เพื่อแก้ปัญหา Build พังจาก RAM เต็ม
  typescript: {
    // ข้ามการตรวจ Type ตอน build เพื่อลดการใช้ Memory
    ignoreBuildErrors: true,
  },
  eslint: {
    // ข้ามการตรวจ Lint ตอน build
    ignoreDuringBuilds: true,
  },
  // ปรับปรุงการจัดการหน่วยความจำของ Turbopack (ถ้าคุณใช้)
  experimental: {
    turbo: {
      // สามารถเพิ่ม config ของ turbo ได้ที่นี่หากจำเป็น
    },
  },
};

export default nextConfig;
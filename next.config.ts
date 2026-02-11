import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* การตั้งค่าประสิทธิภาพอื่นๆ */
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // อนุญาตเฉพาะ Unsplash
        port: '',
        pathname: '/**', // อนุญาตทุก Path ภายใต้ Hostname นี้
      },
      {
        protocol: 'https',
        hostname: 'cdn.your-store.com',
        port: '',
        pathname: '/products/**', // อนุญาตเฉพาะรูปในโฟลเดอร์ products
      },
    ],
  },
};

export default nextConfig;
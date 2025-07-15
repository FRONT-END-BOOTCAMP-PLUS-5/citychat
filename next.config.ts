import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["miro.medium.com", "via.placeholder.com", "uofhorang.com"], // 도메인 추가
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: process.env.NEXT_PUBLIC_SUPABASE_HOST || "",
    },
  ],
};

export default nextConfig;

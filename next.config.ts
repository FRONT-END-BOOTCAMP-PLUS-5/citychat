import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    domains: [
      "miro.medium.com",
      "via.placeholder.com",
      "uofhorang.com",
      "images.unsplash.com",
    ], // 도메인 추가
  },
};

export default nextConfig;


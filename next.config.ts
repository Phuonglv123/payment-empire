import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*", // Đường dẫn ảo trên Next.js
        destination: "http://103.161.17.93/:path*", // Đường dẫn thật (HTTP)
      },
    ];
  },
};

export default nextConfig;

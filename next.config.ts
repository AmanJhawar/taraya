import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

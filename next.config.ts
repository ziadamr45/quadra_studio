import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/placeholder",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "build-placeholder-secret",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
};

export default nextConfig;

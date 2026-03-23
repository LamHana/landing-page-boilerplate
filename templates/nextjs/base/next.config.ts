import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  output: "standalone", // Required for Docker VPS deploy
  images: {
    minimumCacheTTL: 2592000, // 30-day image cache
    remotePatterns: [
      // Add your image domains here
      // { protocol: "https", hostname: "your-s3-domain.com", pathname: "/**" }
    ],
  },
  headers: async () => [
    {
      // Immutable cache for hashed Next.js static bundles
      source: "/_next/static/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=2592000, immutable" }],
    },
    {
      // Long-lived cache for public assets
      source: "/:path*.(webp|png|jpg|jpeg|svg|ico|woff2|woff|ttf)",
      headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
    },
  ],
};

export default nextConfig;

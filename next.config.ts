import type { NextConfig } from "next";

const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || process.env.NEXT_DEPLOYMENT_ID;

const nextConfig: NextConfig = {
  ...(deploymentId ? { deploymentId } : {}),
  cacheMaxMemorySize: 50 * 1024 * 1024,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/firebase-messaging-sw.js",
        headers: [{ key: "Service-Worker-Allowed", value: "/push/notifications/" }],
      },
    ];
  },
};

export default nextConfig;

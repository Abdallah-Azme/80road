import type { NextConfig } from "next";

const isMobileBuild = process.env.MOBILE_BUILD === "true";

const nextConfig: NextConfig = {
  // Mobile (Capacitor) builds need static export — files are served from the bundle,
  // not a Node.js server. Web (VPS/Vercel) keeps standalone for SSR/middleware.
  output: isMobileBuild ? "export" : "standalone",
  images: {
    // next/image optimization requires a running server. Static export must disable it.
    unoptimized: isMobileBuild,
    remotePatterns: [
      // Allow all HTTPS image hosts (covers CDNs, S3, etc.)
      { protocol: "https", hostname: "**" },
      // NOTE: HTTP is intentionally removed. ATS (iOS) and NSC (Android API 28+)
      // block HTTP by default. All assets must be served over HTTPS in production.
      { protocol: "https", hostname: "portal.road-80.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Enable static export for cPanel deployment
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
  }),
  images: {
    // Disable image optimization for static export
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        hostname: "api.microlink.io",
      },
      {
        hostname: "cdn.sanity.io",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "localhost",
      },
      {
        hostname: "arif-sir-blog-backend.onrender.com",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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

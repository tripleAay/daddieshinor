import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daddieshinor.com",
      },
      {
        protocol: "https",
        hostname: "www.daddieshinor.com",
      },
    ],
  },
};

export default nextConfig;

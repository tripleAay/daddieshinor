/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // WordPress images
      {
        protocol: "https",
        hostname: "daddieshinor.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.daddieshinor.com",
        pathname: "/wp-content/uploads/**",
      },

      // YouTube thumbnails
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

module.exports = nextConfig;

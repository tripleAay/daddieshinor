/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/wp-proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_WP_URL}/:path*`, // ✅ point proxy to main WP domain
      },
    ];
  },
};

module.exports = nextConfig;

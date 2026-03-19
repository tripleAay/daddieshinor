/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // All paths on your domains (no pathname limit)
      {
        protocol: 'https',
        hostname: 'daddieshinor.com',
      },
      {
        protocol: 'https',
        hostname: 'api.daddieshinor.com',
      },
      {
        protocol: 'https',
        hostname: 'www.daddieshinor.com',
      },
      // Jetpack Photon (almost all WP images get rewritten here)
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
      },
      // YouTube
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      // Optional fallback for http (rare)
      {
        protocol: 'http',
        hostname: 'daddieshinor.com',
      },
      {
        protocol: 'http',
        hostname: 'api.daddieshinor.com',
      },
    ],
  },
};

export default nextConfig;
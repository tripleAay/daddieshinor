/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daddieshinor.com",
      },
      {
        protocol: "https",
        hostname: "api.daddieshinor.com",
      },
      {
        protocol: "https",
        hostname: "www.daddieshinor.com",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "i1.wp.com",
      },
      {
        protocol: "https",
        hostname: "i2.wp.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "http",
        hostname: "daddieshinor.com",
      },
      {
        protocol: "http",
        hostname: "api.daddieshinor.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/category/life-and-real-talk",
        destination: "/life",
        permanent: true,
      },
      {
        source: "/https-daddieshinor-com-how-to-build-a-personal-brand",
        destination: "/essays/how-to-build-a-personal-brand",
        permanent: true,
      },
      {
        source: "/https-daddieshinor-com-should-you-shave-before-a-date",
        destination: "/essays/should-you-shave-before-a-date",
        permanent: true,
      },
      {
        source: "/the-art-of-becoming-unavailable",
        destination: "/essays/the-art-of-becoming-unavailable",
        permanent: true,
      },
      {
        source: "/dreaming-out-loud-reclaiming-aspirations",
        destination: "/essays/dreaming-out-loud-reclaiming-aspirations",
        permanent: true,
      },
      {
        source: "/how-gym-discipline-helped-me-level-up-in-tech-growth",
        destination: "/essays/how-gym-discipline-helped-me-level-up-in-tech-growth",
        permanent: true,
      },
      {
        source: "/before-you-stress-about-your-goals",
        destination: "/essays/before-you-stress-about-your-goals",
        permanent: true,
      },
      {
        source: "/tech-has-made-us-gods-but-we-still-dont-know-what-to-do-with-power",
        destination: "/essays/tech-has-made-us-gods-but-we-still-dont-know-what-to-do-with-power",
        permanent: true,
      },
      {
        source: "/be-so-productive-until-it-feels-illegal-tips",
        destination: "/essays/be-so-productive-until-it-feels-illegal-tips",
        permanent: true,
      },
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "page_id",
            value: "59",
          },
        ],
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
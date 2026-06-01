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
      // Existing redirects
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

      // Search Console 404 Fixes
      {
        source: "/about-daddieshinor",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/how-to-write-10000-words-a-week",
        destination: "/essays/how-to-write-10000-words-a-week",
        permanent: true,
      },
      {
        source: "/smartphone-productivity-your-phone-is-smarter-than-how-you-use-it",
        destination:
          "/essays/smartphone-productivity-your-phone-is-smarter-than-how-you-use-it",
        permanent: true,
      },
      {
        source: "/welcome-to-daddieshinor-the-art-of-building-failing-and-rising-again",
        destination:
          "/essays/welcome-to-daddieshinor-the-art-of-building-failing-and-rising-again",
        permanent: true,
      },
      {
        source: "/are-you-sabotaging-your-creativity",
        destination: "/essays/are-you-sabotaging-your-creativity",
        permanent: true,
      },
      {
        source: "/what-ive-learned-from-road-trips",
        destination: "/essays/what-ive-learned-from-road-trips",
        permanent: true,
      },
      {
        source: "/category/uncategorized/tech-and-creativity",
        destination: "/tech",
        permanent: true,
      },
      {
        source: "/category/uncategorized/page/2",
        destination: "/",
        permanent: true,
      },

      // Fix bad imported slug
      {
        source: "/essays/https-daddieshinor-com-how-to-build-a-personal-brand",
        destination: "/essays/how-to-build-a-personal-brand",
        permanent: true,
      },

      // Existing page_id cleanup
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
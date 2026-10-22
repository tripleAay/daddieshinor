// // app/page.tsx

// export default function MaintenancePage() {
//   return (
//     <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
//       <div className="max-w-2xl text-center">
//         <img
//           src="/DS.png"
//           alt="Daddieshinor"
//           className="w-20 mx-auto mb-6"
//         />

//         <p className="uppercase tracking-[0.3em] text-sm text-zinc-400">
//           Temporary Notice
//         </p>

//         <h1 className="text-4xl md:text-6xl font-bold mt-4">
//           Daddieshinor is evolving.
//         </h1>

//         <p className="mt-6 text-zinc-300 leading-relaxed">
//           We are rebuilding the platform to deliver a faster, sharper and more
//           immersive experience across technology, culture, life and brands.
//         </p>

//         <div className="mt-10 flex justify-center gap-4">
//           <a
//             href="https://instagram.com/daddieshinorhq"
//             className="px-6 py-3 border border-white rounded-full"
//           >
//             Instagram
//           </a>

//           <a
//             href="/"
//             className="px-6 py-3 bg-white text-black rounded-full"
//           >
//             Subscribe
//           </a>
//         </div>

//         {/* Google AdSense */}
       
//       </div>
//     </main>
//   );
// }




import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";

import Header from "@/components/header";
import Hero from "@/components/hero";
import LatestSection from "@/components/latest";
import BestNewMusic from "@/components/bestNewMusic";
import TechSection from "@/components/TechSection";
import NewsSection from "@/components/culturesection";
import BrandsSection from "@/components/brand";
import AllPostsIndex from "@/components/mobile-headline";
import HeadlineIndex from "@/components/headline-layout";
import { SubscribeModalTrigger } from "@/components/subscribepopup";
import YouTubeEmbed from "@/components/youtube";
import Footer from "@/components/footer";
import MarqueeNote from "@/components/marqueeNote";
import EditorialIntro from "@/components/EditorialIntro";

export const metadata: Metadata = {
  title: {
    default: "Daddieshinor",
    template: "%s | Daddieshinor",
  },

  description:
    "A media platform exploring technology, culture, life, and brands with depth, clarity, and perspective — thoughtful essays, sharp analysis, and real-world insights from Africa and beyond.",

  keywords: [
    "tech culture blog",
    "technology and culture insights",
    "branding and identity analysis",
    "modern life essays",
    "African tech culture",
    "thoughtful essays",
    "creative thinking platform",
    "startup and branding insights",
    "Daddieshinor blog",
  ],

  metadataBase: new URL("https://daddieshinor.com"),

  icons: {
    icon: [
      {
        url: "/DS.png",
        type: "image/png",
        sizes: "any",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/DS.png",
        sizes: "180x180",
      },
      {
        url: "/DS.png",
        sizes: "any",
      },
    ],
    shortcut: "/DS.png",
  },

  openGraph: {
    title: "Daddieshinor — Ideas That Shape How We Think",
    description:
      "A media platform exploring technology, culture, life, and brands with depth, clarity, and perspective. Thoughtful essays, sharp analysis, and real-world insights from Africa and beyond.",
    url: "https://daddieshinor.com",
    siteName: "Daddieshinor",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Daddieshinor – Culture, Tech, Life & Branding",
      },
      {
        url: "/DS.png",
        width: 512,
        height: 512,
        alt: "Daddieshinor Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Daddieshinor — Ideas That Shape How We Think",
    description:
      "Essays and signals on culture, technology, life, and branding. Not noise — meaning.",
    images: ["/og-home.jpg", "/DS.png"],
    creator: "@daddieshinor",
    site: "@daddieshinor",
  },

  alternates: {
    canonical: "https://daddieshinor.com",
  },

  robots: {
    index: true,
    follow: true,
  },
};

function HeroSkeleton() {
  return (
    <section
      aria-label="Loading featured stories"
      aria-busy="true"
      className="w-full bg-[#f3f2ed] dark:bg-[#10120f]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-7 md:py-14 lg:px-8 lg:py-16 xl:px-10">
        <div className="grid grid-cols-1 items-start gap-10 motion-safe:animate-pulse lg:grid-cols-12 lg:gap-6 xl:gap-9">
          <div className="min-w-0 space-y-6 lg:col-span-6">
            <div className="flex items-center justify-between gap-4">
              <div className="h-10 w-48 max-w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />

              <div className="hidden gap-2 sm:flex">
                <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-16 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800 lg:h-24" />
              <div className="h-5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <div className="aspect-[16/10] rounded-[26px] bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <div className="min-w-0 space-y-6 lg:col-span-4">
            <div className="h-14 w-48 max-w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />

            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-20 w-20 shrink-0 rounded-xl bg-zinc-200 dark:bg-zinc-800" />

                <div className="min-w-0 flex-1 space-y-3 py-2">
                  <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>

          <div className="min-w-0 space-y-5 lg:col-span-2">
            <div className="aspect-[4/5] rounded-[24px] bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-48 rounded-[24px] bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="ds-home relative min-h-screen w-full min-w-0 bg-[#D9DCD6] font-sans antialiased dark:bg-black">
      <div className="sticky top-0 z-50 w-full">
        <Header />
      </div>

      <MarqueeNote />

      <main className="w-full min-w-0">
        <EditorialIntro />

        <div id="journal" className="scroll-mt-44">
          <AllPostsIndex />
        </div>

        {/* Hero owns its full-width background and inner container. */}
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>

        {/* Remaining sections retain their original content width. */}
        <div className="ds-home-content mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="ds-home-sections mt-4 space-y-12 md:mt-8 md:space-y-16 lg:space-y-20">
            <LatestSection />

            <BestNewMusic />

            <TechSection />

            <NewsSection />

            <BrandsSection />

            <HeadlineIndex
              title="All Posts"
              description="Latest posts from all categories"
            />

            <div className="pt-2">
              <SubscribeModalTrigger />
            </div>
          </div>
        </div>

        <div className="mx-auto mb-12 mt-14 w-full max-w-[1040px] px-5 sm:px-8 md:mt-20 lg:px-12">
          <YouTubeEmbed
            urlOrId="https://youtu.be/-U5dEdWouDY?si=u1fyqkI14-SpGvNl"
            title="A different frequency."
            description="Step away from the feed. A moment to watch, listen, and see things differently."
            className="w-full"
          />
        </div>
      </main>

      <Footer />

      <Script
        id="organization-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Daddieshinor",
            url: "https://daddieshinor.com",
            logo: "https://daddieshinor.com/DS.png",
            description:
              "A media platform exploring technology, culture, life, and brands with depth, clarity, and perspective.",
            sameAs: [
              "https://instagram.com/daddieshinorhq",
              "https://facebook.com/daddieshinor",
              "https://tiktok.com/@daddieshinorhq",
              "https://medium.com/@daddieshinor",
            ],
          }),
        }}
      />

      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Daddieshinor",
            url: "https://daddieshinor.com",
            description:
              "Technology, culture, life, and brand insights.",
          }),
        }}
      />
    </div>
  );
}
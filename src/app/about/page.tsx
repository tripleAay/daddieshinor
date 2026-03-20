// src/app/about/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProtectedImageWrapper from "@/components/protectedImageWrapper";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Daddieshinor",
  description: "Clear thinking at the intersection of code, culture, brands, and life.",
  alternates: { canonical: "https://daddieshinor.com/about" },
  openGraph: {
    title: "About Daddieshinor",
    description: "A personal space for deliberate thought in accelerated times.",
    url: "https://daddieshinor.com/about",
    images: [{ url: "https://daddieshinor.com/og/about.jpg", width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <article className="min-h-screen bg-[#D0CD94] text-black dark:bg-zinc-950/85 dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50  bg-white/80 backdrop-blur-md dark:border-zinc-800/40 dark:bg-black/70">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-[var(--header-height,80px)]" />

      <main className="px-5 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl">
          {/* Hero / Title */}
          <header className="mb-20 md:mb-28 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
              Daddieshinor
            </h1>
            <p className="mt-6 text-xl md:text-2xl font-light text-zinc-700 dark:text-zinc-300">
              Clear thinking in accelerated times.
            </p>
          </header>

          {/* Core Content */}
          <div className="space-y-20 md:space-y-32">
            {/* Personal Voice */}
            <section className="space-y-10 text-center md:text-left">
              <p className="text-xl md:text-2xl leading-relaxed font-light">
                I’m Shina Hustlé — software engineer, brand designer, observer.
              </p>

              <p className="text-lg md:text-xl leading-relaxed text-zinc-800 dark:text-zinc-200">
                Daddieshinor is a private space.  
                No newsletter deadlines. No content calendar.  
                Just deliberate writing when something truly deserves words.
              </p>
            </section>

            {/* What It Stands For */}
            <section className="space-y-12">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                What It Stands For
              </h2>

              <div className="space-y-8 text-lg md:text-xl leading-relaxed text-zinc-800 dark:text-zinc-200">
                <p>Depth over velocity.</p>
                <p>Signal over volume.</p>
                <p>Ownership over trends.</p>

                <p className="mt-10">
                  I write about systems — code, culture, brands, behavior — only when I have something precise to say.  
                  Not faster. Not louder. Just clearer.
                </p>
              </div>
            </section>

            {/* Signature Note */}
            <section className="pt-16 border-t border-zinc-200/40 dark:border-zinc-800/40 text-center">
              <div className="mx-auto max-w-md">
                <ProtectedImageWrapper
                  src="/shine.jpeg"
                  alt="Shina Hustlé"
                  width={112}
                  height={112}
                  containerClassName="h-28 w-28 mx-auto mb-8"
                />

                <p className="text-xl md:text-2xl italic leading-relaxed text-zinc-800 dark:text-zinc-200">
                  “This isn’t for everyone.  
                  And that’s exactly why it exists.”
                </p>

                <p className="mt-6 text-lg font-medium text-zinc-600 dark:text-zinc-400">
                  — Shina Hustlé
                </p>
              </div>
            </section>
          </div>

          {/* Return CTA */}
          <div className="mt-32 text-center">
            <Link
              href="/"
              className="
                inline-flex items-center gap-2 px-8 py-4 rounded-full
                bg-black/90 text-white dark:bg-white/90 dark:text-black
                font-medium text-lg tracking-tight
                hover:bg-black dark:hover:bg-white
                transition-all duration-300
                shadow-sm hover:shadow-md
              "
            >
              Return to the quiet side
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}
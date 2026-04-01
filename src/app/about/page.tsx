// src/app/about/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProtectedImageWrapper from "@/components/protectedImageWrapper";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About Daddieshinor",
  description:
    "Clear thinking at the intersection of code, culture, brands, and life.",
  alternates: { canonical: "https://daddieshinor.com/about" },
  openGraph: {
    title: "About Daddieshinor",
    description: "A personal space for deliberate thought in accelerated times.",
    url: "https://daddieshinor.com/about",
    images: [
      {
        url: "https://daddieshinor.com/og/about.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <article className="min-h-screen bg-[#D9DCD6] text-black dark:bg-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="fixed inset-x-0 top-0 z-50 h-[80px] border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <div className="h-full">
          <Header />
        </div>
      </div>

      {/* Page Content */}
      <main className="px-5 pb-16 pt-[80px] md:pb-24 lg:pb-32">
        {/* Mobile breadcrumb / back row */}
        <div className="sticky top-[100px] z-40 -mx-5 mb-8 border-b border-zinc-200/80 bg-white/90 px-5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 md:hidden">
          <div className="flex min-h-[48px] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center text-sm">
              <Link
                href="/"
                className="flex items-center gap-1.5 font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>

              <span className="mx-2.5 text-zinc-400 dark:text-zinc-600">/</span>

              <span className="truncate font-semibold text-black dark:text-white">
                About
              </span>
            </div>

            <Link
              href="/"
              className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-3xl py-10 md:py-24 lg:py-32">
          {/* Hero / Title */}
          <header className="mb-20 text-center md:mb-28">
            <h1 className="text-5xl font-black leading-none tracking-tight md:text-6xl lg:text-7xl">
              Daddieshinor
            </h1>
            <p className="mt-6 text-xl font-light text-zinc-700 dark:text-zinc-300 md:text-2xl">
              Clear thinking in accelerated times.
            </p>
          </header>

          {/* Core Content */}
          <div className="space-y-20 md:space-y-32">
            {/* Personal Voice */}
            <section className="space-y-10 text-center md:text-left">
              <p className="text-xl font-light leading-relaxed md:text-2xl">
                I’m Shina Hustlé — software engineer, brand designer, observer.
              </p>

              <p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 md:text-xl">
                Daddieshinor is a private space.
                <br />
                No newsletter deadlines. No content calendar.
                <br />
                Just deliberate writing when something truly deserves words.
              </p>
            </section>

            {/* What It Stands For */}
            <section className="space-y-12">
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                What It Stands For
              </h2>

              <div className="space-y-8 text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 md:text-xl">
                <p>Depth over velocity.</p>
                <p>Signal over volume.</p>
                <p>Ownership over trends.</p>

                <p className="mt-10">
                  I write about systems — code, culture, brands, behavior — only
                  when I have something precise to say.
                  <br />
                  Not faster. Not louder. Just clearer.
                </p>
              </div>
            </section>

            {/* Signature Note */}
            <section className="border-t border-zinc-200/40 pt-16 text-center dark:border-zinc-800/40">
              <div className="mx-auto max-w-md">
                <ProtectedImageWrapper
                  src="/shine.jpeg"
                  alt="Shina Hustlé"
                  width={112}
                  height={112}
                  containerClassName="mx-auto mb-8 h-28 w-28"
                />

                <p className="text-xl italic leading-relaxed text-zinc-800 dark:text-zinc-200 md:text-2xl">
                  “This isn’t for everyone.
                  <br />
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
                inline-flex items-center gap-2 rounded-full
                bg-black/90 px-8 py-4 text-lg font-medium tracking-tight text-white
                shadow-sm transition-all duration-300 hover:bg-black hover:shadow-md
                dark:bg-white/90 dark:text-black dark:hover:bg-white
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
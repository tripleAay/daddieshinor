// src/app/about/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProtectedImageWrapper from "@/components/protectedImageWrapper";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Daddieshinor — Thinking Clearly in a Noisy World",
  description:
    "Learn what Daddieshinor stands for: thoughtful writing at the intersection of technology, culture, life, and brands — focused on meaning, not noise.",
  alternates: {
    canonical: "https://daddieshinor.com/about",
  },
  openGraph: {
    title: "About Daddieshinor",
    description:
      "A manifesto for slower thinking, deeper understanding, and meaningful writing beyond headlines.",
    url: "https://daddieshinor.com/about",
    siteName: "Daddieshinor",
    images: [
      {
        url: "https://daddieshinor.com/og/about.jpg",
        width: 1200,
        height: 630,
        alt: "About Daddieshinor",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Daddieshinor",
    description:
      "Why Daddieshinor exists — a place for meaning over noise.",
    images: ["https://daddieshinor.com/og/about.jpg"],
  },
};

const ACCENT = "#968e68";

export default function AboutPage() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-black dark:from-black dark:to-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-[var(--header-height,80px)]" />

      <main className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1000px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-zinc-400 dark:text-zinc-600">
                ›
              </li>
              <li aria-current="page" className="font-semibold text-black dark:text-white">
                About
              </li>
            </ol>
          </nav>

          {/* Intro / Manifesto */}
          <header className="mb-20 max-w-[720px]">
            <div className="mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-black via-[#968e68] to-black dark:from-white dark:via-[#968e68] dark:to-white" />

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-r from-black to-zinc-800 dark:from-white dark:to-zinc-300">
              About Daddieshinor
            </h1>

            <p className="mt-8 text-2xl md:text-3xl leading-relaxed font-medium text-zinc-800 dark:text-zinc-200">
              Thinking clearly in a noisy world.
            </p>
          </header>

          {/* Flowing Editorial Content */}
          <div className="mx-auto max-w-[760px] space-y-24">
            {/* Intro */}
            <section className="space-y-8">
              <p className="text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                We live in an era of constant updates and very little meaning. Information moves fast. Understanding doesn’t. Daddieshinor exists to slow things down — to look past headlines and ask better questions about what technology, culture, life, and brands are actually doing to people.
              </p>

              <p className="text-xl md:text-2xl leading-relaxed font-medium text-zinc-800 dark:text-zinc-200">
                This isn’t about being first. It’s about being thoughtful. And getting it right.
              </p>
            </section>

            {/* What This Is */}
            <section className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
                <Sparkles className="h-8 w-8 text-[#968e68]" />
                What This Is
              </h2>

              <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                Daddieshinor sits at the intersection of technology, culture, life, and brands — not to report faster, but to understand deeper.
              </p>

              <div className="rounded-2xl bg-gradient-to-r from-[#968e68]/10 to-transparent dark:from-[#968e68]/20 p-8 ring-1 ring-[#968e68]/30 dark:ring-[#968e68]/20 backdrop-blur-sm">
                <p className="text-2xl md:text-3xl font-black leading-tight text-zinc-900 dark:text-zinc-100">
                  What does this really change for people?
                </p>
              </div>

              <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                We focus on patterns instead of noise. Intentions instead of hype. Consequences instead of announcements.
              </p>

              <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                If something doesn’t meaningfully affect how people think, live, build, or decide — it doesn’t belong here.
              </p>
            </section>

            {/* Why It Exists */}
            <section className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Why It Exists
              </h2>

              <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                The world doesn’t need more recycled narratives about technology. It needs original thinking rooted in real contexts, real people, and real futures.
              </p>

              <ul className="space-y-6 text-xl text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-4">
                  <span className="mt-2 h-3 w-3 rounded-full bg-[#968e68] flex-shrink-0" />
                  Decode technology beyond specs, launches, and press releases
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-2 h-3 w-3 rounded-full bg-[#968e68] flex-shrink-0" />
                  Read culture beneath trends, virality, and surface behavior
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-2 h-3 w-3 rounded-full bg-[#968e68] flex-shrink-0" />
                  Reflect on life without pretending to have all the answers
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-2 h-3 w-3 rounded-full bg-[#968e68] flex-shrink-0" />
                  Think about brands as systems of meaning, not just marketing tools
                </li>
              </ul>

              <p className="text-xl leading-relaxed italic text-zinc-600 dark:text-zinc-400 border-l-4 border-[#968e68]/40 pl-6">
                This is not hot-take journalism. It is not trend-chasing content. It is writing for people who want to think better — not just know more.
              </p>
            </section>

            {/* Who’s Behind It */}
            <section className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Who’s Behind It
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                <div className="shrink-0">
                  <ProtectedImageWrapper
                    src="/shine.jpg"
                    alt="Shina Hustle"
                    width={112}
                    height={112}
                    containerClassName="h-28 w-28"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-black dark:text-white">
                      Shina Hustle
                    </p>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                      Founder & Writer
                    </p>
                  </div>

                  <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                    Daddieshinor is founded and written by Shina Hustle, a thinker and builder deeply interested in how systems shape people — and how people quietly reshape systems in return.
                  </p>

                  <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                    This platform carries a personal voice, but not a personal agenda.
                  </p>
                </div>
              </div>
            </section>

            {/* The Long View */}
            <section className="space-y-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-center">
                The Long View
              </h2>

              <p className="text-2xl md:text-3xl leading-relaxed text-center font-medium text-zinc-800 dark:text-zinc-200">
                This is a long game. And if you’re here, you’re already part of it.
              </p>

              <div className="flex justify-center">
                <span className="inline-block px-6 py-3 rounded-full bg-[#968e68]/10 text-[#968e68] font-medium text-lg border border-[#968e68]/30 dark:bg-[#968e68]/20 dark:border-[#968e68]/40">
                  Welcome to the quiet side of the internet.
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}
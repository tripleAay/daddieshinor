// src/app/about/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About Daddieshinor",
  description:
    "Daddieshinor is a media platform exploring technology, culture, life, and brands with depth, clarity, and perspective — thoughtful writing for a noisy world.",
  alternates: {
    canonical: "https://daddieshinor.com/about",
  },
  openGraph: {
    title: "About Daddieshinor",
    description:
      "Daddieshinor is a media platform exploring technology, culture, life, and brands with depth, clarity, and perspective.",
    url: "https://daddieshinor.com/about",
    siteName: "Daddieshinor",
    type: "website",
    images: [
      {
        url: "https://daddieshinor.com/og/about.jpg",
        width: 1200,
        height: 630,
        alt: "About Daddieshinor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Daddieshinor",
    description:
      "Daddieshinor is a media platform exploring technology, culture, life, and brands with depth, clarity, and perspective.",
    images: ["https://daddieshinor.com/og/about.jpg"],
  },
};

const PILLARS = [
  {
    title: "Technology",
    desc: "Signals, shifts, and real implications.",
  },
  {
    title: "Culture",
    desc: "What people feel, follow, repeat, and become.",
  },
  {
    title: "Life",
    desc: "Growth, discipline, relationships, and becoming.",
  },
  {
    title: "Brands",
    desc: "Identity, trust, perception, and positioning.",
  },
];

export default function AboutPage() {
  return (
    <article className="min-h-screen bg-[#D9DCD6] text-black dark:bg-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="fixed inset-x-0 top-0 z-50 h-[80px] border-b border-zinc-200/80 bg-[#D9DCD6]/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
        <div className="h-full">
          <Header />
        </div>
      </div>

      <main className="px-5 pb-20 pt-[80px] md:px-8 md:pb-28 lg:px-10 lg:pb-32">
        {/* Mobile breadcrumb */}
        <div className="sticky   top-[100px] z-40 -mx-5 mb-8 border-b border-zinc-200/80 bg-[#D9DCD6]/90 px-5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 md:hidden">
          <div className="flex mt-10 min-h-[48px] items-center justify-between gap-3">
            <div className="flex  min-w-0 items-center text-sm">
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

        <div className="mx-auto max-w-6xl">
          {/* Desktop breadcrumb */}
          <div className="mb-10 mt-10 hidden md:flex md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-black dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-black dark:text-white">About</span>
            </div>

            <Link
              href="/author"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              View author
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Hero */}
          <section className="border-b border-zinc-200/70 pb-14 pt-6 dark:border-zinc-800/70 md:pb-20 md:pt-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-8">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  About the platform
                </p>

                <h1 className="max-w-4xl text-left text-5xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
                  Daddieshinor
                </h1>

                <p className="mt-6 max-w-3xl text-left text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-2xl md:leading-relaxed">
                  A media platform exploring technology, culture, life, and brands
                  with depth, clarity, and perspective.
                </p>
              </div>

              <div className="lg:col-span-4 lg:pl-6">
                <div className="border-l border-zinc-300/70 pl-5 dark:border-zinc-700/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    Positioning
                  </p>
                  <p className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    Built for readers who want more than speed, noise, and
                    surface-level commentary.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main presentation */}
          <section className="py-14 md:py-20">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              {/* Left rail */}
              <aside className="lg:col-span-3">
                <div className="lg:sticky lg:top-[120px]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    Overview
                  </p>

                  <nav className="mt-6 space-y-4 text-sm">
                    <a
                      href="#intro"
                      className="block text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                    >
                      Introduction
                    </a>
                    <a
                      href="#principles"
                      className="block text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                    >
                      Principles
                    </a>
                    <a
                      href="#coverage"
                      className="block text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                    >
                      Coverage
                    </a>
                    <a
                      href="#author"
                      className="block text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                    >
                      Author
                    </a>
                  </nav>
                </div>
              </aside>

              {/* Main content */}
              <div className="lg:col-span-9">
                <div className="space-y-20 md:space-y-24">
                  {/* Intro */}
                  <section id="intro" className="space-y-8">
                    <div className="max-w-3xl">
                      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        Introduction
                      </p>

                      <h2 className="text-left text-3xl font-black tracking-tight md:text-4xl">
                        Thinking clearly in a noisy world.
                      </h2>
                    </div>

                    <div className="max-w-3xl space-y-6 text-left text-lg leading-8 text-zinc-800 dark:text-zinc-200 md:text-xl">
                      <p>
                        Daddieshinor is built around one belief: the most useful
                        ideas are not always the loudest ones.
                      </p>

                      <p>
                        It approaches technology, culture, life, and brands as
                        connected systems shaping how people think, choose, build,
                        and move through the world.
                      </p>

                      <p>
                        This is not content designed to chase attention. It is
                        writing designed to create understanding.
                      </p>
                    </div>
                  </section>

                  {/* Principles */}
                  <section id="principles" className="space-y-8 border-t border-zinc-200/70 pt-14 dark:border-zinc-800/70">
                    <div className="max-w-3xl">
                      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        Principles
                      </p>

                      <h2 className="text-left text-3xl font-black tracking-tight md:text-4xl">
                        What defines the platform.
                      </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="rounded-3xl border border-black/10 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                          01
                        </p>
                        <h3 className="mt-4 text-xl font-bold">Depth</h3>
                        <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                          Going beyond reaction, trend cycles, and surface-level
                          takes.
                        </p>
                      </div>

                      <div className="rounded-3xl border border-black/10 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                          02
                        </p>
                        <h3 className="mt-4 text-xl font-bold">Clarity</h3>
                        <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                          Making complex ideas legible, useful, and human.
                        </p>
                      </div>

                      <div className="rounded-3xl border border-black/10 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                          03
                        </p>
                        <h3 className="mt-4 text-xl font-bold">Perspective</h3>
                        <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                          Seeing the links between systems, signals, choices, and
                          outcomes.
                        </p>
                      </div>
                    </div>

                    <div className="max-w-3xl text-left text-lg leading-8 text-zinc-800 dark:text-zinc-200 md:text-xl">
                      <p>
                        Technology is not just code. Culture is not just trends.
                        Brands are not just visuals. Life is not just
                        productivity. Everything connects and this platform exists
                        to make those connections visible.
                      </p>
                    </div>
                  </section>

                  {/* Coverage */}
                  <section id="coverage" className="space-y-8 border-t border-zinc-200/70 pt-14 dark:border-zinc-800/70">
                    <div className="max-w-3xl">
                      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        Coverage
                      </p>

                      <h2 className="text-left text-3xl font-black tracking-tight md:text-4xl">
                        What you’ll find here.
                      </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {PILLARS.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-3xl border border-black/10 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5"
                        >
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Author bridge */}
                  <section id="author" className="space-y-8 border-t border-zinc-200/70 pt-14 dark:border-zinc-800/70">
                    <div className="max-w-3xl">
                      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        Author
                      </p>

                      <h2 className="text-left text-3xl font-black tracking-tight md:text-4xl">
                        The mind behind the platform.
                      </h2>
                    </div>

                    <div className="max-w-3xl rounded-[28px] border border-black/10 bg-white/55 p-7 dark:border-white/10 dark:bg-white/5 md:p-8">
                      <p className="text-left text-lg leading-8 text-zinc-800 dark:text-zinc-200 md:text-xl">
                        Daddieshinor is created and written by Shina Hustle.
                      </p>

                      <p className="mt-4 text-left text-base leading-7 text-zinc-700 dark:text-zinc-300">
                        View the author page for a clearer look at the identity,
                        direction, and thinking behind the work.
                      </p>

                      <div className="mt-8">
                        <Link
                          href="/author"
                          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
                        >
                          View author
                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="border-t border-zinc-200/70 py-12 dark:border-zinc-800/70">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Continue
                </p>
                <p className="mt-3 text-left text-lg leading-8 text-zinc-800 dark:text-zinc-200">
                  Return to the platform and explore the latest essays across
                  technology, culture, life, and brands.
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:translate-y-[-1px] hover:bg-zinc-900 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
              >
                Read the platform
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </article>
  );
}
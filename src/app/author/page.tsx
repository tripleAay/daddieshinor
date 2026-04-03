import Header from "@/components/header";
import Footer from "@/components/footer";
import ProtectedImageWrapper from "@/components/protectedImageWrapper";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Shina Hustle — Author | Daddieshinor",
  description:
    "Shina Hustle is a builder working across products, brands, and media — shaping digital systems, identity, and direction.",
  alternates: {
    canonical: "https://daddieshinor.com/author",
  },
  openGraph: {
    title: "Shina Hustle — Author | Daddieshinor",
    description:
      "Shina Hustle is a builder working across products, brands, and media — shaping digital systems, identity, and direction.",
    url: "https://daddieshinor.com/author",
    siteName: "Daddieshinor",
    type: "profile",
    images: [
      {
        url: "https://daddieshinor.com/og/author.jpg",
        width: 1200,
        height: 630,
        alt: "Shina Hustle — Author at Daddieshinor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shina Hustle — Author | Daddieshinor",
    description:
      "Shina Hustle is a builder working across products, brands, and media — shaping digital systems, identity, and direction.",
    images: ["https://daddieshinor.com/og/author.jpg"],
  },
};

const CURRENT_FOCUS = [
  {
    title: "Fynaro Tech",
    desc: "Building web and mobile products, brand systems, and digital experiences for businesses that need clarity and execution.",
  },
  {
    title: "Daddieshinor",
    desc: "Publishing structured ideas across technology, culture, life, and brands through essays and editorial thinking.",
  },
  {
    title: "Shina Hustle",
    desc: "Developing a personal identity that connects direction, visibility, and long-term positioning.",
  },
  {
    title: "Future",
    desc: "Expanding into broader media, content, and creative expression over time.",
  },
];

const AREAS_OF_WORK = [
  {
    title: "Product",
    desc: "Building digital systems, interfaces, and product experiences that are clear, useful, and built to last.",
  },
  {
    title: "Brand",
    desc: "Shaping identity, positioning, and visual direction for businesses that want to feel credible and distinct.",
  },
  {
    title: "Writing",
    desc: "Turning ideas, observations, and patterns into structured essays and public thinking.",
  },
  {
    title: "Direction",
    desc: "Connecting execution across identity, media, and business with long-term focus.",
  },
];

const BRAND_STRUCTURE = [
  { name: "Shina Hustle", role: "identity and direction" },
  { name: "Daddieshinor", role: "media and thinking" },
  { name: "Fynaro Tech", role: "products and execution" },
];

export default function AuthorPage() {
  return (
    <article className="min-h-screen bg-[#D9DCD6] text-black dark:bg-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="fixed inset-x-0 top-0 z-50 h-[80px] border-b border-zinc-200/80 bg-[#D9DCD6]/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
        <div className="h-full">
          <Header />
        </div>
      </div>

      <main className="px-5 pb-20 pt-[80px] md:px-8 md:pb-24 lg:px-10 lg:pb-32">
        {/* Mobile Top Row */}
        <div className="sticky top-[100px] z-40 -mx-5 mb-8 border-b border-zinc-200/80 bg-[#D9DCD6]/90 px-5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 md:hidden">
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
                Author
              </span>
            </div>

            <Link
              href="/about"
              className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              About
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Desktop top row */}
          <div className="mb-10 hidden items-center justify-between md:flex">
            <div className="flex mt-10   items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-black dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-black dark:text-white">Author</span>
            </div>

            
          </div>

          {/* Hero */}
          <section className="rounded-[32px] border border-black/10 bg-white/50 px-6 py-12 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 md:px-10 md:py-16 lg:px-14 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 flex justify-center">
                <ProtectedImageWrapper
                  src="/shine.jpeg"
                  alt="Shina Hustle"
                  width={144}
                  height={144}
                  containerClassName="h-28 w-28 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10 md:h-32 md:w-32"
                />
              </div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                Author
              </p>

              <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
               Shina Hustlé
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-2xl md:leading-relaxed">
                Building products, brands, and systems that are clear, usable,
                and built to last.
              </p>
            </div>
          </section>

          {/* Intro */}
          <section className="mx-auto mt-16 max-w-3xl text-center md:mt-20">
            <div className="space-y-6 text-lg leading-8 text-zinc-800 dark:text-zinc-200 md:text-xl">
              <p>I work across three layers — products, brands, and media.</p>
              <p>
                Each one solves a different problem, but they connect through
                execution.
              </p>
              <p>
                This page is not about the platform. It is about the person
                building behind it.
              </p>
            </div>
          </section>

          {/* Current focus */}
          <section className="mt-16 md:mt-20">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                Current focus
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                What I’m focused on now
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {CURRENT_FOCUS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-black/10 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5"
                >
                  <h3 className="text-xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Areas of work */}
          <section className="mt-16 md:mt-20">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                What I do
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Core areas
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {AREAS_OF_WORK.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-black/10 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5"
                >
                  <h3 className="text-xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Structure */}
          <section className="mt-16 md:mt-20">
            <div className="rounded-[32px] border border-black/10 bg-white/50 px-6 py-8 dark:border-white/10 dark:bg-white/5 md:px-10 md:py-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  Structure
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                  One system. Different expressions.
                </h2>

                <div className="mt-8 space-y-4 text-lg leading-8 text-zinc-800 dark:text-zinc-200 md:text-xl">
                  {BRAND_STRUCTURE.map((item) => (
                    <p key={item.name}>
                      <strong>{item.name}</strong> — {item.role}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="mx-auto mt-16 max-w-3xl text-center md:mt-20">
            <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-2xl">
              Everything connects. The work just shows up in different forms.
            </p>
          </section>

          {/* CTA */}
          <section className="mt-16 md:mt-20">
            <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-black/10 bg-white/50 px-6 py-8 text-center dark:border-white/10 dark:bg-white/5 md:px-8 md:py-10">
              <p className="max-w-2xl text-base leading-7 text-zinc-700 dark:text-zinc-300 md:text-lg">
                Explore the platform, or reach out if you’re building something
                that needs clarity and execution.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                >
                  About Daddieshinor
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-black/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black dark:bg-white/90 dark:text-black dark:hover:bg-white"
                >
                  Start a project
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </article>
  );
}
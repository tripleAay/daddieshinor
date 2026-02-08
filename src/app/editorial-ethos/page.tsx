import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Ethos — Daddieshinor",
  description:
    "Daddieshinor's guiding principles: thoughtful writing, intellectual honesty, and a commitment to meaning over noise in technology, culture, life, and branding.",
  alternates: {
    canonical: "https://daddieshinor.com/editorial-ethos",
  },
  openGraph: {
    title: "Editorial Ethos — Daddieshinor",
    description:
      "Our commitment to thoughtful, honest writing that seeks meaning in technology, culture, life, and branding.",
    url: "https://daddieshinor.com/editorial-ethos",
    siteName: "Daddieshinor",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial Ethos — Daddieshinor",
    description:
      "Principles guiding Daddieshinor: intellectual honesty, depth over speed, and meaning over noise.",
  },
};

export default function EditorialEthosPage() {
  return (
    <article className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-black/75">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-[var(--header-height,80px)]" />

      <main className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          {/* Intro */}
          <header className="mb-20 max-w-[720px]">
            <div className="mb-6 h-1 w-20 rounded-full bg-black dark:bg-white" />

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Editorial Ethos
            </h1>

            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
              Our guiding principles for creating thoughtful content at the intersection of technology, culture, life, and branding.
            </p>
          </header>

          {/* Main Content */}
          <div className="mx-auto max-w-[720px] space-y-20">
            {/* Introduction to Ethos */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                Why an Ethos Matters
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                In a world flooded with information, Daddieshinor is committed to clarity, depth, and intellectual honesty. Our ethos defines how we approach every piece of writing — not as content, but as thoughtful exploration.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We believe in asking quiet questions that others overlook, seeking meaning over hype, and respecting our readers' time and intelligence.
              </p>
            </section>

            {/* Core Principles */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                Core Principles
              </h2>

              <ul className="space-y-4 text-lg text-zinc-700 dark:text-zinc-300">
                <li>
                  <strong>Depth Over Speed:</strong> We prioritize understanding and long-term thinking over being first. No hot takes — only considered perspectives.
                </li>
                <li>
                  <strong>Intellectual Honesty:</strong> We present facts clearly, acknowledge uncertainties, and avoid sensationalism. If something is complex, we say so.
                </li>
                <li>
                  <strong>Reader-First Approach:</strong> Every piece is written for people who value substance. No ads disguised as content, no clickbait.
                </li>
                <li>
                  <strong>Inclusivity and Diversity:</strong> Drawing from African and global viewpoints, we amplify underrepresented voices in tech, culture, and branding.
                </li>
                <li>
                  <strong>Transparency:</strong> Sponsored content is clearly labeled. Our opinions are our own, grounded in research and experience.
                </li>
              </ul>
            </section>

            {/* Content Creation Process */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                How We Create Content
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Every essay, analysis, or note starts with curiosity. We research thoroughly, draw from diverse sources, and edit rigorously to ensure clarity and impact.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Founded by Shina Hustlé (@Aaytriple), Daddieshinor is a personal yet collaborative space — open to contributions that align with our ethos.
              </p>
            </section>

            {/* Commitment to Readers */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                Our Commitment to You
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We promise writing that respects your intelligence and time. If something doesn't meet this standard, we won't publish it.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Have thoughts on our ethos or suggestions?{" "}
                <Link href="/contact" className="text-[#968e68] hover:underline">
                  Reach out →
                </Link>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}
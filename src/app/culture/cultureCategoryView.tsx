"use client";

import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { useMemo } from "react";
import Header from "@/components/header";
import { Breadcrumb } from "@/components/bedcrumb";
import MobileAllPosts from "@/components/headlines/MobileAllPosts";
import HeadlineLayout from "@/components/headlines/HeadlineLayout";
import Footer from "@/components/footer";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Culture – Daddieshinor",
  description:
    "Culture decoded — what people feel, repeat, follow, and become. Essays on meaning, memory, and movement.",
  alternates: {
    canonical: "https://daddieshinor.com/culture",
  },
  openGraph: {
    title: "Culture – Daddieshinor",
    description:
      "Not just trends. Meaning, memory, and movement shaping how people live.",
    url: "https://daddieshinor.com/culture",
    siteName: "Daddieshinor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Culture – Daddieshinor",
    description:
      "Essays on culture, identity, and the forces shaping how people think and move.",
  },
};


type CardPost = {
  id: number;
  href: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  image: string;
  alt: string;
};

export default function CultureCategoryView({ posts }: { posts: CardPost[] }) {
  const featured = useMemo(() => posts?.[0], [posts]);
  const rest = useMemo(() => (posts?.length ? posts.slice(1) : []), [posts]);

  return (
    <article className="min-h-screen w-full overflow-x-hidden bg-white text-black dark:bg-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/85 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-[var(--header-height,80px)]" />

      {/* ✅ Mobile-safe container */}
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 pb-16 pt-10">
        {/* ✅ Same grid rules as Tech */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 min-w-0">
          {/* LEFT RAIL */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-2 min-w-0">
            <div className="sticky top-24 space-y-8">
              <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/40 min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest dark:border-white/15 dark:bg-zinc-950">
                  <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  Culture
                </div>

                <p className="mt-4 text-xs leading-relaxed text-black/60 dark:text-white/60 break-words">
                  Culture decoded — what people feel, follow, repeat, and become.
                </p>

                <div className="mt-5 text-xs font-semibold text-black/70 dark:text-white/70">
                  {posts?.length ? `${posts.length} posts` : "No posts yet"}
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER */}
          <main className="col-span-12 md:col-span-6 lg:col-span-7 min-w-0">
            {/* Breadcrumb safe */}
            <div className="min-w-0 break-words mt-10">
              <Breadcrumb category="Culture" title="" />
            </div>

            <div className="lg:hidden">
              <MobileAllPosts categoryId={17} />
            </div>

            {/* Desktop / large screen view: headline layout */}
            <div className="hidden lg:block">
              <HeadlineLayout
                title="Culture"
                description="Culture decoded — what people feel, repeat, follow, and become."
                categoryId={17}
              />
            </div>

            <div className="flex items-end justify-between gap-4 min-w-0">
              <div className="min-w-0">
                <h1 className="text-[34px] leading-[1.12] font-black tracking-tight md:text-[44px] break-words">
                  Culture
                </h1>
                <p className="mt-3 text-base md:text-lg text-black/70 dark:text-white/70 break-words">
                  Not just trends. Meaning. Memory. Movement.
                </p>
              </div>

              <Link
                href="/"
                className="hidden sm:inline-flex shrink-0 rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-bold text-black hover:bg-zinc-50 transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                Home →
              </Link>
            </div>

            {/* Featured */}
            {featured && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <Link href={featured.href} className="block group">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={featured.image}
                      alt={featured.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white min-w-0">
                      <div className="text-xs font-black uppercase tracking-widest opacity-90">
                        Featured
                      </div>
                      <h2 className="mt-2 text-2xl md:text-3xl font-black leading-tight group-hover:text-[#968e68] transition-colors break-words">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-3 text-sm md:text-base text-white/90 line-clamp-3 break-words">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="mt-4 text-sm font-bold text-white/90">
                        {featured.dateLabel}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* List */}
            <div className="mt-10 space-y-6 min-w-0">
              {rest.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="grid gap-0 md:grid-cols-12 min-w-0">
                    <div className="relative md:col-span-4 aspect-[4/3] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 280px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="md:col-span-8 p-5 sm:p-6 min-w-0">
                      <div className="text-xs font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                        {p.dateLabel}
                      </div>

                      <h3 className="mt-2 text-xl md:text-2xl font-black leading-tight group-hover:text-[#968e68] transition-colors break-words">
                        {p.title}
                      </h3>

                      {p.excerpt && (
                        <p className="mt-3 text-sm md:text-base text-zinc-700 dark:text-zinc-300 line-clamp-3 break-words">
                          {p.excerpt}
                        </p>
                      )}

                      <div className="mt-4 text-sm font-bold text-black/80 dark:text-white/80">
                        Read →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {!posts?.length && (
                <div className="mt-16 text-center text-zinc-500 dark:text-zinc-400">
                  No Culture posts found yet.
                </div>
              )}
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3 min-w-0 hidden md:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-zinc-300 bg-[#f4f3dc] p-6 sm:p-7 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70 min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-black/80 dark:border-white/10 dark:bg-zinc-950 dark:text-white/80">
                  Daddieshinor Letters
                </div>

                <h3 className="mt-4 text-2xl font-black leading-tight break-words">Stay Close</h3>

                <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70 break-words">
                  A short note when something is worth thinking about. No spam. No noise.
                </p>

                <form className="mt-5 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="h-11 w-full min-w-0 rounded-xl border border-black/20 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-zinc-800 dark:focus:ring-orange-400/25"
                  />
                  <button
                    type="submit"
                    className="h-11 shrink-0 rounded-xl bg-black px-4 text-sm font-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40 min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-black/70 dark:text-white/70">
                  Culture notes  
                </p>
                <p className="mt-2 text-sm leading-relaxed text-black/75 dark:text-white/75 break-words">
                  If it shaped how people move, it’s culture.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </article>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import Header from "@/components/header";
import { Breadcrumb } from "@/components/bedcrumb";
import NewsletterCard from "@/components/newsletterCard";
import MobileAllPosts from "@/components/headlines/MobileAllPosts";
import HeadlineLayout from "@/components/headlines/HeadlineLayout";
import Footer from "@/components/footer";
import { Sparkles, ArrowLeft } from "lucide-react";

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
    <article className="h-screen overflow-hidden bg-[#D9DCD6] text-black dark:bg-zinc-950 dark:text-white">
      
      {/* Header */}
      <div className="flex-none z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <Header />
      </div>

      {/* Locked body */}
      <div className="flex-1 h-[calc(100vh-var(--header-height,80px))] overflow-hidden">
        <div className="mx-auto h-full w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-0 lg:gap-6">

          {/* LEFT RAIL */}
          <aside className="hidden md:flex md:col-span-3 lg:col-span-2 flex-col gap-5 py-8 overflow-hidden">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest dark:border-white/15 dark:bg-zinc-950">
                <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                Culture
              </div>

              <p className="mt-4 text-xs leading-relaxed text-black/60 dark:text-white/60">
                Culture decoded — what people feel, follow, repeat, and become.
              </p>

              <div className="mt-5 text-xs font-semibold text-black/70 dark:text-white/70">
                {posts?.length ? `${posts.length} posts` : "No posts yet"}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <p className="text-xs font-black uppercase tracking-[0.20em] text-black/60 dark:text-white/60">
                Culture Notes
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                Essays that track the symbols, signals, and stories shaping how people move.
              </p>
            </div>
          </aside>

          {/* CENTER SCROLLER */}
          <main
            id="culture-scroller"
            className="col-span-12 md:col-span-6 lg:col-span-7 h-full overflow-y-auto overscroll-contain min-w-0 px-0 md:px-4 lg:px-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
          >
            <div className="py-6 md:py-8 pb-24 min-w-0">

              {/* ✅ Mobile sticky nav (ADDED) */}
              <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 md:hidden">
                <div className="flex items-center h-10 text-sm">
                  <Link href="/" className="flex items-center gap-1.5 text-zinc-600 hover:text-black font-medium dark:text-zinc-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    Home
                  </Link>
                  <span className="mx-2.5 text-zinc-400">/</span>
                  <span className="font-semibold text-black dark:text-white">Culture</span>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="hidden md:block min-w-0 break-words">
                <Breadcrumb category="Culture" title="" />
              </div>

              {/* Mobile posts */}
              <div className="mt-6 lg:hidden">
                <MobileAllPosts categoryId={17} />
              </div>

              {/* ✅ HeadlineLayout (ADDED — matches Tech) */}
              <div className="hidden lg:block">
                <HeadlineLayout
                  title="Culture"
                  description="Culture decoded — what people feel, follow, repeat, and become."
                  categoryId={17}
                />
              </div>

              {/* Header section */}
              <div className="flex items-end justify-between gap-4 mt-6 md:mt-0">
                <div>
                  <h1 className="text-[34px] md:text-[44px] font-black tracking-tight">
                    Culture
                  </h1>
                  <p className="mt-3 text-base md:text-lg text-black/70 dark:text-white/70">
                    Not just trends. Meaning. Memory. Movement.
                  </p>
                </div>

                <Link
                  href="/"
                  className="hidden sm:inline-flex rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-bold hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  Home →
                </Link>
              </div>

              {/* Featured */}
              {featured && (
                <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-zinc-950">
                  <Link href={featured.href} className="block group">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={featured.image} alt={featured.alt} fill className="object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 p-6 text-white">
                        <div className="text-xs uppercase font-black">Featured</div>
                        <h2 className="text-2xl md:text-3xl font-black mt-2">{featured.title}</h2>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* List */}
              <div className="mt-10 space-y-6">
                {rest.map((p) => (
                  <Link key={p.id} href={p.href} className="block border rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden">
                    <div className="grid md:grid-cols-12">
                      <div className="md:col-span-4 relative aspect-[4/3]">
                        <Image src={p.image} alt={p.alt} fill className="object-cover" />
                      </div>
                      <div className="md:col-span-8 p-6">
                        <h3 className="text-xl font-black">{p.title}</h3>
                        <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">{p.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-16">
                <Footer />
              </div>
            </div>
          </main>

          {/* RIGHT RAIL */}
          <aside className="hidden md:flex md:col-span-3 lg:col-span-3 flex-col gap-5 py-8">
            <NewsletterCard
              badgeText="Daddieshinor Letters"
              title="Stay Sharp on Culture"
              subtitle="Fresh insights on identity, positioning, trust, and memorable design systems."
              buttonText="Subscribe"
            />

            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <p className="text-xs font-black uppercase tracking-[0.20em] text-black/60 dark:text-white/60">
                Signal Check
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                The important story is rarely the feature. It is what the feature changes downstream.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </article>
  );
}
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
import { Sparkles } from "lucide-react";

type CardPost = {
  id: number;
  href: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  image: string;
  alt: string;
};

export default function BrandingCategoryView({
  posts,
}: {
  posts: CardPost[];
}) {
  const featured = useMemo(() => posts?.[0], [posts]);
  const rest = useMemo(() => (posts?.length ? posts.slice(1) : []), [posts]);

  return (
    <article className="flex h-screen flex-col overflow-hidden bg-[#D9DCD6] text-black dark:bg-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="z-40 flex-none border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <Header />
      </div>

      {/* Locked body area */}
      <div className="h-[calc(100vh-var(--header-height,80px))] flex-1 overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-[1320px] grid-cols-12 gap-0 px-4 sm:px-6 lg:gap-6 lg:px-8">
          {/* LEFT RAIL */}
          <aside className="hidden overflow-hidden py-8 md:col-span-3 md:flex md:flex-col md:gap-5 lg:col-span-2">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest dark:border-white/15 dark:bg-zinc-950">
                <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                Branding
              </div>

              <p className="mt-4 text-xs leading-relaxed text-black/60 dark:text-white/60">
                Branding is trust with a design system — positioning, identity,
                and the story people remember.
              </p>

              <div className="mt-5 text-xs font-semibold text-black/70 dark:text-white/70">
                {posts?.length ? `${posts.length} posts` : "No posts yet"}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <p className="text-xs font-black uppercase tracking-[0.20em] text-black/60 dark:text-white/60">
                Brand Notes
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                Identity earns attention. Consistency earns trust. Meaning earns
                memory.
              </p>
            </div>
          </aside>

          {/* CENTER — ONLY SCROLLING COLUMN */}
          <main
            id="branding-scroller"
            className="scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent col-span-12 h-full min-w-0 overflow-y-auto overscroll-contain px-0 md:col-span-6 md:px-4 lg:col-span-7 lg:px-6"
          >
            <div className="min-w-0 py-8 pb-24">
              <div className="min-w-0 break-words">
                <Breadcrumb category="Branding" title="" />
              </div>

              <div className="mt-6 flex items-end justify-between gap-4 min-w-0">
                <HeadlineLayout
                  title="Branding"
                  description="Positioning, identity, trust, and the systems that make brands memorable."
                  categoryId={13}
                />

                <Link
                  href="/"
                  className="hidden shrink-0 rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 sm:inline-flex"
                >
                  Home →
                </Link>
              </div>

              <div className="mt-6 min-w-0">
                <h1 className="break-words text-[34px] font-black leading-[1.12] tracking-tight md:text-[44px]">
                  Branding
                </h1>
                <p className="mt-3 break-words text-base text-black/70 dark:text-white/70 md:text-lg">
                  Not just logos. Meaning. Memory. Position.
                </p>
              </div>

              <div className="mt-6 lg:hidden">
                <MobileAllPosts categoryId={13} />
              </div>

              {/* Featured */}
              {featured && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <Link href={featured.href} className="group block">
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
                      <div className="absolute bottom-0 left-0 right-0 min-w-0 p-5 text-white sm:p-6">
                        <div className="text-xs font-black uppercase tracking-widest opacity-90">
                          Featured
                        </div>
                        <h2 className="mt-2 break-words text-2xl font-black leading-tight transition-colors group-hover:text-[#968e68] md:text-3xl">
                          {featured.title}
                        </h2>
                        {featured.excerpt && (
                          <p className="mt-3 line-clamp-3 break-words text-sm text-white/90 md:text-base">
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
              <div className="mt-10 min-w-0 space-y-6">
                {rest.map((p) => (
                  <Link
                    key={p.id}
                    href={p.href}
                    className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="grid min-w-0 gap-0 md:grid-cols-12">
                      <div className="relative aspect-[4/3] overflow-hidden md:col-span-4">
                        <Image
                          src={p.image}
                          alt={p.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 280px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0 p-5 sm:p-6 md:col-span-8">
                        <div className="text-xs font-bold uppercase tracking-widest text-black/60 dark:text-white/60">
                          {p.dateLabel}
                        </div>

                        <h3 className="mt-2 break-words text-xl font-black leading-tight transition-colors group-hover:text-[#968e68] md:text-2xl">
                          {p.title}
                        </h3>

                        {p.excerpt && (
                          <p className="mt-3 line-clamp-3 break-words text-sm text-zinc-700 dark:text-zinc-300 md:text-base">
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
                    No Branding posts found yet.
                  </div>
                )}
              </div>

              <div className="mt-16">
                <Footer />
              </div>
            </div>
          </main>

          {/* RIGHT RAIL */}
          <aside className="hidden overflow-hidden py-8 md:col-span-3 md:flex md:flex-col md:gap-5 lg:col-span-3">
            <div className="flex-none">
              <NewsletterCard
                badgeText="Daddieshinor Letters"
                title="Stay Sharp on Branding"
                subtitle="Fresh insights on identity, positioning, trust, and memorable design systems."
                buttonText="Subscribe"
              />
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <p className="text-xs font-black uppercase tracking-[0.20em] text-black/60 dark:text-white/60">
                Positioning Signal
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                A brand becomes clear when people know what it means before you
                explain it.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
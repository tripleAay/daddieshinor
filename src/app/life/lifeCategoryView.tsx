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

export default function LifeCategoryView({ posts }: { posts: CardPost[] }) {
  const featured = useMemo(() => posts?.[0], [posts]);
  const rest = useMemo(() => (posts?.length ? posts.slice(1) : []), [posts]);

  return (
    <article className="h-screen overflow-hidden bg-[#D9DCD6] text-black dark:bg-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="flex-none z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <Header />
      </div>

      {/* Locked body area */}
      <div className="flex-1 h-[calc(100vh-var(--header-height,80px))] overflow-hidden">
        <div className="mx-auto h-full w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-0 lg:gap-6">
          
          {/* LEFT RAIL */}
          <aside className="hidden md:flex md:col-span-3 lg:col-span-2 flex-col gap-5 py-8 overflow-hidden">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest dark:border-white/15 dark:bg-zinc-950">
                <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                Life
              </div>

              <p className="mt-4 text-xs leading-relaxed text-black/60 dark:text-white/60">
                Life in motion — habits, clarity, relationships, and the quiet work of becoming.
              </p>

              <div className="mt-5 text-xs font-semibold text-black/70 dark:text-white/70">
                {posts?.length ? `${posts.length} posts` : "No posts yet"}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <p className="text-xs font-black uppercase tracking-[0.20em] text-black/60 dark:text-white/60">
                Life Notes
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                Essays on rhythm, self-command, relationships, and the quieter forms of growth.
              </p>
            </div>
          </aside>

          {/* CENTER — ONLY SCROLLING COLUMN */}
          <main
            id="life-scroller"
            className="col-span-12 md:col-span-6 lg:col-span-7 h-full overflow-y-auto overscroll-contain min-w-0
                       px-0 md:px-4 lg:px-6
                       scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
          >
            <div className="py-8 pb-24 min-w-0">
              <div className="min-w-0 break-words">
                <Breadcrumb category="Life" title="" />
              </div>

              <div className="mt-6 flex items-end justify-between gap-4 min-w-0">
                <div className="min-w-0">
                  <div className="hidden lg:block">
                                <HeadlineLayout
                                  title="Life"
                                  description="Inner systems — habits, clarity, identity, and the discipline of becoming."
                                  categoryId={18}
                                />
                              </div>
                  <h1 className="text-[34px] leading-[1.12] font-black tracking-tight md:text-[44px] break-words">
                    Life
                  </h1>
                  <p className="mt-3 text-base md:text-lg text-black/70 dark:text-white/70 break-words">
                    Not just living. Meaning. Direction. Depth.
                  </p>
                  <div className="mt-5 text-xs font-semibold text-black/70 dark:text-white/70">
                  {posts?.length ? `${posts.length} posts` : "No posts yet"}
                </div>
                </div>

                <Link
                  href="/"
                  className="hidden sm:inline-flex shrink-0 rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-bold text-black hover:bg-zinc-50 transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                >
                  Home →
                </Link>
              </div>

              {/* Mobile helper */}
              <div className="mt-6 lg:hidden">
                <MobileAllPosts categoryId={18} />
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

              {/* Post list */}
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
                    No Life posts found yet.
                  </div>
                )}
              </div>

              <div className="mt-16">
                <Footer />
              </div>
            </div>
          </main>

          {/* RIGHT RAIL */}
          <aside className="hidden md:flex md:col-span-3 lg:col-span-3 flex-col gap-5 py-8 overflow-hidden">
            <div className="flex-none">
              <NewsletterCard
                badgeText="Daddieshinor Letters"
                title="Stay Sharp on Life Talks"
                subtitle="Fresh reflections on habits, clarity, identity, and becoming."
                buttonText="Subscribe"
              />
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
              <p className="text-xs font-black uppercase tracking-[0.20em] text-black/60 dark:text-white/60">
                Quiet Signals
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                Small decisions, repeated long enough, become a life.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
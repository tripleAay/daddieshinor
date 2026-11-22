// components/CategoryIndexPage.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronRight, AlertCircle, Sparkles, Facebook, Twitter, Link2, Handshake } from "lucide-react";
import { useGlobalLoader } from "@/components/global-loader";
import Header from "@/components/header";

// ShareIcon component (same as your PostLayout)
type ShareIconProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

function ShareIcon({ href, label, children }: ShareIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
    >
      {children}
    </a>
  );
}

// ────────────────────────────────────────────────
// TYPES & CONFIG
// ────────────────────────────────────────────────
type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: { sizes?: Record<string, { source_url: string }> };
    }>;
  };
};

type MappedPost = {
  href: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  alt: string;
};

type Props = {
  title: string;
  description?: string;
  categoryId: number;
};

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";
const PER_PAGE = 9;
const ACCENT = "#968e68";

// ────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────
function cleanText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CategoryIndexPage({ title, description, categoryId }: Props) {
  const [posts, setPosts] = useState<MappedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { start, stop } = useGlobalLoader();
  const didFirstLoadRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      const isFirstLoad = !didFirstLoadRef.current && page === 1;

      try {
        setLoading(true);
        setError(null);
        if (isFirstLoad) start();

        const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&status=publish`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 400) {
            setHasMore(false);
            return;
          }
          throw new Error(`API error: ${res.status}`);
        }

        const data: WPPost[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          setHasMore(false);
          return;
        }

        const mapped: MappedPost[] = data.map((p) => {
          const media = p._embedded?.["wp:featuredmedia"]?.[0];
          const image =
            media?.media_details?.sizes?.medium_large?.source_url ||
            media?.source_url ||
            "/fallback.jpg";

          return {
            href: `/essays/${p.slug}`,
            title: cleanText(p.title.rendered) || "Untitled",
            excerpt: cleanText(p.excerpt?.rendered || "").slice(0, 120) + "...",
            date: formatDate(p.date),
            image,
            alt: media?.alt_text || cleanText(p.title.rendered),
          };
        });

        if (!cancelled) {
          setPosts((prev) => {
            const seen = new Set(prev.map((p) => p.href));
            const next = mapped.filter((m) => !seen.has(m.href));
            return [...prev, ...next];
          });
          setHasMore(data.length === PER_PAGE);
        }

        if (isFirstLoad) didFirstLoadRef.current = true;
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Couldn't load posts right now.");
      } finally {
        if (!cancelled) setLoading(false);
        if (isFirstLoad && !cancelled) stop();
      }
    }

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [categoryId, page, start, stop]);

  const hasAny = posts.length > 0;

  // Hardcoded newsletter values
  const newsletterTitle = "Stay Close";
  const newsletterSubtitle = "A short note when something is worth thinking about. No spam. No noise.";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 relative">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-20 lg:h-24" />

      {/* Full-width container */}
      <div className="mx-auto max-w-[1320px] px-6 pb-16 pt-10">
        <div className="grid grid-cols-12 gap-10 relative">
          {/* FIXED LEFT RAIL – Identity + Share */}
          <aside className="col-span-12 hidden md:block md:col-span-3 lg:col-span-2 xl:fixed xl:top-[80px] xl:left-0 xl:h-[calc(100vh-80px)] xl:overflow-hidden xl:z-20">
            <div className="h-full overflow-y-auto scrollbar-hide">
              <div className="space-y-8 p-6 lg:p-8 xl:p-6">
                {/* Identity */}
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-black/70 dark:text-white/70">By</span>
                    <span className="inline-flex items-center rounded-full border border-black/20 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider dark:border-white/15 dark:bg-zinc-950">
                      Shina Hustle
                    </span>
                  </div>

                  <div className="mt-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest dark:border-white/15 dark:bg-zinc-950">
                      <Sparkles className="h-4 w-4 text-[#968e68]" />
                      {title}
                    </span>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-black/60 dark:text-white/60">
                    Daddieshinor is where tech moves become thought moves.
                  </p>
                </div>

                {/* Share */}
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
                  <p className="text-xs font-black tracking-[0.24em] uppercase text-black/70 dark:text-white/70">
                    Share Category
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <ShareIcon
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      label="Share on Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </ShareIcon>

                    <ShareIcon
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(title)}`}
                      label="Share on X"
                    >
                      <Twitter className="h-5 w-5" />
                    </ShareIcon>

                    <button
                      type="button"
                      onClick={() => {
                        const url = typeof window !== "undefined" ? window.location.href : "";
                        navigator.clipboard.writeText(url);
                      }}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-extrabold uppercase tracking-wider text-black shadow-sm hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                      aria-label="Copy link"
                    >
                      <Link2 className="h-4 w-4" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER CONTENT – scrollable */}
          <main className="col-span-12 md:col-span-6 lg:col-span-7 xl:col-span-8 xl:ml-[16.666%] xl:mr-[25%]">
            {/* Category Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-4 max-w-3xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {description}
                </p>
              )}
              <div className="mt-6 h-1.5 w-32 bg-black dark:bg-white rounded-full" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-10 rounded-2xl border border-red-200/50 bg-red-50/50 p-6 text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && !posts.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : !posts.length && !loading && !error ? (
              <div className="py-20 text-center text-zinc-600 dark:text-zinc-400">
                <p className="text-xl font-medium">No posts found in this category yet.</p>
                <p className="mt-3">Check back soon or explore other sections.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.href}
                    href={post.href}
                    className="
                      group block overflow-hidden rounded-2xl border border-zinc-200/70
                      bg-white shadow-sm transition-all duration-300
                      hover:border-[#968e68]/40 hover:shadow-xl hover:-translate-y-1
                      dark:border-zinc-800/70 dark:bg-zinc-900/60 dark:hover:border-[#968e68]/50
                    "
                  >
                    {/* Featured Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold leading-tight text-black dark:text-white group-hover:text-[#968e68] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <time className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {post.date}
                        </time>
                        <span className="inline-flex items-center rounded-full bg-[#968e68]/10 px-3 py-1 text-xs font-medium text-[#968e68] dark:bg-[#968e68]/20">
                          {title}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && !loading && hasAny && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="
                    inline-flex items-center gap-2 rounded-full border border-zinc-300
                    bg-white px-8 py-4 text-sm font-semibold text-black
                    hover:bg-[#968e68]/10 hover:border-[#968e68] hover:text-[#968e68]
                    disabled:opacity-50 disabled:cursor-not-allowed transition
                    dark:border-zinc-700 dark:bg-zinc-900 dark:text-white
                    dark:hover:bg-[#968e68]/10 dark:hover:border-[#968e68] dark:hover:text-[#a8a07a]
                  "
                >
                  Load more posts
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {loading && hasAny && (
              <div className="mt-12 text-center text-zinc-500 dark:text-zinc-400">
                Loading more...
              </div>
            )}
          </main>

          {/* FIXED RIGHT RAIL – Newsletter + Partner (reduced width) */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3 xl:fixed xl:top-[80px] xl:right-0 xl:w-[25%] xl:max-w-[320px] xl:h-[calc(100vh-80px)] xl:overflow-hidden xl:z-20">
            <div className="h-full overflow-y-auto scrollbar-hide">
              <div className="space-y-6 p-6 lg:p-8 xl:p-6">
                {/* Newsletter card – narrower */}
                <div className="rounded-2xl border border-zinc-300 bg-[#f4f3dc] p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-black/80 dark:border-white/10 dark:bg-zinc-950 dark:text-white/80">
                    Daddieshinor Letters
                  </div>

                  <h3 className="mt-4 text-xl font-black leading-tight">{newsletterTitle}</h3>

                  <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    {newsletterSubtitle}
                  </p>

                  <form className="mt-5 flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="h-11 w-full rounded-xl border border-black/20 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-zinc-800 dark:focus:ring-orange-400/25"
                    />
                    <button
                      type="submit"
                      className="h-11 w-full rounded-xl bg-black px-6 text-sm font-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    >
                      Subscribe
                    </button>
                  </form>

                  <div className="mt-6 flex justify-end text-[11px] text-black/45 dark:text-white/45">
                    <span>powered by fynaro tech</span>
                  </div>
                </div>

                {/* Partner tile – narrower */}
                <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 dark:bg-orange-500/15 dark:ring-orange-400/20">
                      <Handshake className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </span>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-black/70 dark:text-white/70">
                        Partner with Daddieshinor
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-black/75 dark:text-white/75">
                        Thoughtful brands supporting thoughtful readers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
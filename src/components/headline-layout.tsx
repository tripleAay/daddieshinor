// components/CategoryIndexPage.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useGlobalLoader } from "@/components/global-loader";
import { CalendarDays, ChevronRight, AlertCircle } from "lucide-react";

// ────────────────────────────────────────────────
// CONFIG & TYPES
// ────────────────────────────────────────────────
type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered?: string };
  excerpt?: { rendered?: string };
  _embedded?: any;
};

type HeadlinePost = {
  title: string;
  href: string;
  meta: string;
  excerpt: string;
};

type Props = {
  title: string;
  description?: string;
  categoryId: number;
};

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";
const PER_PAGE = 12; // smaller page size = faster loads
const ACCENT = "#968e68";
const ACCENT_HOVER = "#a8a07a";

// ────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────
function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  const el = document.createElement("textarea");
  el.innerHTML = input;
  return el.value;
}

function cleanText(input: unknown): string {
  if (typeof input !== "string") return "";
  return decodeHtmlEntities(input.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CategoryIndexPage({ title, description, categoryId }: Props) {
  const [posts, setPosts] = useState<HeadlinePost[]>([]);
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

        const mapped: HeadlinePost[] = data.map((p) => ({
          title: cleanText(p.title?.rendered) || "Untitled",
          href: `/essays/${p.slug}`,
          meta: formatDate(p.date),
          excerpt: cleanText(p.excerpt?.rendered || "").slice(0, 140) + (cleanText(p.excerpt?.rendered || "").length > 140 ? "..." : ""),
        }));

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

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:py-24">
      {/* Header */}
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
      {loading && !hasAny && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* No posts */}
      {!loading && !hasAny && !error && (
        <div className="py-20 text-center">
          <p className="text-xl font-medium text-zinc-600 dark:text-zinc-400">
            No posts found in this category yet.
          </p>
          <p className="mt-3 text-zinc-500 dark:text-zinc-500">
            Check back soon or explore other sections.
          </p>
        </div>
      )}

      {/* Posts grid */}
      {hasAny && (
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
              {/* Image placeholder (add featured image fetch if available) */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                {/* If you later add featured images:
                <Image src={post.image} alt={post.title} fill className="object-cover" />
                */}
                <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                  <span className="text-4xl opacity-30">...</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold leading-tight text-black dark:text-white group-hover:text-[#968e68] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {post.excerpt || "Read more..."}
                </p>

                <div className="mt-5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <time>{post.meta}</time>
                  <span className="inline-flex items-center rounded-full bg-[#968e68]/10 px-3 py-1 text-xs font-medium text-[#968e68] dark:bg-[#968e68]/20">
                    {title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Load more */}
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

      {/* Loading more indicator */}
      {loading && hasAny && (
        <div className="mt-12 text-center text-zinc-500 dark:text-zinc-400">
          Loading more...
        </div>
      )}
    </section>
  );
}
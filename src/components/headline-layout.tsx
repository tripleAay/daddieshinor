"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";
import { useGlobalLoader } from "@/components/global-loader";

type HeadlinePost = {
  title: string;
  href: string;
};

type Props = {
  title: string;
  description?: string;
  categoryId?: number; // optional category filter
};

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";
const ACCENT = "#968e68";
const ACCENT_HOVER = "#a8a07a";
const ACCENT_BG = "rgba(150, 142, 104, 0.08)";
const PER_PAGE = 15;

function cleanText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function HeadlineLayout({ title, description, categoryId }: Props) {
  const [posts, setPosts] = useState<HeadlinePost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { start, stop } = useGlobalLoader();

  const firstLoadRef = useRef(false);

  useEffect(() => {
    // Safety guard: bail out if WP_BASE_URL is missing
    if (!WP_BASE_URL) {
      setError("WordPress API URL is not configured.");
      setHasMore(false);
      return;
    }

    if (!hasMore) return;

    // Prevent duplicate first-page loads
    if (page === 1 && firstLoadRef.current) return;
    firstLoadRef.current = true;

    let cancelled = false;

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        if (page === 1) start();

        // Build URL safely without assuming WP is defined
        let url = `${WP_BASE_URL.replace(/\/$/, "")}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&status=publish`;

        if (categoryId && categoryId > 0) {
          url += `&categories=${categoryId}`;
        }

        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 400 || res.status === 404) {
            setHasMore(false);
            return;
          }
          throw new Error(`WP API error: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          setHasMore(false);
          return;
        }

        const newPosts: HeadlinePost[] = data.map((post: any) => ({
          title: cleanText(post?.title?.rendered) || "Untitled",
          href: `/essays/${post.slug}`,
        }));

        if (!cancelled) {
          setPosts((prev) => {
            const seen = new Set(prev.map((p) => p.href));
            const unique = newPosts.filter((p) => !seen.has(p.href));
            return [...prev, ...unique];
          });

          if (newPosts.length < PER_PAGE) {
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Failed to load essays. Please try again later.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          if (page === 1) stop();
        }
      }
    }

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [page, hasMore, start, stop, categoryId]);

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 md:py-24">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-6 h-1.5 w-32 mx-auto bg-black dark:bg-white rounded-full" />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-10 rounded-xl border border-red-200/50 bg-red-50/60 p-6 text-center text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300 max-w-3xl mx-auto">
          {error}
        </div>
      )}

      {/* Posts List – centered, clean, no numbers, desktop-optimized */}
      <div className="space-y-5 max-w-3xl mx-auto">
        {posts.length === 0 ? (
          loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-zinc-100 animate-pulse dark:bg-zinc-800"
              />
            ))
          ) : (
            <div className="py-20 text-center text-xl text-zinc-500 dark:text-zinc-400">
              No essays found yet.
            </div>
          )
        ) : (
          posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className={`
                group block px-8 py-8 rounded-2xl
                border border-zinc-200/70
                dark:border-zinc-800/70
                hover:bg-[${ACCENT_BG}] hover:text-[${ACCENT}]
                transition-all duration-300 text-center
                dark:hover:bg-[rgba(150,142,104,0.12)] dark:hover:text-[${ACCENT_HOVER}]
                shadow-sm hover:shadow-lg
              `}
            >
              <h3
                className={`
                  text-xl sm:text-2xl md:text-3xl font-semibold leading-tight
                  text-black dark:text-white
                  group-hover:text-[${ACCENT}] dark:group-hover:text-[${ACCENT_HOVER}]
                  transition-colors
                `}
              >
                {post.title}
              </h3>
            </Link>
          ))
        )}
      </div>

      {/* Load More – centered, larger on desktop */}
      {hasMore && posts.length > 0 && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className={`
              rounded-full border border-zinc-300 bg-white
              px-12 py-5 text-lg font-semibold text-black
              hover:bg-[${ACCENT_BG}] hover:border-[${ACCENT}] hover:text-[${ACCENT}]
              active:scale-95 transition-all duration-200
              dark:border-zinc-700 dark:bg-zinc-900 dark:text-white
              dark:hover:bg-[rgba(150,142,104,0.12)] dark:hover:border-[${ACCENT}] dark:hover:text-[${ACCENT_HOVER}]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? "Loading more..." : "Load More Essays"}
          </button>
        </div>
      )}

      {/* Loaded count */}
      {posts.length > 0 && (
        <p className="mt-10 text-center text-base text-zinc-500 dark:text-zinc-400">
          {posts.length} essays loaded
        </p>
      )}
    </section>
  );
}
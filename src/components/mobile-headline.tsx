"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useGlobalLoader } from "@/components/global-loader";

type HeadlinePost = {
  title: string;
  href: string;
};

/* ------------------ Text utilities ------------------ */

function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  if (typeof document === "undefined") return input;

  const el = document.createElement("textarea");
  el.innerHTML = input;
  return el.value;
}

function cleanWpText(input: unknown): string {
  if (typeof input !== "string") return "";

  let text = input
    .replace(/<\/(p|div|h\d|li|blockquote|section|article)>/gi, " ")
    .replace(/<(br|br\/)\s*\/?>/gi, " ")
    .replace(/<\/?p[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, " ");

  text = decodeHtmlEntities(text);
  text = text.replace(/\[[^\]]*\]/g, " ");
  text = text.replace(/([.!?])([A-Za-z])/g, "$1 $2");

  return text.replace(/\s+/g, " ").trim();
}

/* ------------------ Component ------------------ */

export default function MobileAllPosts() {
  const [posts, setPosts] = useState<HeadlinePost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PER_PAGE = 15;
  const WP = process.env.NEXT_PUBLIC_WP_URL;

  const { start, stop } = useGlobalLoader();

  // Prevent duplicate first-load fetch in Strict Mode
  const firstLoadRef = useRef(false);

  useEffect(() => {
    if (!WP) {
      setError("WordPress API URL is not configured.");
      setHasMore(false);
      return;
    }

    if (!hasMore) return;

    // React Strict Mode protection
    if (page === 1 && firstLoadRef.current) return;
    firstLoadRef.current = true;

    let cancelled = false;

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        if (page === 1) start();

        const url =
          `${WP.replace(/\/$/, "")}` +
          `/wp-json/wp/v2/posts` +
          `?per_page=${PER_PAGE}` +
          `&page=${page}` +
          `&orderby=date&order=desc&status=publish`;

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
          title: cleanWpText(post?.title?.rendered) || "Untitled",
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
  }, [page, WP, hasMore, start, stop]);

  return (
    <section className="lg:hidden mx-auto max-w-[1400px] px-5 py-12 md:py-16">
      {/* Error */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-200/50 bg-red-50/60 p-5 text-center text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-2">
        {posts.length === 0 ? (
          loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-lg bg-zinc-100 animate-pulse dark:bg-zinc-800"
              />
            ))
          ) : (
            <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
              No essays found yet.
            </div>
          )
        ) : (
          posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="
                group block px-4 py-5 sm:px-6 sm:py-6
                border-b border-zinc-200/60 last:border-b-0
                dark:border-zinc-800/60
                hover:bg-zinc-50/70 dark:hover:bg-zinc-900/30
                transition-colors
              "
            >
              <h3
                className="
                  text-center text-lg sm:text-xl font-semibold leading-tight
                  text-black dark:text-white
                  group-hover:text-orange-600 dark:group-hover:text-orange-400
                  transition-colors
                "
              >
                {post.title}
              </h3>
            </Link>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && posts.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="
              rounded-full border border-zinc-300 bg-white
              px-8 py-3.5 text-sm font-semibold
              hover:bg-zinc-50 hover:shadow-sm
              active:scale-95 transition-all
              dark:border-zinc-700 dark:bg-zinc-900 dark:text-white
              disabled:opacity-50
            "
          >
            {loading ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}

      {posts.length > 0 && (
        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {posts.length} essays loaded
        </p>
      )}
    </section>
  );
}

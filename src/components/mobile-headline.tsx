"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HeadlinePost = {
  title: string;
  href: string;
};

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

export default function MobileAllPosts() {
  const [posts, setPosts] = useState<HeadlinePost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PER_PAGE = 15; // good balance for mobile scrolling

  const WP = process.env.NEXT_PUBLIC_WP_URL;

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      if (!hasMore || !WP) return;

      try {
        setLoading(true);
        setError(null);

        const url = `${WP}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&status=publish`;

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          if (res.status === 400) {
            setHasMore(false);
            return;
          }
          throw new Error(`API error: ${res.status}`);
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

          if (newPosts.length < PER_PAGE) setHasMore(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load posts. Try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [page, WP, hasMore]);

  return (
    <section className="lg:hidden mx-auto max-w-[1400px] px-5 py-12 md:py-16">
      {error && (
        <div className="mb-8 rounded-xl border border-red-200/50 bg-red-50/60 p-5 text-center text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Posts List – centered titles */}
      <div className="space-y-2">
        {posts.length === 0 && !loading ? (
          <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
            No essays found yet.
          </div>
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
                active:bg-zinc-100 dark:active:bg-zinc-800/50
                transition-colors duration-200
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

        {loading && (
          <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
            Loading essays…
          </div>
        )}
      </div>

      {/* Load More – centered & mobile-friendly */}
      {hasMore && !loading && posts.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="
              inline-flex items-center justify-center rounded-full
              border border-zinc-300 bg-white px-8 py-3.5
              text-sm font-semibold text-black
              hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-sm
              active:scale-95 transition-all duration-200
              dark:border-zinc-700 dark:bg-zinc-900 dark:text-white
              dark:hover:border-zinc-600 dark:hover:bg-zinc-800
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Load More
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
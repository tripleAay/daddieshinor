"use client";
import { fetchPostsReliably } from "@/lib/reliablePosts";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGlobalLoader } from "@/components/global-loader";

type HeadlinePost = {
  title: string;
  href: string;
};

type Props = {
  title: string;
  description?: string;
  categoryId?: number;
};

const PER_PAGE = 15;

function decodeHtmlEntities(input: string): string {
  if (typeof window === "undefined") return input;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}

function cleanText(input: unknown): string {
  if (typeof input !== "string") return "";

  const withoutTags = input
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return decodeHtmlEntities(withoutTags);
}

export default function HeadlineLayout({
  title,
  description,
  categoryId,
}: Props) {
  const [posts, setPosts] = useState<HeadlinePost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { start, stop } = useGlobalLoader();
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      if (page === 1) start();
      try {
        let path = `/wp-json/wp/v2/posts?_fields=id,slug,title&per_page=${PER_PAGE}&page=${page}&status=publish&orderby=date&order=desc`;
        if (categoryId && categoryId > 0) path += `&categories=${categoryId}`;
        const data = await fetchPostsReliably(path, controller.signal);
        if (!active) return;
        if (!Array.isArray(data)) throw new Error("Unexpected articles response");
        const items: HeadlinePost[] = data.filter((post: any) => typeof post?.slug === "string").map((post: any) => ({
          title: cleanText(post?.title?.rendered) || "Untitled",
          href: `/essays/${encodeURIComponent(post.slug)}`,
        }));
        setPosts(prev => {
          const existing = page === 1 ? [] : prev;
          const seen = new Set(existing.map(item => item.href));
          return [...existing, ...items.filter(item => !seen.has(item.href) && !!seen.add(item.href))];
        });
        setHasMore(items.length === PER_PAGE);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError("Stories are taking longer than expected. Please try again.");
      } finally {
        if (active) { setLoading(false); if (page === 1) stop(); }
      }
    }
    void load();
    return () => { active = false; controller.abort(); if (page === 1) stop(); };
  }, [page, categoryId, retry]);

  return (
    <section className="ds-headline-index mx-auto max-w-[1440px] border-t border-black/20 py-8 dark:border-white/20 md:py-12">
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

      {error && (
        <div className="mb-10 rounded-xl border border-red-200/50 bg-red-50/60 p-6 text-center text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300 max-w-3xl mx-auto">
          <p>{error}</p>
          <button type="button" onClick={() => setRetry(value => value + 1)} className="mt-4 rounded-full bg-[#827c5b] px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2">↻ Retry stories</button>
        </div>
      )}

      <div className="space-y-5 max-w-3xl mx-auto">
        {posts.length === 0 ? (
          loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-zinc-100 animate-pulse dark:bg-zinc-800"
              />
            ))
          ) : error ? null : (
            <div className="py-20 text-center text-xl text-zinc-500 dark:text-zinc-400">
              No essays found yet.
            </div>
          )
        ) : (
          posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="group block px-8 py-8 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 hover:bg-[#968e6814] hover:text-[#968e68] transition-all duration-300 text-center dark:hover:bg-[rgba(150,142,104,0.12)] dark:hover:text-[#a8a07a] shadow-sm hover:shadow-lg"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-black dark:text-white group-hover:text-[#968e68] dark:group-hover:text-[#a8a07a] transition-colors">
                {post.title}
              </h3>
            </Link>
          ))
        )}
      </div>

      {hasMore && posts.length > 0 && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="rounded-full border border-zinc-300 bg-white px-12 py-5 text-lg font-semibold text-black hover:bg-[#968e6814] hover:border-[#968e68] hover:text-[#968e68] active:scale-95 transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-[rgba(150,142,104,0.12)] dark:hover:border-[#968e68] dark:hover:text-[#a8a07a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading more..." : "Load More Essays"}
          </button>
        </div>
      )}

      {posts.length > 0 && (
        <p className="mt-10 text-center text-base text-zinc-500 dark:text-zinc-400">
          {posts.length} essays loaded
        </p>
      )}
    </section>
  );
}
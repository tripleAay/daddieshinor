"use client";

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

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";

const PER_PAGE = 15;

function cleanText(input: unknown): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
  const loaderStartedRef = useRef(false);

  useEffect(() => {
    if (!hasMore) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        if (page === 1 && !loaderStartedRef.current) {
          start();
          loaderStartedRef.current = true;
        }

        let url = `${WP_BASE_URL.replace(
          /\/$/,
          ""
        )}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&status=publish&_fields=id,slug,title`;

        if (categoryId && categoryId > 0) {
          url += `&categories=${categoryId}`;
        }

        const res = await fetch(url, {
          signal: controller.signal,
          cache: "force-cache",
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

        setPosts((prev) => {
          const seen = new Set(prev.map((p) => p.href));
          const unique = newPosts.filter((p) => !seen.has(p.href));
          return [...prev, ...unique];
        });

        if (newPosts.length < PER_PAGE) {
          setHasMore(false);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setError("Loading took too long. Please refresh.");
        } else {
          setError("Failed to load essays. Please try again later.");
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);

        if (page === 1 && loaderStartedRef.current) {
          stop();
          loaderStartedRef.current = false;
        }
      }
    }

    fetchPosts();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [page, categoryId, hasMore]);

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 md:py-24">
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
          {error}
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
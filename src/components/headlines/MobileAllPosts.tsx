"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalLoader } from "@/components/global-loader";

type HeadlinePost = {
  title: string;
  href: string;
};

type Props = {
  categoryId?: number;
};

const PER_PAGE = 15;

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

export default function MobileAllPosts({ categoryId }: Props) {
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

        let wpPath = `/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&status=publish&_fields=id,slug,title`;

        if (categoryId && categoryId > 0) {
          wpPath += `&categories=${categoryId}`;
        }

        const res = await fetch(
          `/api/wp-proxy?path=${encodeURIComponent(wpPath)}`,
          {
            method: "GET",
            signal: controller.signal,
            next: { revalidate: 60 },
          }
        );

        if (!res.ok) {
          if (res.status === 400 || res.status === 404) {
            setHasMore(false);
            return;
          }

          throw new Error(`Proxy error: ${res.status}`);
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
    <section className="lg:hidden mx-auto max-w-[1400px] px-5 py-12 md:py-16">
      {error && (
        <div className="mb-8 rounded-xl border border-red-200/50 bg-red-50/60 p-5 text-center text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4 max-w-3xl mx-auto">
        {posts.length === 0 ? (
          loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-zinc-100 animate-pulse dark:bg-zinc-800"
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
              className="group block px-6 py-6 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-[#968e6814] hover:text-[#968e68] transition-all duration-200 text-center dark:hover:bg-[rgba(150,142,104,0.12)] dark:hover:text-[#a8a07a] shadow-sm hover:shadow-md"
            >
              <h3 className="text-lg sm:text-xl font-semibold leading-tight text-black dark:text-white group-hover:text-[#968e68] dark:group-hover:text-[#a8a07a] transition-colors">
                {post.title}
              </h3>
            </Link>
          ))
        )}
      </div>

      {hasMore && posts.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="rounded-full border border-zinc-300 bg-white px-10 py-4 text-base font-semibold text-black hover:bg-[#968e6814] hover:border-[#968e68] hover:text-[#968e68] active:scale-95 transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-[rgba(150,142,104,0.12)] dark:hover:border-[#968e68] dark:hover:text-[#a8a07a] disabled:opacity-50 disabled:cursor-not-allowed"
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
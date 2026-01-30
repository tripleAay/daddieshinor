"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

type WpPost = {
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
};

function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  const el = document.createElement("textarea");
  el.innerHTML = input;
  return el.value;
}

function cleanWpText(input: unknown): string {
  if (typeof input !== "string") return "";

  const withSpaces = input
    .replace(/<\/(p|div|h\d|li|blockquote|section|article)>/gi, " ")
    .replace(/<(br|br\/)\s*\/?>/gi, " ")
    .replace(/<\/?p[^>]*>/gi, " ");

  const noTags = withSpaces.replace(/<[^>]*>/g, " ");
  const decoded = decodeHtmlEntities(noTags);
  const noShortcodes = decoded.replace(/\[[^\]]*\]/g, " ");

  const spacedPunctuation = noShortcodes
    .replace(/([.!?])([A-Za-z])/g, "$1 $2")
    .replace(/([.!?])(["'“”‘’])([A-Za-z])/g, "$1 $2$3");

  return spacedPunctuation.replace(/\s+/g, " ").trim();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

export default function HeadlineIndex() {
  const [items, setItems] = useState<HeadlinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const PER_PAGE = 30;

  const WP = process.env.NEXT_PUBLIC_WP_URL;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (!WP) throw new Error("NEXT_PUBLIC_WP_URL not configured");

        const url = `${WP}/wp-json/wp/v2/posts?_embed&per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc&status=publish`;

        const res = await fetch(url, { cache: "no-store" });

        // WP uses 400 for "page out of range"
        if (!res.ok) {
          if (res.status === 400) return;
          throw new Error(`WP API error: ${res.status}`);
        }

        const data: WpPost[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;

        const mapped: HeadlinePost[] = data.map((post) => {
          const title = cleanWpText(post?.title?.rendered) || "Untitled";
          return {
            title,
            href: `/essays/${post.slug}`,
            meta: formatDate(post.date),
          };
        });

        if (!cancelled) {
          setItems((prev) => {
            // de-dupe by href
            const seen = new Set(prev.map((p) => p.href));
            const next = mapped.filter((m) => !seen.has(m.href));
            return [...prev, ...next];
          });
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Couldn’t load posts right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [WP, page]);

  const hasAny = useMemo(() => items.length > 0, [items.length]);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:py-24">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">
          All Posts
        </h2>
        <div className="mt-4 h-1.5 w-28 bg-black dark:bg-white" />
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          A headline-driven index — scan fast, click what pulls you in.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden">
        {items.map((p, idx) => (
          <Link
            key={p.href}
            href={p.href}
            className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition"
          >
            <div className="flex items-start gap-4">
              <span className="mt-0.5 w-10 shrink-0 text-sm font-semibold text-zinc-400 dark:text-zinc-600">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="text-base md:text-lg font-semibold text-black dark:text-white group-hover:underline underline-offset-4">
                  {p.title}
                </h3>
              </div>
            </div>

            <time className="shrink-0 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              {p.meta}
            </time>
          </Link>
        ))}

        {!hasAny && !loading && !error && (
          <div className="px-5 py-10 text-center text-zinc-600 dark:text-zinc-400">
            No posts found.
          </div>
        )}

        {loading && (
          <div className="px-5 py-6 text-sm text-zinc-600 dark:text-zinc-400">
            Loading headlines…
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={() => setPage((p) => p + 1)}
          className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-100 transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          disabled={loading}
        >
          Load more
        </button>

        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {items.length} headline{items.length === 1 ? "" : "s"}
        </span>
      </div>
    </section>
  );
}

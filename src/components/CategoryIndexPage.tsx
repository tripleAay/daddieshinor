"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  date: string;
};

type Props = {
  title: string;
  description?: string;
  categoryId: number;
};

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";

function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  if (typeof document === "undefined") return input;
  const el = document.createElement("textarea");
  el.innerHTML = input;
  return el.value;
}

function stripHtml(input: string) {
  return decodeHtmlEntities((input || "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function CategoryIndexPage({ title, description, categoryId }: Props) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        setLoading(true);
        const url =
          `${WP_BASE_URL.replace(/\/$/, "")}/wp-json/wp/v2/posts?_embed` +
          `&status=publish&categories=${categoryId}&per_page=20&orderby=date&order=desc`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        if (!cancelled) setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const mapped = useMemo(
    () =>
      posts.map((p) => ({
        href: `/essays/${p.slug}`,
        title: stripHtml(p.title?.rendered || "Untitled"),
        excerpt: stripHtml(p.excerpt?.rendered || ""),
        date: formatDate(p.date),
      })),
    [posts]
  );

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-zinc-700 dark:text-zinc-300">{description}</p>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : mapped.length === 0 ? (
        <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
          No posts yet.
        </div>
      ) : (
        <div className="space-y-4">
          {mapped.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="
                block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm
                hover:shadow-md hover:border-zinc-300 transition
                dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700
              "
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-extrabold text-black dark:text-white">
                  {p.title}
                </h2>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {p.date}
                </span>
              </div>

              {p.excerpt ? (
                <p className="mt-2 text-sm md:text-base text-zinc-700 dark:text-zinc-300 line-clamp-2">
                  {p.excerpt}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

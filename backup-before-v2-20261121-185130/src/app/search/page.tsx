"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Link2 } from "lucide-react";
import Header from "@/components/header";
import NewsletterCard from "@/components/newsletterCard";

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";

type SearchResult = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
};

type MappedPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
};

function stripHtml(html: string): string {
  return (html || "").replace(/<[^>]+>/g, "").trim();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&search=${encodeURIComponent(
    query
  )}&per_page=12&status=publish`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function ShareSection({ query }: { query: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const shareText = useMemo(() => {
    return query
      ? `Search results for "${query}" on Daddieshinor`
      : "Search Daddieshinor – Essays & Thoughts";
  }, [query]);

  const copyLink = async () => {
    try {
      if (!url) return;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Share this search
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:bg-zinc-50 hover:shadow dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-5 w-5" />
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:bg-zinc-50 hover:shadow dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          aria-label="Share on X"
        >
          <Twitter className="h-5 w-5" />
        </a>

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:bg-zinc-50 hover:shadow dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          aria-label="Copy link"
          title={copied ? "Copied!" : "Copy link"}
        >
          <Link2 className="h-5 w-5" />
        </button>
      </div>

      {copied && (
        <p className="mt-3 text-xs font-semibold text-[#968e68]">Link copied.</p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#D9DCD6]/95 text-black dark:bg-zinc-950 dark:text-white">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
        <Header />
      </div>

      <div className="h-16 lg:h-20" />

      <div className="h-2 w-full bg-gradient-to-r from-black via-[#968e68] to-black dark:from-white dark:via-[#968e68] dark:to-white" />

      <Suspense
        fallback={
          <div className="py-20 text-center text-zinc-500">
            Loading search results...
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}

function SearchContent() {
  const [results, setResults] = useState<MappedPost[]>([]);
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const query = searchParams.get("q")?.trim() || "";

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const raw = await searchPosts(query);
        if (cancelled) return;

        const mapped = raw.map((post) => {
          const title = stripHtml(post.title?.rendered || "Untitled");
          const excerpt =
            stripHtml(post.excerpt?.rendered || "").slice(0, 160) +
            (post.excerpt?.rendered ? "..." : "");
          const image =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            "/fallback.jpg";
          const date = formatDate(post.date);

          return { id: post.id, slug: post.slug, title, excerpt, image, date };
        });

        setResults(mapped);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [query]);

  const resultsCount = results.length;

  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-6 pb-16 sm:px-6 lg:pt-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-10">
        <aside className="hidden md:col-span-3 md:block lg:col-span-2">
          <div className="sticky top-20 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-black tracking-tight text-black dark:text-white">
                Search Results
              </h3>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {query ? (
                  <>
                    Found <strong className="text-[#968e68]">{resultsCount}</strong>{" "}
                    {resultsCount === 1 ? "post" : "posts"} for
                    <br />
                    <span className="font-semibold text-black dark:text-white">
                      "{query}"
                    </span>
                  </>
                ) : (
                  "Enter a keyword to explore essays & thoughts."
                )}
              </p>
            </div>

            <ShareSection query={query} />
          </div>
        </aside>

        <main className="col-span-1 md:col-span-6 lg:col-span-7">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white sm:text-4xl md:text-5xl">
              {query ? (
                <>
                  Results for: <span className="text-[#968e68]">{query}</span>
                </>
              ) : (
                "Search Daddieshinor"
              )}
            </h1>

            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              {loading
                ? "Searching..."
                : results.length > 0
                  ? `${results.length} ${results.length === 1 ? "post" : "posts"} found`
                  : query
                    ? "No results found."
                    : "Find essays, thoughts, culture, tech, branding, life insights, or anything that sparks curiosity."}
            </p>
          </div>

          {(!query || (!loading && results.length === 0)) && (
            <div className="mt-12 text-center">
              <div className="inline-block rounded-2xl border border-zinc-200 bg-zinc-100/80 p-8 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-12">
                <h2 className="text-2xl font-black text-zinc-700 dark:text-zinc-300 sm:text-3xl">
                  {query ? `No matches for "${query}"` : "Start typing to search"}
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-base text-zinc-600 dark:text-zinc-400">
                  {query
                    ? "Try different keywords or browse our latest essays."
                    : "Search for essays, ideas, culture, tech, branding, life insights, or anything that sparks curiosity."}
                </p>
                <Link
                  href="/"
                  className="mt-8 inline-block rounded-full bg-[#968e68] px-8 py-3 text-base font-semibold text-white transition hover:bg-[#968e68]/90 sm:px-10 sm:py-4"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-8 sm:space-y-10">
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={`/essays/${post.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-zinc-200 transition-all duration-300 hover:-translate-y-1 hover:border-[#968e68]/50 hover:shadow-xl dark:border-zinc-800"
                >
                  <div className="grid gap-0 md:grid-cols-12">
                    <div className="relative aspect-[4/3] overflow-hidden md:col-span-4 md:aspect-auto">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-5 md:col-span-8 md:p-8">
                      <h3 className="text-xl font-black leading-tight text-black transition-colors group-hover:text-[#968e68] dark:text-white sm:text-2xl md:text-3xl">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-base text-zinc-600 dark:text-zinc-400 sm:mt-4 text-justify">
                        {post.excerpt}
                      </p>
                      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
                        {post.date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-20 space-y-8">
            <NewsletterCard
              badgeText="Daddieshinor Letters"
              title="Stay Close"
              subtitle="A short note when something is worth thinking about. No spam. No noise."
              buttonText="Subscribe"
              footerText="powered by fynaro tech"
              source="daddieshinor_search_sidebar"
            />

            <div className="rounded-2xl border border-[#968e68]/20 bg-gradient-to-br from-[#968e68]/5 to-white/50 p-6 shadow-md dark:border-[#968e68]/30 dark:from-[#968e68]/10 dark:to-zinc-950/50">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl font-black text-[#968e68]">✦</span>
                <h4 className="text-xl font-extrabold tracking-tight text-[#968e68]">
                  Partnership with Daddieshinor
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                Collaborate with us to reach thoughtful readers across Africa and
                beyond. Sponsored insights, brand stories, and meaningful visibility
                — done with integrity.
              </p>
              <Link
                href="/partnerships"
                className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-[#968e68] transition hover:text-[#a8a07a]"
              >
                Let’s talk →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
// app/search/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Facebook, Twitter, Linkedin, Mail, Link2, Sparkles, Handshake } from "lucide-react";
import Header from "@/components/header";

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";

// Brand accent color
const ACCENT = "#968e68";
const ACCENT_HOVER = "#a8a07a";
const ACCENT_BG = "rgba(150, 142, 104, 0.08)";

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

async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&search=${encodeURIComponent(
    query
  )}&per_page=12&status=publish`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error("Search API failed:", res.status);
      return [];
    }
    return res.json();
  } catch (err) {
    console.error("Search fetch error:", err);
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const metadata: Metadata = {
  title: "Search Daddieshinor – Essays & Thoughts",
  description: "Search through essays, ideas, culture, tech, branding, and life insights.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || "").trim();

  const results = query ? await searchPosts(query) : [];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-20 lg:h-24" />

      {/* Accent bar */}
      <div className="h-3 w-full bg-gradient-to-r from-black via-[#968e68] to-black dark:from-white dark:via-[#968e68] dark:to-white" />

      {/* Main content */}
      <div className="mx-auto max-w-[1320px] px-6 pb-16 pt-10">
        <div className="grid grid-cols-12 gap-10">
          {/* LEFT RAIL – Share + Search Info */}
          <aside className="col-span-12 hidden md:block md:col-span-3 lg:col-span-2">
            <div className="sticky top-24 space-y-8">
              {/* Search Info Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-lg font-black tracking-tight text-black dark:text-white">
                  Search Results
                </h3>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {query ? (
                    <>
                      Found <strong className="text-[#968e68]">{results.length}</strong> {results.length === 1 ? "post" : "posts"} for
                      <br />
                      <span className="font-semibold text-black dark:text-white">"{query}"</span>
                    </>
                  ) : (
                    "Enter a keyword to explore essays & thoughts."
                  )}
                </p>
              </div>

              {/* Share this search */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-4">
                  Share this search
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : ""
                    )}&text=${encodeURIComponent(`Search results for "${query}" on Daddieshinor`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                    aria-label="Share on X"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined") {
                        navigator.clipboard.writeText(
                          typeof window !== "undefined" ? window.location.href : ""
                        );
                      }
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                    aria-label="Copy link"
                  >
                    <Link2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER – Search Results */}
          <main className="col-span-12 md:col-span-6 lg:col-span-7">
            {/* Search Header */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">
                {query ? (
                  <>
                    Results for:{" "}
                    <span className="text-[#968e68]">{query}</span>
                  </>
                ) : (
                  "Search Daddieshinor"
                )}
              </h1>

              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                {results.length > 0
                  ? `${results.length} ${results.length === 1 ? "post" : "posts"} found`
                  : query
                  ? "No results found."
                  : "Find essays, thoughts, culture, tech, branding & life insights."}
              </p>
            </div>

            {/* No results */}
            {(!query || results.length === 0) && (
              <div className="mt-16 text-center">
                <div className="inline-block rounded-2xl bg-zinc-100/80 p-10 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-3xl font-black text-zinc-700 dark:text-zinc-300">
                    {query ? `No matches for "${query}"` : "Start typing to search"}
                  </h2>
                  <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
                    {query
                      ? "Try different keywords or browse our latest essays."
                      : "Search for essays, ideas, culture, tech, branding, life insights, or anything that sparks curiosity."}
                  </p>
                  <Link
                    href="/"
                    className="mt-8 inline-block rounded-full bg-[#968e68] px-10 py-4 text-base font-semibold text-white hover:bg-[#968e68]/90 transition"
                  >
                    Go to Homepage
                  </Link>
                </div>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-10">
                {results.map((post) => {
                  const title = stripHtml(post.title.rendered);
                  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 160) + "...";
                  const image =
                    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                    "/fallback.jpg";
                  const date = formatDate(post.date);

                  return (
                    <Link
                      key={post.id}
                      href={`/essays/${post.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-[#968e68]/50 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
                    >
                      <div className="grid md:grid-cols-12 gap-0">
                        <div className="relative md:col-span-4 aspect-[4/3] md:aspect-auto overflow-hidden">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105 duration-500"
                          />
                        </div>
                        <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-center">
                          <h3 className="text-2xl md:text-3xl font-black leading-tight text-black dark:text-white group-hover:text-[#968e68] transition-colors">
                            {title}
                          </h3>
                          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 line-clamp-3">
                            {excerpt}
                          </p>
                          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
                            {date}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR – Newsletter + Partnership */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              {/* Newsletter */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-xl font-black tracking-tight text-black dark:text-white">
                  Stay Close
                </h3>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  A short note when something is worth thinking about. No spam. No noise.
                </p>
                <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full h-12 px-5 rounded-xl border border-zinc-300 bg-white text-base outline-none focus:border-[#968e68] focus:ring-2 focus:ring-[#968e68]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-[#968e68]"
                  />
                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-black text-white font-bold hover:bg-black/90 transition dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                  powered by beehiiv
                </p>
              </div>

              {/* Partnership Tile */}
              <div className="rounded-2xl border border-[#968e68]/20 bg-gradient-to-br from-[#968e68]/5 to-white/50 p-7 shadow-md dark:from-[#968e68]/10 dark:to-zinc-950/50 dark:border-[#968e68]/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#968e68] font-black text-2xl">✦</span>
                  <h4 className="text-xl font-extrabold text-[#968e68] tracking-tight">
                    Partnership with Daddieshinor
                  </h4>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  Collaborate with us to reach thoughtful readers across Africa and beyond. Sponsored insights, brand stories, and meaningful visibility — done with integrity.
                </p>
                <Link
                  href="/partnerships"
                  className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-[#968e68] hover:text-[#a8a07a] transition"
                >
                  Let’s talk →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
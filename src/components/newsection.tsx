"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGlobalLoader } from "@/components/global-loader";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type CulturePost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  category: "Culture";
  meta: string;
  featured?: boolean;
};

const CULTURE_CATEGORY = { label: "Culture", id: 17 };

// ────────────────────────────────────────────────
// Helpers (kept minimal & SSR-safe)
// ────────────────────────────────────────────────
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

function truncateText(text: string, maxChars: number = 140): string {
  const t = (text || "").trim();
  if (t.length <= maxChars) return t;
  const sliced = t.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > 60 ? sliced.slice(0, lastSpace) : sliced).trim() + "…";
}

function getFeaturedImageData(post: any): { url: string; alt: string } {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const FALLBACK_URL = "/fallback-image.jpg";
  const FALLBACK_ALT = "Culture article featured image";

  const url =
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.source_url ||
    FALLBACK_URL;

  const alt = media?.alt_text?.trim() || FALLBACK_ALT;

  return { url, alt };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// ────────────────────────────────────────────────
// Badge (with optional ring for special categories like Editor’s Pick)
// ────────────────────────────────────────────────
function Badge({ text }: { text: string }) {
  const isSpecial = text === "Editor’s Pick";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
        "border border-white/10 bg-black/60 text-white backdrop-blur",
        isSpecial ? "ring-1 ring-orange-500/40" : "",
      ].join(" ")}
    >
      {text}
    </span>
  );
}

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function LatestCultureSection() {
  const [posts, setPosts] = useState<CulturePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { start, stop } = useGlobalLoader();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      start(); // ✅ global loader begins
      try {
        setLoading(true);
        setError(null);

        const WP = process.env.NEXT_PUBLIC_WP_URL;
        if (!WP) throw new Error("WP URL not configured");

        const PER_PAGE = 7;
        const url = `${WP}/wp-json/wp/v2/posts?_embed&per_page=${PER_PAGE}&categories=${CULTURE_CATEGORY.id}&orderby=date&order=desc&status=publish`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        if (cancelled) return;

        if (!Array.isArray(data) || data.length === 0) {
          setPosts([]);
          return;
        }

        const mapped: CulturePost[] = data.map((post: any, index: number) => {
          const title = cleanWpText(post?.title?.rendered) || "Untitled";
          const excerptRaw = cleanWpText(post?.excerpt?.rendered) || "";
          const excerpt = truncateText(excerptRaw, 110);
          const { url: image, alt } = getFeaturedImageData(post);

          return {
            slug: `/essays/${post.slug}`,
            title,
            excerpt,
            image,
            alt,
            category: CULTURE_CATEGORY.label as "Culture",
            meta: formatDate(post.date),
            featured: index === 0,
          };
        });

        setPosts(mapped);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Couldn't load latest culture stories.");
      } finally {
        if (!cancelled) setLoading(false);
        if (!cancelled) stop(); // ✅ global loader ends
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [start, stop]);

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  if (error) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-12 text-center text-red-600">
        {error}
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-[1400px] px-5 py-10 md:py-12 lg:py-16">
        {/* Header - exact match */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-black dark:text-white md:text-5xl">
              Culture
            </h2>
            <p className="mt-2 max-w-xl text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Identity, internet shifts, and what it says about how we live now.
            </p>
          </div>

          <Link
            href="/culture"
            className="
              inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-bold text-black transition
              hover:border-zinc-300 hover:bg-zinc-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white
              dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-zinc-700 dark:hover:bg-zinc-950
              dark:focus-visible:ring-offset-black
            "
          >
            More <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mb-10 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        {loading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="aspect-[4/5] bg-zinc-200 dark:bg-zinc-900 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-52 bg-zinc-200 dark:bg-zinc-900 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-zinc-500">No culture stories found yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Featured Story */}
            {featured && (
              <article className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-[0_12px_40px_rgba(0,0,0,0.10)] transition hover:shadow-[0_18px_55px_rgba(0,0,0,0.14)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                <Link
                  href={featured.slug}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                  aria-label={featured.title}
                >
                  <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4] lg:aspect-[4/5]">
                    <Image
                      src={featured.image}
                      alt={featured.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 motion-reduce:transition-none group-hover:opacity-100">
                      <div className="absolute -top-24 left-1/2 h-48 w-[140%] -translate-x-1/2 rotate-6 bg-white/10 blur-2xl" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <Badge text={featured.category} />
                    <h3 className="mt-4 line-clamp-3 text-2xl font-extrabold leading-tight text-white transition-colors group-hover:text-orange-300 md:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="mt-3 text-sm font-medium text-zinc-200/90">
                      Tap to read the full story.
                    </p>
                  </div>
                </Link>
              </article>
            )}

            {/* Right Column: Cards */}
            <div className="grid grid-cols-1 gap-6">
              {rest.map((item) => (
                <article
                  key={item.slug}
                  className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <Link
                    href={item.slug}
                    className="flex flex-col gap-5 md:flex-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                    aria-label={item.title}
                  >
                    <div className="relative h-52 w-full shrink-0 overflow-hidden md:h-auto md:w-1/2 lg:w-2/5">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-100" />
                    </div>

                    <div className="flex flex-1 flex-col justify-center p-5">
                      <div className="flex items-center justify-between gap-3">
                        <Badge text={item.category} />
                        <span className="hidden text-xs font-semibold text-zinc-500 dark:text-zinc-500 sm:inline">
                          {item.meta.split(",")[0].trim()}
                        </span>
                      </div>

                      <h4 className="mt-3 line-clamp-3 text-lg font-extrabold leading-snug text-black transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400 md:text-xl">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {item.excerpt}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-zinc-700 transition group-hover:text-black dark:text-zinc-300 dark:group-hover:text-white">
                        Read
                        <span
                          aria-hidden
                          className="transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

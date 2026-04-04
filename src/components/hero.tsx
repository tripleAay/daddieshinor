"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalLoader } from "@/components/global-loader";
import ThoughtItem from "@/components/thoughtItem";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type Slide = {
  tag: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  alt: string;
  featured?: boolean;
};

type Thought = {
  tag: string;
  title: string;
  image: string;
  href: string;
};

// ────────────────────────────────────────────────
// Fallback data
// ────────────────────────────────────────────────
const fallbackSlides: Slide[] = [
  {
    tag: "Tech",
    title: "Why AI will reward thinkers, not hustlers",
    excerpt:
      "The era of loud hustle is fading. The winners will be the ones who can think clearly, synthesize fast, and ship with depth.",
    href: "/essays/why-ai-will-reward-thinkers-not-hustlers",
    image: "/fallback-image.jpg",
    alt: "Abstract AI visual representing deep thinking",
    featured: true,
  },
];

const fallbackThoughts: Thought[] = [
  {
    tag: "Tech",
    title: "Why most African tech products don’t fail because of technology",
    image: "/fallback-image.jpg",
    href: "/essays/why-most-african-tech-products-dont-fail-because-of-technology",
  },
];

// ────────────────────────────────────────────────
// Utilities
// ────────────────────────────────────────────────
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
    .replace(/<\/?p[^>]*>/gi, " ")
    .replace(/&#8230;/g, "…");

  const noTags = withSpaces.replace(/<[^>]*>/g, " ");
  const decoded = decodeHtmlEntities(noTags);
  const noShortcodes = decoded.replace(/\[[^\]]*\]/g, " ");

  const spacedPunctuation = noShortcodes
    .replace(/([.!?])([A-Za-z])/g, "$1 $2")
    .replace(/([.!?])(["'“”‘’])([A-Za-z])/g, "$1 $2$3");

  return spacedPunctuation.replace(/\s+/g, " ").trim();
}

function truncateText(text: string, maxChars: number): string {
  const t = (text || "").trim();
  if (!t) return "";
  if (t.length <= maxChars) return t;

  const sliced = t.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(" ");
  const safe = lastSpace > 60 ? sliced.slice(0, lastSpace) : sliced;

  return `${safe.trim()}…`;
}

function getWpCategoryName(post: any): string {
  const terms = post?._embedded?.["wp:term"];
  const cats = Array.isArray(terms) ? terms.flat() : [];

  const raw =
    cats.find((t: any) => t?.taxonomy === "category")?.name ||
    post?._embedded?.["wp:term"]?.[0]?.[0]?.name ||
    "Uncategorized";

  return cleanWpText(raw) || "Uncategorized";
}

function getFeaturedImage(
  post: any,
  size: "large" | "medium" | "thumbnail" = "large"
): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return "/fallback-image.jpg";

  return (
    media.media_details?.sizes?.[size]?.source_url ||
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium?.source_url ||
    media.source_url ||
    "/fallback-image.jpg"
  );
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-zinc-200/70 dark:bg-zinc-800/70 ${className}`}
    />
  );
}

// ────────────────────────────────────────────────
// HeroSkeleton
// ────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:py-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10 animate-pulse">
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-56 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="hidden sm:flex gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="h-16 md:h-20 lg:h-24 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="aspect-[16/10] w-full rounded-[28px] bg-zinc-200 dark:bg-zinc-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10" />
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-1 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-5">
              <div className="h-24 w-24 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="aspect-[4/5] rounded-[28px] bg-zinc-200 dark:bg-zinc-800 shadow-2xl" />
          <div className="rounded-[28px] bg-zinc-200 dark:bg-zinc-800 h-44" />
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────
// Main Hero Component
// ────────────────────────────────────────────────
export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { start, stop } = useGlobalLoader();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    start();

    let isCancelled = false;

    async function fetchPosts() {
      try {
        setError(null);

        const proxyUrl = `/api/wp-proxy?path=${encodeURIComponent(
          "/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed=1"
        )}`;

        const res = await fetch(proxyUrl, { cache: "no-store" });

        if (!res.ok) {
          const errorText = await res.text().catch(() => "No response");
          throw new Error(
            `Proxy / WP API error - status: ${res.status} - ${errorText}`
          );
        }

        const posts = await res.json();

        if (!Array.isArray(posts) || posts.length === 0) {
          throw new Error("No posts returned from API");
        }

        const FEATURED_EXCERPT_CHARS = 180;

        const mappedSlides = posts.slice(0, 4).map((post: any, idx: number) => {
          const title = cleanWpText(post.title?.rendered) || "Untitled";
          const rawExcerpt = cleanWpText(post.excerpt?.rendered) || "";
          const excerpt = truncateText(rawExcerpt, FEATURED_EXCERPT_CHARS);

          return {
            tag: getWpCategoryName(post),
            title,
            excerpt,
            href: `/essays/${post.slug}`,
            image: getFeaturedImage(post, "large"),
            alt: title || "Post image",
            featured: idx === 0,
          };
        });

        const mappedThoughts = posts.slice(4, 10).map((post: any) => {
          const title = cleanWpText(post.title?.rendered) || "Untitled";
          return {
            tag: getWpCategoryName(post),
            title,
            image: getFeaturedImage(post, "thumbnail"),
            href: `/essays/${post.slug}`,
          };
        });

        if (!isCancelled && isMounted.current) {
          setSlides(mappedSlides.length ? mappedSlides : fallbackSlides);
          setThoughts(mappedThoughts.length ? mappedThoughts : fallbackThoughts);
        }
      } catch (err: any) {
        console.error("[Hero] Fetch error:", err?.message || err);

        if (!isCancelled && isMounted.current) {
          const msg = String(err?.message || "Unknown error");
          setError(
            msg.includes("status: 0") || msg.includes("Failed to fetch")
              ? "Cannot reach WordPress — showing fallback"
              : `Failed to load latest content: ${msg}`
          );
          setSlides(fallbackSlides);
          setThoughts(fallbackThoughts);
        }
      } finally {
        if (!isCancelled && isMounted.current) {
          setLoading(false);
        }
        stop();
      }
    }

    fetchPosts();

    return () => {
      isCancelled = true;
      isMounted.current = false;
      stop();
    };
  }, [start, stop]);

  const ordered = useMemo(() => {
    const featured = slides.find((s) => s.featured) ?? slides[0];
    const rest = slides.filter((s) => s !== featured);
    return featured ? [featured, ...rest] : fallbackSlides;
  }, [slides]);

  const [index, setIndex] = useState(0);
  const hoveringRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    if (ordered.length <= 1) return;

    const timer = setInterval(() => {
      if (!mountedRef.current || hoveringRef.current) return;
      setIndex((prev) => (prev + 1) % ordered.length);
    }, 5000);

    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [ordered.length]);

  useEffect(() => {
    if (index >= ordered.length) setIndex(0);
  }, [ordered.length, index]);

  const active = ordered[index] ?? ordered[0];

  if (loading) return <HeroSkeleton />;

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-10 md:py-14 lg:py-20">
      <style>{`
        @keyframes brandFloat {
          0%, 20% {
            transform: translateY(0);
          }
          30%, 45% {
            transform: translateY(-28px);
          }
          55%, 70% {
            transform: translateY(-56px);
          }
          80%, 100% {
            transform: translateY(-84px);
          }
        }
      `}</style>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/80 p-5 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-12">
        {/* LEFT — Featured Story */}
        <div className="lg:col-span-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-3 rounded-full border border-black/15 bg-white/90 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-black shadow-sm dark:border-white/10 dark:bg-zinc-950/85 dark:text-white">
              Featured Story
              <span className="inline-block h-2 w-2 rounded-full bg-[#968e68] animate-pulse" />
              <span className="text-[#968e68]">{active.tag}</span>
            </span>

            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setIndex((i) => (i - 1 + ordered.length) % ordered.length)}
                className="h-11 w-11 rounded-full border border-zinc-300 bg-white text-lg font-bold text-black transition hover:-translate-y-0.5 hover:border-[#968e68] hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                onClick={() => setIndex((i) => (i + 1) % ordered.length)}
                className="h-11 w-11 rounded-full border border-zinc-300 bg-white text-lg font-bold text-black transition hover:-translate-y-0.5 hover:border-[#968e68] hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>

          <Link
            href={active.href}
            className="group block"
            onMouseEnter={() => (hoveringRef.current = true)}
            onMouseLeave={() => (hoveringRef.current = false)}
          >
            <div className="max-w-4xl">
              <h1 className="text-[2rem] font-black leading-[0.98] tracking-[-0.03em] text-black transition-colors duration-300 group-hover:text-[#968e68] dark:text-white sm:text-5xl lg:text-6xl xl:text-[4.2rem]">
                {active.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-700 dark:text-zinc-300 md:text-lg">
                {active.excerpt}
              </p>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-[30px] border border-black/10 bg-zinc-100 shadow-[0_18px_60px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src={active.image}
                  alt={active.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 55vw, 52vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/55 p-4 text-white backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/95">
                      {active.tag}
                    </span>
                    <span className="text-sm text-white/80">
                      Read full story
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {ordered.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          setIndex(i);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? "w-8 bg-[#968e68]" : "w-2 bg-white/45"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="mt-6 flex justify-between sm:hidden">
            <button
              onClick={() => setIndex((i) => (i - 1 + ordered.length) % ordered.length)}
              className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-bold transition hover:border-[#968e68] hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              ← Prev
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % ordered.length)}
              className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-bold transition hover:border-[#968e68] hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Next →
            </button>
          </div>
        </div>

        {/* CENTER — Recent Thoughts */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#968e68]">
                Fresh Reading
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-black dark:text-white">
                Recent Thoughts
              </h2>
            </div>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#968e68] via-[#968e68]/80 to-transparent" />
          </div>

          <div
            className="
              relative flex-1 overflow-y-auto overscroll-contain
              -mr-2 pr-2 lg:-mr-3 lg:pr-3
              max-h-[650px] lg:max-h-[760px]
              scrollbar-thin scrollbar-thumb-zinc-300/60 scrollbar-track-transparent
              hover:scrollbar-thumb-zinc-400/90
              dark:scrollbar-thumb-zinc-700/50 dark:hover:scrollbar-thumb-zinc-600/90
            "
          >
            <div className="space-y-8 pb-12">
              {thoughts.map((t, i) => (
                <div key={t.href} className="group">
                  <ThoughtItem
                    tag={t.tag}
                    title={t.title}
                    image={t.image}
                    href={t.href}
                  />
                  {i < thoughts.length - 1 && (
                    <Divider className="mt-8 opacity-50 transition-opacity duration-300 group-hover:opacity-90" />
                  )}
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 via-white/55 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent" />
          </div>
        </div>

        {/* RIGHT — Brand / Partnership Rail */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Editorial Tile */}
          <div
  role="button"
  tabIndex={0}
  aria-label="Daddieshinor editorial visual"
  className="
    group cursor-pointer overflow-hidden rounded-[30px]
    border border-black/10 dark:border-white/10
    shadow-[0_18px_60px_rgba(0,0,0,0.18)]
    transition-all duration-500 ease-out
    hover:-translate-y-1.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.28)]
  "
  onClick={(e) => e.preventDefault()}
>
  <div className="relative aspect-[4/5] overflow-hidden">
    <Image
      src="/images/daddieshinor.jpg"
      alt="Daddieshinor editorial visual"
      fill
      sizes="(max-width: 1024px) 100vw, 20vw"
      className="
        object-cover
        transition-transform duration-700 ease-out
        group-hover:scale-[1.06]
      "
      priority
    />

    {/* subtle premium overlay (very light) */}
    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-500" />
  </div>
</div>

          {/* Partnership Tile */}
          <div className="relative overflow-hidden rounded-[30px] border border-[#968e68]/25 bg-gradient-to-br from-[#968e68]/10 via-white to-[#968e68]/[0.02] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#968e68]/45 hover:shadow-[0_18px_55px_rgba(0,0,0,0.10)] dark:border-[#968e68]/20 dark:from-[#968e68]/12 dark:via-zinc-950 dark:to-zinc-950">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#968e68]/60 to-transparent" />

            <div className="flex items-center gap-2.5">
              <span className="text-[#968e68] text-base leading-none">✦</span>
              <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#968e68]">
                Partnership
              </h4>
            </div>

            <div className="relative mt-5 h-12 overflow-hidden">
              <div
                className="absolute inset-0 flex flex-col gap-4 text-[13px] leading-tight text-zinc-700 dark:text-zinc-300"
                style={{ animation: "brandFloat 10s linear infinite" }}
              >
                <p>Thoughtful brand visibility.</p>
                <p>Reach readers with depth.</p>
                <p>Quiet influence. Real meaning.</p>
                <p>Thoughtful brand visibility.</p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Built for brands that want presence with substance — not noise.
            </p>

            <Link
              href="/partnerships"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#968e68] transition-all duration-200 hover:translate-x-1 hover:text-[#7f764f]"
            >
              Explore partnerships →
            </Link>
          </div>

          <div
  role="button"
  tabIndex={0}
  aria-label="Daddieshinor editorial visual"
  className="
    group cursor-pointer overflow-hidden rounded-[30px]
    border border-black/10 dark:border-white/10
    shadow-[0_18px_60px_rgba(0,0,0,0.18)]
    transition-all duration-500 ease-out
    hover:-translate-y-1.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.28)]
  "
  onClick={(e) => e.preventDefault()}
>
  <div className="relative aspect-[4/5] overflow-hidden">
    <Image
      src="/images/premium_photo-1742995782977-ee4b53fecadb.jpg"
      alt="Daddieshinor editorial visual"
      fill
      sizes="(max-width: 1024px) 100vw, 20vw"
      className="
        object-cover
        transition-transform duration-700 ease-out
        group-hover:scale-[1.06]
      "
      priority
    />

    {/* subtle premium overlay (very light) */}
    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-500" />
  </div>
</div>
        </div>
      </div>
    </section>
  );
}
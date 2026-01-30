"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
    href: "/why-ai-will-reward-thinkers-not-hustlers",
    image: "/hero/tech-ai-thinkers.jpg",
    alt: "Abstract AI visual representing deep thinking",
    featured: true,
  },
];

const fallbackThoughts: Thought[] = [
  {
    tag: "Tech",
    title: "Why most African tech products don’t fail because of technology",
    image: "/story-1.jpg",
    href: "/why-most-african-tech-products-dont-fail-because-of-technology",
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

/**
 * Cleans WP rendered HTML (title/excerpt/category name) into readable plain text:
 * - converts <br>, </p>, </div>, </li> into spaces BEFORE stripping
 * - strips remaining tags
 * - decodes entities (&amp; &#8230; etc)
 * - removes shortcodes ([caption] etc)
 * - ensures space after punctuation: "importance.Fast" -> "importance. Fast"
 * - collapses whitespace
 */
function cleanWpText(input: unknown): string {
  if (typeof input !== "string") return "";

  const withSpaces = input
    // turn block closings into spaces
    .replace(/<\/(p|div|h\d|li|blockquote|section|article)>/gi, " ")
    // br -> space
    .replace(/<(br|br\/)\s*\/?>/gi, " ")
    // opening p tags -> space (some themes do weird concatenation)
    .replace(/<\/?p[^>]*>/gi, " ")
    // common WP ellipsis entity sometimes appears as a literal token in content
    .replace(/&#8230;/g, "…");

  const noTags = withSpaces.replace(/<[^>]*>/g, " ");
  const decoded = decodeHtmlEntities(noTags);
  const noShortcodes = decoded.replace(/\[[^\]]*\]/g, " ");

  // Add a space after sentence punctuation when followed immediately by a letter or quote
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

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";

  useEffect(() => {
    let isCancelled = false;

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=10&status=publish&orderby=date&order=desc`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error(`API responded with ${res.status}`);

        const posts = await res.json();

        if (!Array.isArray(posts) || posts.length === 0) {
          throw new Error("No posts found");
        }

        // Limits (tune this freely)
        const FEATURED_EXCERPT_CHARS = 180;

        // Map slides (first 4)
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

        // Map thoughts (next 6)
        const mappedThoughts = posts.slice(4, 10).map((post: any) => {
          const title = cleanWpText(post.title?.rendered) || "Untitled";
          return {
            tag: getWpCategoryName(post),
            title,
            image: getFeaturedImage(post, "thumbnail"),
            href: `/essays/${post.slug}`,
          };
        });

        if (!isCancelled) {
          setSlides(mappedSlides.length ? mappedSlides : fallbackSlides);
          setThoughts(mappedThoughts.length ? mappedThoughts : fallbackThoughts);
        }
      } catch (err: any) {
        console.error(err);
        if (!isCancelled) {
          setError("Failed to load latest content — using fallback data.");
          setSlides(fallbackSlides);
          setThoughts(fallbackThoughts);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      isCancelled = true;
    };
  }, [WP_BASE_URL]);

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
    }, 4500);

    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [ordered.length]);

  // Safety: reset index if array shrinks
  useEffect(() => {
    if (index >= ordered.length) setIndex(0);
  }, [ordered.length, index]);

  const active = ordered[index] ?? ordered[0];

  if (loading) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-20 text-center">
        <div className="animate-pulse text-2xl font-semibold">Loading latest essays...</div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 md:py-14 lg:py-20">
      {error && (
        <div className="mb-8 rounded-xl bg-red-50/80 p-5 text-red-800 dark:bg-red-950/40 dark:text-red-200 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* LEFT — Featured Carousel */}
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="inline-flex items-center gap-3 rounded-full border border-black/30 bg-white/90 px-5 py-2 text-sm font-extrabold tracking-wider text-black shadow-sm dark:bg-black/80 dark:text-white dark:border-white/20">
              FEATURED ESSAY
              <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="font-bold text-orange-600">{active.tag.toUpperCase()}</span>
            </span>

            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setIndex((i) => (i - 1 + ordered.length) % ordered.length)}
                className="h-10 w-10 rounded-full border border-zinc-300 bg-white text-xl font-bold text-black hover:bg-zinc-100 transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                onClick={() => setIndex((i) => (i + 1) % ordered.length)}
                className="h-10 w-10 rounded-full border border-zinc-300 bg-white text-xl font-bold text-black hover:bg-zinc-100 transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
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
            <h3 className="text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight text-black dark:text-white">
              {active.title}
            </h3>

            <p className="mt-5 text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl">
              {active.excerpt}
            </p>

            <div className="relative mt-8 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
              <div className="relative aspect-[16/10]">
                <Image
                  src={active.image}
                  alt={active.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 bg-black/70 px-6 py-4 text-white backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest">
                    {active.tag}
                  </span>
                  <span className="text-sm font-medium opacity-90">Read full essay →</span>
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
                        i === index ? "w-8 bg-orange-500" : "w-2 bg-white/50"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/* Mobile arrows */}
          <div className="mt-6 flex justify-between sm:hidden">
            <button
              onClick={() => setIndex((i) => (i - 1 + ordered.length) % ordered.length)}
              className="px-5 py-3 rounded-full border border-zinc-300 text-lg font-bold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              ← Prev
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % ordered.length)}
              className="px-5 py-3 rounded-full border border-zinc-300 text-lg font-bold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Next →
            </button>
          </div>
        </div>

        {/* CENTER — Recent Thoughts */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-6 flex items-center justify-between shrink-0">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white">
              Recent Thoughts
            </h2>
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-black to-zinc-500 dark:from-white dark:to-zinc-400" />
          </div>

          <div
            className="
              flex-1 overflow-y-auto pr-3
              max-h-[620px] lg:max-h-[720px] xl:max-h-[800px]
              scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-transparent
              hover:scrollbar-thumb-zinc-500
              dark:scrollbar-thumb-zinc-600 dark:hover:scrollbar-thumb-zinc-500
            "
          >
            <div className="space-y-8 pb-6">
              {thoughts.map((t, i) => (
                <React.Fragment key={t.href}>
                  <ThoughtItem tag={t.tag} title={t.title} image={t.image} href={t.href} />
                  {i < thoughts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Editor’s Pick */}
        <div className="lg:col-span-2">
          <Link href="/essays/your-true-size" className="group block">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-black to-zinc-950 text-white shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:-translate-y-1">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/editors-pick.jpg"
                  alt="Your true size"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              </div>
              <div className="p-6">
                <span className="inline-block rounded-full border border-white/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                  Editor’s Pick
                </span>
                <h3 className="mt-4 text-2xl font-extrabold leading-tight group-hover:text-zinc-100 transition">
                  How big you really are (and why you forgot)
                </h3>
                <p className="mt-3 text-sm text-zinc-300">
                  A quiet reminder about self-worth • Jan 2026
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ThoughtItem({ tag, title, image, href }: Thought) {
  return (
    <Link href={href} className="group flex gap-5 hover:cursor-pointer">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-black/10 dark:ring-white/10 transition-transform group-hover:scale-105">
        <Image src={image} alt={title} fill sizes="96px" className="object-cover" />
      </div>
      <div className="flex-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-black/70 dark:text-white/60">
          {tag}
        </span>
        <h4 className="mt-2 text-lg font-bold leading-tight text-black dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
          {title}
        </h4>
      </div>
    </Link>
  );
}

function Divider() {
  return <div className="h-px w-full bg-zinc-200/70 dark:bg-zinc-800/70" />;
}


function HeroSkeleton() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 md:py-14 lg:py-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12 animate-pulse">
        {/* Left — Featured area skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-44 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="hidden sm:flex gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="h-20 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-6 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-6 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="aspect-[16/10] w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800 shadow-2xl" />
        </div>

        {/* Center — Recent Thoughts skeleton */}
        <div className="lg:col-span-5 space-y-8">
          <div className="h-12 w-64 rounded bg-zinc-200 dark:bg-zinc-800" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-5">
              <div className="h-24 w-24 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-4/6 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>

        {/* Right — Editor’s Pick skeleton */}
        <div className="lg:col-span-2">
          <div className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-4 space-y-3">
            <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </section>
  );
}
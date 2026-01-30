// components/TechSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

/* ────────────────────────────────────────────────
   CONFIG
──────────────────────────────────────────────── */
const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";

// ✅ Change this to your REAL Tech category ID in WordPress
const TECH_CATEGORY_ID = 4;

/* ────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────── */
type TechPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  label: string; // e.g. "Tech"
  tag: string;   // e.g. "AI", "Product", "Design" (optional)
};

/* ────────────────────────────────────────────────
   TEXT UTILITIES (SAME STANDARD AS HERO)
──────────────────────────────────────────────── */
function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  const el = document.createElement("textarea");
  el.innerHTML = input;
  return el.value;
}

function cleanWpText(input: unknown): string {
  if (typeof input !== "string") return "";

  // keep spacing sane + decode entities
  const cleaned = input
    .replace(/<\/(p|div|h\d|li|blockquote|section|article)>/gi, " ")
    .replace(/<(br|br\/)\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // fix: "importance.Fast" → "importance. Fast"
  const spacedPunctuation = cleaned.replace(/([.!?])([A-Za-z])/g, "$1 $2");

  return decodeHtmlEntities(spacedPunctuation);
}

function truncate(text: string, max = 140) {
  const t = (text || "").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function getFeaturedImage(post: any): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  // ✅ Make sure this exists in /public
  const FALLBACK = "/fallback-image.jpg";

  const url =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url;

  return typeof url === "string" && url.length > 0 ? url : FALLBACK;
}

/* ────────────────────────────────────────────────
   UI BITS
──────────────────────────────────────────────── */
function LanePill({ lane }: { lane: string }) {
  return (
    <span className="inline-flex rounded-full bg-black/70 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
      {lane}
    </span>
  );
}

/* ────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────── */
export default function TechSection() {
  const [posts, setPosts] = useState<TechPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchTech() {
      try {
        setLoading(true);

        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&categories=${TECH_CATEGORY_ID}&per_page=6&orderby=date&order=desc`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch tech posts");

        const data = await res.json();
        if (cancelled) return;

        const mapped: TechPost[] = (Array.isArray(data) ? data : []).map((post: any) => {
          const title = cleanWpText(post?.title?.rendered) || "Untitled";
          const excerpt = truncate(cleanWpText(post?.excerpt?.rendered) || "", 140);

          // Optional: use ACF fields if you have them
          const tag = cleanWpText(post?.acf?.tech_tag) || "Tech";

          return {
            slug: `/essays/${post.slug}`, // keep your main essays route
            title,
            excerpt,
            image: getFeaturedImage(post),
            alt: title,
            label: "Tech",
            tag,
          };
        });

        setPosts(mapped);
      } catch (err) {
        console.error(err);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTech();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(() => posts[0], [posts]);
  const rest = useMemo(() => posts.slice(1), [posts]);

  if (loading || !featured) return null;

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-[1400px] px-5 py-14">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black md:text-5xl text-black dark:text-white">
              Tech
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Signals, shifts, and real implications — tech explained with human meaning.
            </p>
          </div>

          <Link
            href="/tech"
            className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-bold hover:bg-zinc-50 transition
                       dark:border-zinc-800 dark:hover:bg-zinc-900 dark:text-white"
          >
            More →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* FEATURED */}
          <article className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <Link href={featured.slug}>
              <div className="relative aspect-[4/5]">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 p-6 text-white">
                <div className="flex gap-2 mb-3 items-center">
                  <LanePill lane={featured.tag} />
                  <span className="text-xs font-bold uppercase opacity-90">{featured.label}</span>
                </div>

                <h3 className="text-2xl font-extrabold">{featured.title}</h3>

                <p className="mt-3 text-sm opacity-90">{featured.excerpt}</p>

                <p className="mt-4 text-sm font-bold text-white/90">
                  Read full story <span aria-hidden>→</span>
                </p>
              </div>
            </Link>
          </article>

          {/* REST */}
          <div className="space-y-6">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="rounded-xl border border-zinc-200 p-5 hover:shadow-md transition
                           dark:border-zinc-800 dark:bg-zinc-950"
              >
                <Link href={post.slug}>
                  <div className="flex items-center justify-between gap-3">
                    <LanePill lane={post.tag} />
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-500">
                      Daddieshinor
                    </span>
                  </div>

                  <h4 className="mt-3 text-lg font-extrabold text-black dark:text-white">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-zinc-700 transition hover:text-black dark:text-zinc-300 dark:hover:text-white">
                    Read <span aria-hidden>→</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

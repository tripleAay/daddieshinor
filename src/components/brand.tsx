"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useGlobalLoader } from "@/components/global-loader";

// ────────────────────────────────────────────────
// CONFIG
// ────────────────────────────────────────────────
const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";
const BRANDS_CATEGORY_ID = 13;

// Brand accent color
const ACCENT = "#968e68";
const ACCENT_HOVER = "#a8a07a"; // lighter variant for hover states
const ACCENT_GLOW = "rgba(150, 142, 104, 0.25)"; // for subtle shadow/glow

// ────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────
type BrandPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  brand: string;
  lane: string;
};

// ────────────────────────────────────────────────
// TEXT UTILITIES
// ────────────────────────────────────────────────
function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  const el = document.createElement("textarea");
  el.innerHTML = input;
  return el.value;
}

function cleanWpText(input: unknown): string {
  if (typeof input !== "string") return "";

  return decodeHtmlEntities(
    input
      .replace(/<\/(p|div|h\d|li|blockquote)>/gi, " ")
      .replace(/<(br|br\/)\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
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
  return (
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url ||
    "/fallback.jpg"
  );
}

// ────────────────────────────────────────────────
// UI BITS
// ────────────────────────────────────────────────
function LanePill({ lane }: { lane: string }) {
  return (
    <span
      className={`
        inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider
        bg-[#968e68]/10 text-[#968e68] border border-[#968e68]/20
        dark:bg-[#968e68]/20 dark:text-[#a8a07a] dark:border-[#968e68]/30
      `}
    >
      {lane}
    </span>
  );
}

// ────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────
export default function BrandsSection() {
  const [posts, setPosts] = useState<BrandPost[]>([]);
  const [loading, setLoading] = useState(true);

  const { start, stop } = useGlobalLoader();

  useEffect(() => {
    let cancelled = false;

    async function fetchBrands() {
      start();
      try {
        setLoading(true);

        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&categories=${BRANDS_CATEGORY_ID}&per_page=6&orderby=date&order=desc`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch brands");

        const data = await res.json();

        if (cancelled) return;

        const mapped: BrandPost[] = (Array.isArray(data) ? data : []).map((post: any) => {
          const title = cleanWpText(post.title?.rendered) || "Untitled";
          const excerpt = truncate(cleanWpText(post.excerpt?.rendered) || "");

          return {
            slug: `/brands/${post.slug}`,
            title,
            excerpt: excerpt || "Read the full breakdown →",
            image: getFeaturedImage(post),
            alt: title,
            brand: post?.acf?.brand_name || "Brand Analysis",
            lane: post?.acf?.brand_lane || "Strategy",
          };
        });

        setPosts(mapped);
      } catch (err) {
        console.error(err);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
          stop();
        }
      }
    }

    fetchBrands();
    return () => {
      cancelled = true;
    };
  }, [start, stop]);

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
              Brands
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Brand moves, design decisions, and strategy shifts — explained without fluff.
            </p>
          </div>

          <Link
            href="/brands"
            className={`
              rounded-full border border-zinc-200 px-5 py-2 text-sm font-bold
              hover:bg-[#968e68]/10 hover:border-[#968e68] hover:text-[#968e68]
              transition dark:border-zinc-800 dark:hover:bg-[#968e68]/10
              dark:hover:border-[#968e68] dark:hover:text-[#a8a07a]
            `}
          >
            More →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* FEATURED */}
          <article className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 group">
            <Link href={featured.slug}>
              <div className="relative aspect-[4/5]">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 p-6 text-white">
                <div className="flex gap-2 mb-3 items-center">
                  <LanePill lane={featured.lane} />
                  <span className="text-xs font-bold uppercase opacity-90">
                    {featured.brand}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold group-hover:text-[#968e68] transition-colors">
                  {featured.title}
                </h3>

                <p className="mt-3 text-sm opacity-90">{featured.excerpt}</p>
              </div>
            </Link>
          </article>

          {/* REST */}
          <div className="space-y-6">
            {rest.map((post) => (
              <article
                key={post.slug}
                className={`
                  rounded-xl border border-zinc-200 p-5
                  hover:shadow-md hover:border-[#968e68]/40 hover:bg-[#968e68]/5
                  transition dark:border-zinc-800 dark:bg-zinc-950
                  dark:hover:border-[#968e68]/40 dark:hover:bg-[#968e68]/10
                `}
              >
                <Link href={post.slug}>
                  <LanePill lane={post.lane} />
                  <h4 className="mt-3 text-lg font-extrabold text-black dark:text-white group-hover:text-[#968e68] transition-colors">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
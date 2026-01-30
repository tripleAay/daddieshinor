"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

/* ────────────────────────────────────────────────
   CONFIG
──────────────────────────────────────────────── */
const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";

const BRANDS_CATEGORY_ID = 13;

/* ────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────── */
type BrandPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  brand: string;
  lane: string;
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
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
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
export default function BrandsSection() {
  const [posts, setPosts] = useState<BrandPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchBrands() {
      try {
        setLoading(true);

        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&categories=${BRANDS_CATEGORY_ID}&per_page=6&orderby=date&order=desc`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch brands");

        const data = await res.json();

        if (cancelled) return;

        const mapped: BrandPost[] = data.map((post: any) => {
          const title = cleanWpText(post.title?.rendered);
          const excerpt = truncate(
            cleanWpText(post.excerpt?.rendered)
          );

          return {
            slug: `/brands/${post.slug}`,
            title,
            excerpt,
            image: getFeaturedImage(post),
            alt: title,
            brand:
              post.acf?.brand_name ||
              "Brand Analysis",
            lane:
              post.acf?.brand_lane ||
              "Strategy",
          };
        });

        setPosts(mapped);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBrands();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(
    () => posts[0],
    [posts]
  );
  const rest = useMemo(
    () => posts.slice(1),
    [posts]
  );

  if (loading || !featured) return null;

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-[1400px] px-5 py-14">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black md:text-5xl">
              Brands
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Brand moves, design decisions, and
              strategy shifts — explained without fluff.
            </p>
          </div>

          <Link
            href="/brands"
            className="rounded-full border px-5 py-2 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            More →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* FEATURED */}
          <article className="relative overflow-hidden rounded-2xl border">
            <Link href={featured.slug}>
              <div className="relative aspect-[4/5]">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 p-6 text-white">
                <div className="flex gap-2 mb-3">
                  <LanePill lane={featured.lane} />
                  <span className="text-xs font-bold uppercase opacity-90">
                    {featured.brand}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold">
                  {featured.title}
                </h3>

                <p className="mt-3 text-sm opacity-90">
                  {featured.excerpt}
                </p>
              </div>
            </Link>
          </article>

          {/* REST */}
          <div className="space-y-6">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="rounded-xl border p-5 hover:shadow-md transition"
              >
                <Link href={post.slug}>
                  <LanePill lane={post.lane} />
                  <h4 className="mt-3 text-lg font-extrabold">
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

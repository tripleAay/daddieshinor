"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* ────────────────────────────────────────────────
   CONFIG
──────────────────────────────────────────────── */
const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";

// ✅ Culture category ID
const CULTURE_CATEGORY_ID = 17;

// Brand accent
const ACCENT = "#968e68";

/* ────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────── */
type CulturePost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  label: string;
  tag: string;
};

/* ────────────────────────────────────────────────
   UTILITIES (unchanged)
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
      .replace(/<\/(p|div|h\d|li|blockquote|section|article)>/gi, " ")
      .replace(/<(br|br\/)\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function truncate(text: string, max = 140) {
  if (!text) return "";
  return text.length > max
    ? text.slice(0, text.lastIndexOf(" ", max)) + "…"
    : text;
}

function getFeaturedImage(post: any): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  return (
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.source_url ||
    "/fallback-image.jpg"
  );
}

/* ────────────────────────────────────────────────
   UI
──────────────────────────────────────────────── */
function LanePill({ lane }: { lane: string }) {
  return (
    <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-[#968e68]/10 text-[#968e68] border border-[#968e68]/20">
      {lane}
    </span>
  );
}

/* ────────────────────────────────────────────────
   MAIN
──────────────────────────────────────────────── */
export default function CultureSection() {
  const [posts, setPosts] = useState<CulturePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchCulture() {
      try {
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&categories=${CULTURE_CATEGORY_ID}&per_page=6&orderby=date&order=desc`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch culture posts");

        const data = await res.json();
        if (cancelled) return;

        setPosts(
          (data || []).map((post: any) => ({
            slug: `/essays/${post.slug}`,
            title: cleanWpText(post?.title?.rendered) || "Untitled",
            excerpt: truncate(cleanWpText(post?.excerpt?.rendered), 140),
            image: getFeaturedImage(post),
            alt: cleanWpText(post?.title?.rendered),
            label: "Culture",
            tag: cleanWpText(post?.acf?.culture_tag) || "Culture",
          }))
        );
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCulture();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  if (loading || !featured) return null;

  return (
    <section className="dark:bg-black">
      <div className="mx-auto max-w-[1400px] px-5 py-14">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black md:text-5xl">Culture</h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Ideas, identity, power, and the moments shaping how we live now.
            </p>
          </div>

          <Link
            href="/culture"
            className="rounded-full border px-5 py-2 text-sm font-bold hover:bg-[#968e68]/10 hover:text-[#968e68]"
          >
            More →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Featured */}
          <article className="relative overflow-hidden rounded-2xl border group">
            <Link href={featured.slug}>
              <div className="relative aspect-[4/5]">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  priority
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 p-6 text-white">
                <div className="flex gap-2 mb-3 items-center">
                  <LanePill lane={featured.tag} />
                  <span className="text-xs font-bold uppercase opacity-80">
                    Culture
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold group-hover:text-[#968e68]">
                  {featured.title}
                </h3>

                <p className="mt-3 text-sm opacity-90">{featured.excerpt}</p>
              </div>
            </Link>
          </article>

          {/* List */}
          <div className="space-y-6">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="rounded-xl border p-5 hover:bg-[#968e68]/5 transition"
              >
                <Link href={post.slug}>
                  <LanePill lane={post.tag} />
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

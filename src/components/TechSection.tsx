"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ────────────────────────────────────────────────
   CONFIG
──────────────────────────────────────────────── */
const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";
const TECH_CATEGORY_ID = 4;
const ACCENT = "#968e68";
const ACCENT_HOVER = "#a8a07a";

/* ────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────── */
type TechPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  label: string;
  tag: string;
};

/* ────────────────────────────────────────────────
   UTILITIES
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
      .replace(/<\/?p[^>]*>/gi, " ")
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
  const FALLBACK = "/fallback-image.jpg";

  const url =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url;

  return typeof url === "string" && url.length > 0 ? url : FALLBACK;
}

/* ────────────────────────────────────────────────
   LANE PILL (FIXED: no dynamic tailwind strings)
   - Keeps left side readable in LIGHT mode
   - Doesn't affect right side at all
──────────────────────────────────────────────── */
function LanePill({ lane }: { lane: string }) {
  return (
    <span
      className="
        inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider
        border
      "
      style={{
        // Light mode: dark-on-light logic like your other texts
        backgroundColor: "rgba(150, 142, 104, 0.10)",
        borderColor: "rgba(150, 142, 104, 0.20)",
        color: ACCENT,
      }}
    >
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
          const tag = cleanWpText(post?.acf?.tech_tag) || "Tech";

          return {
            slug: `/essays/${post.slug}`,
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
    <section className="dark:bg-black py-14 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white">
              Tech
            </h2>
            <p className="mt-3 max-w-xl text-base text-zinc-700 dark:text-zinc-300">
              Signals, shifts, and real implications — tech explained with human meaning.
            </p>
          </div>

          <Link
            href="/tech"
            className={`
              rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-bold text-black
              hover:bg-[${ACCENT}]/10 hover:border-[${ACCENT}] hover:text-[${ACCENT}]
              transition dark:border-zinc-700 dark:text-white
              dark:hover:bg-[${ACCENT}]/10 dark:hover:border-[${ACCENT}] dark:hover:text-[${ACCENT_HOVER}]
            `}
          >
            More Tech →
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Featured Post */}
          <article className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-xl transition-shadow">
            <Link href={featured.slug}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <LanePill lane={featured.tag} />
                  <span className="text-xs font-bold uppercase opacity-90">
                    {featured.label}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold group-hover:text-[${ACCENT}] transition-colors">
                  {featured.title}
                </h3>

                <p className="mt-4 text-sm md:text-base opacity-90 line-clamp-3">
                  {featured.excerpt}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white/90 group-hover:text-[${ACCENT}] transition-colors">
                  Read full story <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          </article>

          {/* Rest of Posts (UNCHANGED) */}
          <div className="space-y-6 md:space-y-8">
            {rest.map((post) => (
              <article
                key={post.slug}
                className={`
                  rounded-xl border border-zinc-200 p-5 md:p-6 bg-white dark:bg-zinc-950
                  hover:shadow-md hover:border-[${ACCENT}]/40 transition-all duration-300
                  dark:border-zinc-800 dark:hover:border-[${ACCENT}]/40
                `}
              >
                <Link href={post.slug}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <LanePill lane={post.tag} />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      Daddieshinor
                    </span>
                  </div>

                  <h4 className="text-xl md:text-2xl font-extrabold text-black dark:text-white group-hover:text-[${ACCENT}] transition-colors">
                    {post.title}
                  </h4>

                  <p className="mt-3 text-sm md:text-base text-zinc-700 dark:text-zinc-300 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-black dark:text-white group-hover:text-[${ACCENT}] dark:group-hover:text-[${ACCENT_HOVER}] transition-colors">
                    Read <span aria-hidden>→</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Angular Navigation */}
        <div className="mt-12 flex items-center justify-center gap-8">
          <button
            disabled
            className={`
              flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-300 text-zinc-500
              cursor-not-allowed transition dark:border-zinc-700 dark:text-zinc-400
            `}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Previous</span>
          </button>

          <button
            disabled
            className={`
              flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-300 text-zinc-500
              cursor-not-allowed transition dark:border-zinc-700 dark:text-zinc-400
            `}
          >
            <span className="font-medium">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

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

function truncate(text: string, max = 110) {
  const t = (text || "").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 50 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function getFeaturedImage(post: any): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const FALLBACK = "/fallback-image.jpg";

  const url =
    media?.media_details?.sizes?.medium?.source_url ||
    media?.media_details?.sizes?.thumbnail?.source_url ||
    media?.source_url;

  return typeof url === "string" && url.length > 0 ? url : FALLBACK;
}

/* ────────────────────────────────────────────────
   LANE PILL – compact & premium
──────────────────────────────────────────────── */
function LanePill({ lane }: { lane: string }) {
  return (
    <span
      className="
        inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider
        border bg-[#968e68]/10 border-[#968e68]/20 text-[#968e68]
        transition-all duration-300
      "
    >
      {lane}
    </span>
  );
}

/* ────────────────────────────────────────────────
   MAIN COMPONENT – shrunk, portable, premium
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
          `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&categories=${TECH_CATEGORY_ID}&per_page=7&orderby=date&order=desc`,
          { cache: "no-store" }
        );


        if (!res.ok) throw new Error("Failed to fetch tech posts");

        const data = await res.json();
        if (cancelled) return;

        const mapped: TechPost[] = (Array.isArray(data) ? data : []).map((post: any) => {
          const title = cleanWpText(post?.title?.rendered) || "Untitled";
          const excerpt = truncate(cleanWpText(post?.excerpt?.rendered) || "", 110);
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
    <section className="dark:bg-black py-12 md:py-16">
      <div className="mx-auto max-w-[1320px] px-5 md:px-6 lg:px-8">
        {/* Header – compact */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white">
              Tech
            </h2>
            <p className="mt-2 text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-lg">
              Signals, shifts, real implications — tech with meaning.
            </p>
          </div>

          <Link
            href="/tech"
            className={`
              rounded-full border border-zinc-300/70 px-5 py-2 text-sm font-bold text-black
              hover:bg-[#968e68]/10 hover:border-[#968e68]/50 hover:text-[#968e68]
              transition-all duration-300 dark:border-zinc-700/70 dark:text-white
              dark:hover:bg-[#968e68]/10 dark:hover:border-[#968e68]/50 dark:hover:text-[#968e68]
            `}
          >
            More Tech →
          </Link>
        </div>

        {/* Grid – tighter, more portable */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured Post – slightly smaller */}
          <article className="lg:col-span-5 group relative overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-lg hover:border-[#968e68]/30 transition-all duration-300">
            <Link href={featured.slug}>
              <div className="relative aspect-[4/5] sm:aspect-[5/4] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <LanePill lane={featured.tag} />
                  <span className="text-[11px] font-semibold uppercase opacity-90">
                    {featured.label}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold leading-tight group-hover:text-[#968e68] transition-colors">
                  {featured.title}
                </h3>

                <p className="mt-3 text-sm opacity-90 line-clamp-2">
                  {featured.excerpt}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white/90 group-hover:text-[#968e68] transition-colors">
                  Read full story <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          </article>

          {/* Right side – smaller tiles, more visible */}
          <div className="lg:col-span-7 space-y-5">
            {rest.map((post) => (
              <article
                key={post.slug}
                className={`
                  group rounded-lg border border-zinc-200/60 p-4 bg-white dark:bg-zinc-950
                  hover:shadow-md hover:border-[#968e68]/30 transition-all duration-300
                  dark:border-zinc-800/60 dark:hover:border-[#968e68]/30
                `}
              >
                <Link href={post.slug} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <LanePill lane={post.tag} />
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {post.label}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold leading-tight group-hover:text-[#968e68] transition-colors line-clamp-2">
                        {post.title}
                      </h4>

                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Small thumbnail on right */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Navigation – subtle */}

      </div>
    </section>
  );
}
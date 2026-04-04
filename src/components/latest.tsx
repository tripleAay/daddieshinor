"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useGlobalLoader } from "@/components/global-loader";

type LatestSectionProps = {
  onClose?: () => void;
};

type LatestPost = {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  meta: string;
  href: string;
  dateISO: string;
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          medium_large?: {
            source_url?: string;
          };
        };
      };
    }>;
  };
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const CATEGORY_SECTIONS = [
  { label: "Tech", id: 4 },
  { label: "Culture", id: 17 },
  { label: "Life", id: 18 },
  { label: "Brands", id: 13 },
];

const PER_CATEGORY = 4;

function stripHtml(input: unknown) {
  if (typeof input !== "string") return "";
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LatestComponent({ onClose }: LatestSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { start, stop } = useGlobalLoader();
  const isMounted = useRef(true);

  const ACCENT = "#968e68";

  useEffect(() => {
    isMounted.current = true;
    start();

    let cancelled = false;

    async function load() {
      try {
        setError(null);

        const results = await Promise.all(
          CATEGORY_SECTIONS.map(async (cat) => {
            const path = `/wp-json/wp/v2/posts?_embed&status=publish&per_page=${PER_CATEGORY}&categories=${cat.id}&orderby=date&order=desc`;

            const res = await fetch(
              `/api/wp-proxy?path=${encodeURIComponent(path)}`,
              {
                cache: "no-store",
              }
            );

            if (!res.ok) {
              throw new Error(`Failed to fetch ${cat.label} - status: ${res.status}`);
            }

            const data: WPPost[] = await res.json();
            if (!Array.isArray(data) || data.length === 0) return [];

            return data.map((post) => {
              const media = post?._embedded?.["wp:featuredmedia"]?.[0];

              const image =
                media?.media_details?.sizes?.medium_large?.source_url ||
                media?.source_url ||
                "/fallback.jpg";

              const title = stripHtml(post?.title?.rendered) || "Untitled";

              const excerptRaw = stripHtml(post?.excerpt?.rendered || "");
              const excerpt =
                excerptRaw.length > 110
                  ? excerptRaw.slice(0, 110) + "…"
                  : excerptRaw;

              return {
                category: cat.label,
                title,
                excerpt: excerpt || "Read the latest essay.",
                image,
                meta: formatDate(post.date),
                href: `/essays/${post.slug}`,
                dateISO: post.date,
              } as LatestPost;
            });
          })
        );

        const flat = results.flat();

        const deduped = Array.from(
          new Map(flat.map((p) => [p.href, p])).values()
        ).sort(
          (a, b) =>
            new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
        );

        if (!cancelled && isMounted.current) {
          setPosts(deduped);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled && isMounted.current) {
          setError("Couldn't load latest posts. Try again later.");
        }
      } finally {
        if (!cancelled) stop();
      }
    }

    load();

    return () => {
      cancelled = true;
      isMounted.current = false;
      stop();
    };
  }, [start, stop]);

  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const scrollByOneCard = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-latest-card]");
    const cardWidth = card?.offsetWidth ?? 280;
    const gap = 16;
    const amount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const showArrows = posts.length > 0;
  const Wrapper = onClose ? "div" : "section";

  const content = (
    <section className="mx-auto w-full max-w-[1120px] px-4 py-8 md:py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-black/70 dark:border-white/10 dark:bg-zinc-950 dark:text-white/70">
            Fresh signals
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-black dark:text-white md:text-3xl">
            Latest
          </h2>

          <div className="mt-3 h-1 w-16 rounded-full bg-black dark:bg-white" />
        </div>

        <div className="flex items-center gap-2">
          {showArrows && (
            <>
              <button
                onClick={() => scrollByOneCard("left")}
                aria-label="Scroll left"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white transition hover:border-[#968e68] hover:bg-[#968e68]/10 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-[#968e68] dark:hover:bg-[#968e68]/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollByOneCard("right")}
                aria-label="Scroll right"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white transition hover:border-[#968e68] hover:bg-[#968e68]/10 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-[#968e68] dark:hover:bg-[#968e68]/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close latest posts"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white transition hover:border-[#968e68] hover:bg-[#968e68]/10 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-[#968e68] dark:hover:bg-[#968e68]/10"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200/60 bg-red-50/60 p-4 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white/60 p-3 shadow-sm dark:border-white/10 dark:bg-zinc-950/40">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/90 to-transparent dark:from-zinc-950/90" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/90 to-transparent dark:from-zinc-950/90" />

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory overscroll-x-contain scrollbar-hide pl-2 pr-6"
        >
          {posts.map((post, i) => (
            <motion.div
              key={post.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardVariants}
              data-latest-card
              className="group w-[260px] shrink-0 snap-start sm:w-[280px]"
            >
              <Link href={post.href} className="block" onClick={onClose}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm transition group-hover:shadow-md group-hover:ring-[#968e68]/40 dark:ring-white/10 dark:group-hover:ring-[#968e68]/35">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-70" />

                  <div className="absolute left-3 top-3">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur"
                      style={{ backgroundColor: `${ACCENT}CC` }}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <h3 className="line-clamp-2 text-[15px] font-black leading-snug text-black transition-colors group-hover:text-[#968e68] dark:text-white">
                    {post.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>

                  <time className="mt-2 block text-[11px] font-semibold text-zinc-500 dark:text-zinc-500">
                    {post.meta}
                  </time>
                </div>
              </Link>
            </motion.div>
          ))}

          {!posts.length && !error && (
            <div className="flex w-full items-center justify-center py-8 text-sm text-zinc-500 dark:text-zinc-400">
              Loading latest posts…
            </div>
          )}
        </div>
      </div>
    </section>
  );

  if (!onClose) {
    return content;
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-[8vh] mx-auto max-h-[84vh] w-[min(1180px,calc(100%-24px))] overflow-y-auto rounded-[28px] border border-white/10 bg-[#f5f2e8] shadow-2xl dark:bg-zinc-950"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
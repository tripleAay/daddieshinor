"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalLoader } from "@/components/global-loader";

type LatestPost = {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  meta: string;
  href: string;
};

import type { Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1], // ✅ instead of "easeOut"
    },
  }),
};


const CATEGORY_SECTIONS = [
  { label: "Tech", id: 4 },
  { label: "Culture", id: 17 },
  { label: "Life", id: 18 },
  { label: "Brands", id: 13 },
];

function stripHtml(input: unknown) {
  if (typeof input !== "string") return "";
  return input.replace(/<[^>]+>/g, "").trim();
}

export default function LatestSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { start, stop } = useGlobalLoader();
  const isMounted = useRef(true);

  // Brand color (muted olive-gold)
  const accentColor = "#968e68";
  const accentHover = "#a8a07a"; // lighter variant for hover

  useEffect(() => {
    isMounted.current = true;
    start();

    let cancelled = false;

    async function load() {
      try {
        setError(null);

        const WP = process.env.NEXT_PUBLIC_WP_URL;
        if (!WP) throw new Error("WP URL not configured");

        const results = await Promise.all(
          CATEGORY_SECTIONS.map(async (cat) => {
            const url = `${WP}/wp-json/wp/v2/posts?_embed&per_page=1&categories=${cat.id}&orderby=date&order=desc`;

            const res = await fetch(url, {
              next: { revalidate: 3600 },
            });

            if (!res.ok) throw new Error(`Failed to fetch ${cat.label}`);

            const data = await res.json();
            const post = data?.[0];
            if (!post) return null;

            const media = post?._embedded?.["wp:featuredmedia"]?.[0];

            const title = stripHtml(post?.title?.rendered) || "Untitled";
            const excerptRaw = stripHtml(post?.excerpt?.rendered);
            const excerpt =
              excerptRaw.length > 140 ? excerptRaw.slice(0, 140) + "…" : excerptRaw;

            const image =
              media?.media_details?.sizes?.medium_large?.source_url ||
              media?.source_url ||
              "/fallback.jpg";

            const meta = new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return {
              category: cat.label,
              title,
              excerpt: excerpt || "Read the latest essay.",
              image,
              meta,
              href: `/essays/${post.slug}`,
            } as LatestPost;
          })
        );

        if (!cancelled && isMounted.current) {
          setPosts(results.filter((p): p is LatestPost => p !== null));
        }
      } catch (err) {
        console.error(err);
        if (!cancelled && isMounted.current) {
          setError("Couldn't load latest posts. Try again later.");
        }
      } finally {
        if (!cancelled) {
          stop();
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      isMounted.current = false;
      stop();
    };
  }, [start, stop]);

  // Scroll function (FIXED)
  // Scroll function – fully dynamic
  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    // Find first child that is an HTMLElement
    const card = Array.from(container.children).find(
      (child): child is HTMLElement => child instanceof HTMLElement
    );

    // Now TS knows card is HTMLElement | undefined
    const cardWidth = card?.offsetWidth ?? 380;

    const gap = 24; // matches gap-6
    const scrollAmount = (cardWidth + gap) * 1.1;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };


  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:py-24">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">
            Latest
          </h2>
          <div className="mt-4 h-1.5 w-28 bg-black dark:bg-white rounded-full" />
        </div>

        {posts.length > 0 && (
          <div className="hidden sm:flex gap-4">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="p-3 rounded-full border border-zinc-300 hover:border-[#968e68] hover:bg-[#968e68]/10 transition dark:border-zinc-700 dark:hover:border-[#968e68] dark:hover:bg-[#968e68]/10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="p-3 rounded-full border border-zinc-300 hover:border-[#968e68] hover:bg-[#968e68]/10 transition dark:border-zinc-700 dark:hover:border-[#968e68] dark:hover:bg-[#968e68]/10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12"
      >
        {posts.map((post, i) => (
          <motion.div
            key={post.href}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="min-w-[340px] sm:min-w-[380px] snap-start group"
          >
            <Link href={post.href} className="block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 group-hover:ring-[#968e68]/40 transition-all duration-300 dark:ring-white/5 dark:group-hover:ring-[#968e68]/30">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-5">
                <p className="text-xs md:text-sm uppercase font-semibold tracking-wide text-zinc-600 dark:text-zinc-400 group-hover:text-[#968e68] transition-colors">
                  {post.category}
                </p>
                <h3 className="mt-2 text-xl md:text-2xl font-bold leading-tight line-clamp-2 group-hover:text-[#968e68] transition-colors">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {post.excerpt}
                </p>
                <time className="mt-4 block text-xs md:text-sm text-zinc-500 dark:text-zinc-500">
                  {post.meta}
                </time>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
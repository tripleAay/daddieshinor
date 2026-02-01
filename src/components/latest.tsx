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

const cardVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
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
  const isMounted = useRef(true); // ← added to safely avoid setState after unmount

  useEffect(() => {
    isMounted.current = true;

    start(); // Start immediately on mount

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
        // ALWAYS stop - even if cancelled or errored
        if (!cancelled) {
          stop();
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      isMounted.current = false;
      stop();           // ← Critical: force stop on unmount
    };
  }, [start, stop]); // dependencies ok

  if (error) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-12 text-center">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:py-24">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Latest
          </h2>
          <div className="mt-4 h-1.5 w-28 bg-black dark:bg-white" />
        </div>

        {posts.length > 0 && (
          <div className="hidden sm:flex gap-4">
            <button onClick={() => scroll("left")} aria-label="Scroll left">
              <ChevronLeft />
            </button>
            <button onClick={() => scroll("right")} aria-label="Scroll right">
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {posts.map((post, i) => (
          <motion.div
            key={post.href}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="min-w-[380px] snap-start"
          >
            <Link href={post.href}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>

              <p className="mt-4 text-sm uppercase font-semibold">{post.category}</p>
              <h3 className="mt-1 text-xl font-bold line-clamp-2">{post.title}</h3>
              <p className="mt-2 text-gray-600 line-clamp-2">{post.excerpt}</p>
              <time className="mt-3 block text-sm text-gray-500">{post.meta}</time>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
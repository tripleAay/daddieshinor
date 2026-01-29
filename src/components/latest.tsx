"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LatestSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = direction === "left" ? -420 : 420;
    scrollRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-12">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">
            Latest
          </h2>
          <div className="mt-3 h-1 w-24 bg-black dark:bg-white" />
        </div>

        {/* Arrow controls */}
        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Cards row */}
      <div
        ref={scrollRef}
        className="
          flex gap-6 overflow-hidden scroll-smooth
          will-change-transform
        "
      >
        <LatestCard
          category="Essay"
          title="When speed stops impressing you"
          excerpt="A quiet reflection on ambition, patience, and the moment clarity replaces urgency."
          image="/latest/speed.jpg"
          meta="Jan 29, 2026 · 6 min read"
        />

        <LatestCard
          category="Tech"
          title="Why AI will reward thinkers, not hustlers"
          excerpt="As automation rises, depth and judgment become the real edge."
          image="/latest/ai-thinkers.jpg"
          meta="Jan 28, 2026 · 5 min read"
        />

        <LatestCard
          category="Culture"
          title="What WhatsApp usernames really change"
          excerpt="Identity, privacy, and the subtle shift away from phone-number intimacy."
          image="/latest/whatsapp.jpg"
          meta="Jan 27, 2026 · 4 min read"
        />

        <LatestCard
          category="Branding"
          title="Personal brands are becoming quiet businesses"
          excerpt="Why the loudest people won’t last — and the focused ones will."
          image="/latest/branding.jpg"
          meta="Jan 26, 2026 · 5 min read"
        />
      </div>
    </section>
  );
}

/* ---------------- Card ---------------- */

function LatestCard({
  category,
  title,
  excerpt,
  image,
  meta,
}: {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  meta: string;
}) {
  return (
    <Link
      href="#"
      className="
        group flex w-[420px] shrink-0 overflow-hidden
        rounded-xl bg-white dark:bg-zinc-900
        shadow-md hover:shadow-xl transition
      "
    >
      {/* Image */}
      <div className="relative w-[150px] shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-5">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60">
            {category}
          </span>

          <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-black dark:group-hover:text-white transition">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {excerpt}
          </p>
        </div>

        <div className="mt-4 text-xs text-zinc-500">
          {meta}
        </div>
      </div>
    </Link>
  );
}

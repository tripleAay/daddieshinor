"use client";

// components/BestNewReads.tsx
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalLoader } from "@/components/global-loader";

type Entry = {
  rank: number;
  title: string;
  subtitle: string; // category name
  image: string;
  link: string;
};

type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered?: string };
  _embedded?: any;
};

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";

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

function getFeaturedImage(post: any, size: "large" | "medium" | "medium_large" | "thumbnail" = "large") {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return "/fallback.jpg";

  return (
    media?.media_details?.sizes?.[size]?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url ||
    "/fallback.jpg"
  );
}

function getPrimaryCategoryName(post: any) {
  const terms = post?._embedded?.["wp:term"];
  const cats = Array.isArray(terms) ? terms.flat() : [];
  const raw =
    cats.find((t: any) => t?.taxonomy === "category")?.name ||
    post?._embedded?.["wp:term"]?.[0]?.[0]?.name ||
    "Essay";
  return cleanWpText(raw) || "Essay";
}

function formatWeekLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BestNewReads() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { start, stop } = useGlobalLoader();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      start(); // ✅ global loader begins
      try {
        setError(null);

        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=5&status=publish&orderby=date&order=desc`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error(`WP API error: ${res.status}`);

        const data: WpPost[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No posts found");

        const mapped: Entry[] = data.map((post, idx) => {
          const title = cleanWpText(post?.title?.rendered) || "Untitled";
          const subtitle = getPrimaryCategoryName(post);

          return {
            rank: idx + 1,
            title,
            subtitle,
            image: getFeaturedImage(post, "medium_large"),
            link: `/essays/${post.slug}`,
          };
        });

        if (!cancelled) setEntries(mapped);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Couldn’t load Best New Reads right now.");
      } finally {
        if (!cancelled) stop(); // ✅ global loader ends
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [start, stop]);

  const weekLabel = useMemo(() => {
    // “Week of …” based on newest entry date is more honest than hardcoding
    // If you want ISO-week logic later, we can do that.
    return entries.length ? "Week of " + formatWeekLabel(new Date().toISOString()) : "";
  }, [entries.length]);

  if (error) {
    return (
      <section className="bg-black text-white py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-5">
          <p className="text-zinc-300">{error}</p>
        </div>
      </section>
    );
  }

  // With global loader overlay, it's okay to render nothing until entries are in.
  if (!entries.length) return null;

  return (
    <section className="bg-black text-white py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-5">
        {/* Header */}
        <header className="mb-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
            Best New Reads
          </h2>
          <p className="mt-3 max-w-xl text-lg md:text-xl text-zinc-400">
            A weekly curation of essays shaping thought, not trends.
          </p>
          <p className="mt-1 text-sm uppercase tracking-widest text-zinc-500">
            {weekLabel || "This week"}
          </p>
          <div className="mt-6 h-[2px] w-full bg-white/90" />
        </header>

        {/* Horizontal list */}
        <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          <div className="flex gap-8 min-w-max">
            {entries.map((entry) => (
              <Link
                key={entry.rank}
                href={entry.link}
                className="group w-[280px] md:w-[320px] flex-shrink-0"
              >
                {/* Visual */}
                <div className="relative aspect-square overflow-hidden rounded-full border-4 border-zinc-800 transition-all duration-300 group-hover:border-orange-500">
                  <Image
                    src={entry.image}
                    alt={entry.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 280px, 320px"
                  />
                </div>

                {/* Meta */}
                <div className="mt-6 text-center">
                  <div className="text-6xl font-black leading-none text-zinc-700 transition-colors duration-300 group-hover:text-orange-500">
                    {entry.rank}
                  </div>
                  <h3 className="mt-2 text-xl md:text-2xl font-bold">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-base text-zinc-400">
                    {entry.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

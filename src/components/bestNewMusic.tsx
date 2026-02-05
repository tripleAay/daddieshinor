"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";

type Entry = {
  rank: number;
  title: string;
  subtitle: string;
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

// -------------------- Helpers --------------------
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

function getFeaturedImage(post: any): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const FALLBACK = "/fallback.jpg";
  const url =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url;
  return typeof url === "string" && url.length > 0 ? url : FALLBACK;
}

// -------------------- Scroll Animation per card --------------------
function useScrollFadeInArray(length: number) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(Array(length).fill(false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((el, idx) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible((v) => {
                const copy = [...v];
                copy[idx] = true;
                return copy;
              });
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [length]);

  const styles = visible.map((v, idx) => ({
    transform: v ? "translate(0,0)" : `translateY(30px)`,
    opacity: v ? 1 : 0,
    transition: `all ${600 + idx * 100}ms ease-out`,
  }));

  return { refs: refs.current, setRef: (el: HTMLDivElement | null, idx: number) => (refs.current[idx] = el), styles };
}

// -------------------- Typing on Scroll Hook --------------------
function useTypeOnScroll(text: string, speed = 50) {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let i = 0;
            const timer = setInterval(() => {
              setDisplayText(text.slice(0, i + 1));
              i++;
              if (i === text.length) clearInterval(timer);
            }, speed);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [text, speed]);

  return { ref, displayText };
}

// -------------------- Component --------------------
export default function BestNewReads() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { ref: subtitleRef, displayText } = useTypeOnScroll(
    "A weekly curation of essays shaping thought, not trends.",
    40
  );

  const { refs: cardRefs, setRef: setCardRef, styles: cardStyles } = useScrollFadeInArray(entries.length);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const res = await fetch(
          `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=5&status=publish&orderby=date&order=desc`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`WP API error: ${res.status}`);
        const data: WpPost[] = await res.json();
        if (!Array.isArray(data) || data.length === 0)
          throw new Error("No posts found");

        const mapped: Entry[] = data.map((post, idx) => ({
          rank: idx + 1,
          title: cleanWpText(post?.title?.rendered) || "Untitled",
          subtitle: " ",
          image: getFeaturedImage(post),
          link: `/essays/${post.slug}`,
        }));

        if (!cancelled) setEntries(mapped);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Couldn’t load Best New Reads right now.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <section className="bg-black text-white py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-5 text-center">
          <p className="text-zinc-300">{error}</p>
        </div>
      </section>
    );
  }

  if (!entries.length) return null;

  return (
    <section className="bg-black text-white py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-5">
        {/* Header */}
        <header className="mb-10 md:mb-14 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
            Best New Reads
          </h2>
          <p
            ref={subtitleRef}
            className="mt-3 text-lg md:text-xl text-zinc-400 font-medium"
          >
            {displayText}
          </p>
          <div className="mt-6 h-[2px] w-24 mx-auto md:mx-0 bg-gradient-to-r from-white via-[#968e68] to-white" />
        </header>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          {entries.map((entry, idx) => (
            <Link
              key={entry.rank}
              href={entry.link}
              ref={(el) => setCardRef(el, idx)}
              style={cardStyles[idx]}
              className="group flex flex-col transition-transform hover:scale-[1.02] duration-300"
            >
              {/* Circular Image */}
              <div className="relative aspect-square overflow-hidden rounded-full border-4 border-zinc-800 group-hover:border-[#968e68] transition-all duration-300 shadow-lg group-hover:shadow-[0_0_25px_rgba(150,142,104,0.3)]">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              {/* Content */}
              <div className="mt-4 sm:mt-6 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl font-black leading-none text-zinc-700 group-hover:text-[#968e68] transition-colors">
                  {entry.rank}
                </div>
                <h3 className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-bold leading-tight line-clamp-2 group-hover:text-[#968e68] transition-colors">
                  {entry.title}
                </h3>
                <p className="mt-1 text-sm sm:text-base text-zinc-400 group-hover:text-[#968e68]/80 transition-colors">
                  {entry.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Angular Navigation */}
        
      </div>
    </section>
  );
}

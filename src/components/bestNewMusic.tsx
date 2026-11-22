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

// -------------------- Scroll Fade-in Hook (fixed ref typing) --------------------
function useScrollFadeInArray(length: number) {
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
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
    transform: v ? "translateY(0)" : "translateY(30px)",
    opacity: v ? 1 : 0,
    transition: `all ${600 + idx * 100}ms ease-out`,
  }));

  const setRef = (el: HTMLAnchorElement | null, idx: number) => {
    refs.current[idx] = el;
  };

  return { refs: refs.current, setRef, styles };
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

// -------------------- Main Component --------------------
export default function BestNewReads() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { ref: subtitleRef, displayText } = useTypeOnScroll(
    "A weekly curation of essays shaping thought, not trends.",
    40
  );

  const { setRef: setCardRef, styles: cardStyles } = useScrollFadeInArray(entries.length);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);

        // Use proxy to bypass CORS
        const proxyUrl = `/api/wp-proxy?path=/wp-json/wp/v2/posts?_embed&per_page=5&status=publish&orderby=date&order=desc`;
        console.log("[BestNewReads] Fetching via proxy:", proxyUrl);

        const res = await fetch(proxyUrl, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errorText = await res.text().catch(() => "No response body");
          throw new Error(`Proxy / WP API error - status: ${res.status} - ${errorText}`);
        }

        const data: WpPost[] = await res.json();

        if (!Array.isArray(data) || data.length === 0) throw new Error("No posts found");

        const mapped: Entry[] = data.map((post, idx) => ({
          rank: idx + 1,
          title: cleanWpText(post?.title?.rendered) || "Untitled",
          subtitle: " ",
          image: getFeaturedImage(post),
          link: `/essays/${post.slug}`,
        }));

        if (!cancelled) setEntries(mapped);
      } catch (e: any) {
        console.error("[BestNewReads] Fetch error:", e.message);
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
        <div className="mx-auto max-w-[1440px] text-center">
          <p className="text-zinc-300">{error}</p>
        </div>
      </section>
    );
  }

  if (!entries.length) return null;

  return (
   <section className="ds-music relative overflow-hidden rounded-lg bg-[#151515] px-5 py-9 text-white sm:px-8 md:py-12">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <header className="mb-8 md:mb-10 text-left">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
            Best New Reads
          </h2>
          <p
            ref={subtitleRef}
            className="mt-3 text-sm md:text-base text-zinc-400 font-medium"
          >
            {displayText}
          </p>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-white via-[#968e68] to-white" />
        </header>

        {/* Two continuously moving editorial rows; duplicates create a seamless loop. */}
        <div className="space-y-5 overflow-hidden" aria-label="Browse Best New Reads">
          {[entries.filter((_, i) => i % 2 === 0), entries.filter((_, i) => i % 2 === 1)].map((row, rowIndex) => (
            <div key={rowIndex} className="ds-read-viewport overflow-hidden">
              <div className={`ds-read-track ${rowIndex === 0 ? "ds-read-left" : "ds-read-right"}`}>
                {[0, 1].map(copy => (
                  <div key={copy} className="ds-read-group flex shrink-0 gap-4" aria-hidden={copy === 1 ? true : undefined}>
                    {row.map(entry => (
                      <Link key={`${copy}-${entry.rank}`} href={entry.link} tabIndex={copy === 1 ? -1 : undefined} className="group flex w-[260px] shrink-0 items-center gap-4 rounded-xl border border-white/10 bg-white/[0.045] p-4 transition-colors hover:border-[#c3bb61]/50 hover:bg-white/10 sm:w-[350px]">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                          <Image src={entry.image} alt="" fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c3bb61]">{String(entry.rank).padStart(2, "0")} / Editorial pick</span>
                          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-[#c3bb61] sm:text-base">{entry.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-7 text-center text-xs uppercase tracking-[0.2em] text-zinc-400">Read • Think • Grow</p>
      </div>
    </section>
  );
}
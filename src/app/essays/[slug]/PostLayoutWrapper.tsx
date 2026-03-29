"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import Image from "next/image";
import { Breadcrumb } from "@/components/bedcrumb";
import NewsletterCard from "@/components/newsletterCard";
import Header from "@/components/header";


import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  Sparkles,
  Handshake,
} from "lucide-react";

type PostLayoutProps = {
  title: string;
  category: string;
  author: string;
  dateLabel: string;
  heroImage: string;
  heroAlt?: string;
  children: ReactNode;
  /** RelatedSection + Footer — rendered inside the scrollable center column */
  footer?: ReactNode;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
};

type ShareIconProps = {
  href: string;
  label: string;
  children: ReactNode;
};

function ShareIcon({ href, label, children }: ShareIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm hover:bg-zinc-50 hover:shadow-md transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
    >
      {children}
    </a>
  );
}

export default function PostLayout({
  title,
  category,
  author,
  dateLabel,
  heroImage,
  heroAlt = "",
  children,
  footer,
  newsletterTitle = "Stay Close",
  newsletterSubtitle = "A short note when something is worth thinking about. No spam. No noise.",
}: PostLayoutProps) {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [shareText, setShareText] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(encodeURIComponent(window.location.href));
      setShareText(encodeURIComponent(title));
    }
  }, [title]);

  const rawUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const copyLink = async () => {
    try {
      if (!rawUrl) return;
      await navigator.clipboard.writeText(rawUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  // Reading progress bar — driven by the scrollable center column, not window
  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    const scroller = document.getElementById("post-scroller");
    if (!bar || !scroller) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      bar.style.width = `${Math.min(progress, 100)}%`;
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <article className="h-screen flex flex-col bg-[#D9DCD6] text-black dark:bg-zinc-950 dark:text-white overflow-hidden">

      {/* ── Reading Progress Bar ── */}
      <div
        id="reading-progress"
        className="fixed top-0 left-0 h-[3px] w-0 bg-orange-600 z-50 transition-[width] duration-100"
      />

      {/* ── Fixed Header — row 1 ── */}
      
      <div className="flex-none z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <Header />
      </div>

      {/* ── Body row — fills remaining height, never overflows ── */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-0 lg:gap-6">

          {/* ═══════════════════════════════════════════════
              LEFT RAIL — fixed height, no scroll of its own
          ═══════════════════════════════════════════════ */}
          <aside className="hidden md:flex md:col-span-3 lg:col-span-2 flex-col gap-5 py-8 overflow-hidden">

            {/* Author card */}
            <div className="rounded-xl border border-black/8 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/50 flex-none">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-black/60 dark:text-white/60">By</span>
                <span className="inline-flex items-center rounded-full border border-black/15 bg-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider dark:border-white/15 dark:bg-zinc-950">
                  {author}
                </span>
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest dark:border-white/15 dark:bg-zinc-950">
                  <Sparkles className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                  {category}
                </span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-black/60 dark:text-white/60">
                Daddieshinor is where tech moves become thought moves.
              </p>
            </div>

            {/* Share card */}
            <div className="rounded-xl border border-black/8 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/50 flex-none">
              <p className="text-xs font-black tracking-[0.20em] uppercase text-black/60 dark:text-white/60">
                Share
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <ShareIcon
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </ShareIcon>
                <ShareIcon
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  label="Share on X"
                >
                  <Twitter className="h-4 w-4" />
                </ShareIcon>
                <ShareIcon
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
                  label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </ShareIcon>
                <ShareIcon
                  href={`mailto:?subject=${shareText}&body=Check out this article: ${shareUrl}`}
                  label="Share by Email"
                >
                  <Mail className="h-4 w-4" />
                </ShareIcon>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-xs font-extrabold uppercase tracking-wider text-black shadow-sm hover:bg-zinc-50 transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

          </aside>

          {/* ═══════════════════════════════════════════════
              CENTER — THE ONLY SCROLLING COLUMN
          ═══════════════════════════════════════════════ */}
          <main
            id="post-scroller"
            className="col-span-12 md:col-span-6 lg:col-span-7 h-full overflow-y-auto overscroll-contain min-w-0
                       px-0 md:px-4 lg:px-6
                       scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
          >
            {/* Inner padding so content doesn't hug edges */}
            <div className="py-8 pb-24">

              <Breadcrumb category={category} title={title} />

              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                  aria-label="Go back to previous page"
                >
                  <svg
                    className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </button>

                {/* Optional: keep date on the right */}
                <div className="flex-1" />
                <time className="text-sm font-medium text-black/60 dark:text-white/60">
                  {dateLabel}
                </time>
              </div>

              {/* Title */}
              <h1 className="mt-3 text-2xl leading-tight font-black tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
                {title}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-black/60 dark:text-white/60">
                Not just news. Meaning. Pattern. Perspective.
              </p>

              {/* Hero image */}
              <div className="mt-6">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-black/8 shadow-md dark:bg-zinc-800 dark:ring-white/8">
                  <Image
                    src={heroImage}
                    alt={heroAlt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 680px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/8 to-transparent" />
                </div>
              </div>

              {/* Mobile Share Bar */}
              <div className="flex md:hidden items-center gap-2.5 mt-5 flex-wrap">
                <span className="text-xs font-black tracking-widest uppercase text-black/50 dark:text-white/50 mr-1">
                  Share
                </span>
                <ShareIcon
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </ShareIcon>
                <ShareIcon
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  label="Share on X"
                >
                  <Twitter className="h-4 w-4" />
                </ShareIcon>
                <ShareIcon
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
                  label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </ShareIcon>
                <ShareIcon
                  href={`mailto:?subject=${shareText}&body=Check out this article: ${shareUrl}`}
                  label="Share by Email"
                >
                  <Mail className="h-4 w-4" />
                </ShareIcon>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-xs font-extrabold uppercase tracking-wider text-black shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Post body */}
              <div className="mt-8">
                {children}
              </div>

              {/* RelatedSection + Footer — scrolls with content */}
              {footer && (
                <div className="mt-16">
                  {footer}
                </div>
              )}

            </div>
          </main>

          {/* ═══════════════════════════════════════════════
              RIGHT SIDEBAR — fixed height, no scroll of its own
          ═══════════════════════════════════════════════ */}
          <aside className="hidden md:flex md:col-span-3 lg:col-span-3 flex-col gap-5 py-8 overflow-hidden">

            {/* Newsletter */}
            <div className="flex-none">
              <NewsletterCard
                badgeText="Daddieshinor Letters"
                title={newsletterTitle}
                subtitle={newsletterSubtitle}
                buttonText="Subscribe"
              />
            </div>

            {/* Partner tile */}
            <div className="rounded-xl border border-black/8 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/50 flex-none">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/15 dark:bg-orange-500/15 dark:ring-orange-400/20">
                  <Handshake className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.20em] text-black/60 dark:text-white/60">
                    Partner with Daddieshinor
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-black/70 dark:text-white/70">
                    Thoughtful brands supporting thoughtful readers.
                  </p>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>



    </article>
  );
}

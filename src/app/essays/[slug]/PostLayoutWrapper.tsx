"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import Image from "next/image";
import { Breadcrumb } from "@/components/bedcrumb";
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

  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      bar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <article className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white overscroll-x-none overscroll-y-none">
      {/* Reading Progress Bar */}
      <div
        id="reading-progress"
        className="fixed top-0 left-0 h-1 w-0 bg-orange-600 z-50 transition-all duration-100"
      />

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <Header />
      </div>

      {/* Spacer for header */}
      <div className="h-[var(--header-height,80px)]" />

      {/* Main content wrapper – helps contain overscroll */}
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8 pb-20 pt-12 overscroll-x-none">
        <div className="grid grid-cols-12 gap-8 lg:gap-10 overscroll-x-none">
          {/* LEFT RAIL – sticky + no horizontal overscroll */}
          <aside className="col-span-12 hidden md:block md:col-span-3 lg:col-span-2 overscroll-x-none overflow-x-hidden">
            <div className="sticky top-[96px] max-h-[calc(100vh-120px)] overflow-y-auto overscroll-x-none overscroll-y-contain space-y-6">
              {/* Author */}
              <div className="rounded-xl border border-black/8 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/50">
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

              {/* Share */}
              <div className="rounded-xl border border-black/8 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/50">
                <p className="text-xs font-black tracking-[0.20em] uppercase text-black/60 dark:text-white/60">
                  Share
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <ShareIcon
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    label="Share on Facebook"
                  >
                    <Facebook className="h-4.5 w-4.5" />
                  </ShareIcon>

                  <ShareIcon
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    label="Share on X"
                  >
                    <Twitter className="h-4.5 w-4.5" />
                  </ShareIcon>

                  <ShareIcon
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
                    label="Share on LinkedIn"
                  >
                    <Linkedin className="h-4.5 w-4.5" />
                  </ShareIcon>

                  <ShareIcon
                    href={`mailto:?subject=${shareText}&body=Check out this article: ${shareUrl}`}
                    label="Share by Email"
                  >
                    <Mail className="h-4.5 w-4.5" />
                  </ShareIcon>

                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-xs font-extrabold uppercase tracking-wider text-black shadow-sm hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER CONTENT */}
          <main className="col-span-12 md:col-span-6 lg:col-span-7 overscroll-x-none">
            <div className="mt-10">
              <Breadcrumb  category={category} title={title} />
            </div>
            <div className="flex justify-end">
              <time className="text-sm font-medium text-black/60 dark:text-white/60">
                {dateLabel}
              </time>
            </div>

            <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mt-3 text-base text-black/60 dark:text-white/60">
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
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/8 to-transparent" />
              </div>
            </div>

            {/* Body */}
            <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight">
              {children}
            </div>
          </main>

          {/* RIGHT SIDEBAR – sticky + reinforced no-overscroll (focus here) */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3 overscroll-x-none overflow-x-hidden">
            <div className="sticky top-[96px] max-h-[calc(100vh-120px)] overflow-y-auto overscroll-x-none overscroll-y-contain space-y-6">
              {/* Newsletter card */}
              <div className="rounded-xl border border-zinc-200/80 bg-gradient-to-b from-[#f8f7e8] to-[#f0efd8] p-6 shadow-md dark:border-zinc-700/60 dark:from-zinc-900/80 dark:to-zinc-900/60">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-black/80 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/80 dark:text-white/80">
                  Daddieshinor Letters
                </div>

                <h3 className="mt-4 text-xl font-black leading-tight">{newsletterTitle}</h3>

                <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
                  {newsletterSubtitle}
                </p>

                <form className="mt-5 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="h-10 w-full rounded-lg border border-black/15 bg-white/90 px-3.5 text-sm outline-none focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 dark:border-white/15 dark:bg-zinc-800/90 dark:focus:border-orange-400/40 dark:focus:ring-orange-400/20"
                  />
                  <button
                    type="submit"
                    className="h-10 shrink-0 rounded-lg bg-gradient-to-b from-black to-zinc-900 px-5 text-sm font-black text-white hover:from-zinc-900 hover:to-black dark:from-white dark:to-zinc-200 dark:text-black dark:hover:from-zinc-200 dark:hover:to-white"
                  >
                    Subscribe
                  </button>
                </form>

                <div className="mt-5 flex justify-end text-[11px] text-black/40 dark:text-white/40">
                  <span>powered by fynaro tech</span>
                </div>
              </div>

              {/* Partner tile */}
              <div className="rounded-xl border border-black/8 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/50">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/15 dark:bg-orange-500/15 dark:ring-orange-400/20">
                    <Handshake className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" />
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
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
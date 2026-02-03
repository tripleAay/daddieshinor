
"use client";import { useEffect, useMemo, useState, ReactNode } from "react";
import Image from "next/image";
import Header from "@/components/header";import { Facebook, Twitter, Linkedin, Mail, Link2, Sparkles, Handshake } from "lucide-react";type PostLayoutProps = {
  title: string;
  category: string;
  author: string;
  dateLabel: string;
  heroImage: string;
  heroAlt?: string;
  children: ReactNode;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
};type ShareIconProps = {
  href: string;
  label: string;
  children: ReactNode;
};function ShareIcon({ href, label, children }: ShareIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
    >
      {children}
    </a>
  );
}export default function PostLayout({
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
  const [copied, setCopied] = useState(false);  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(encodeURIComponent(window.location.href));
      setShareText(encodeURIComponent(title));
    }
  }, [title]);  const rawUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);  async function copyLink() {
    try {
      if (!rawUrl) return;
      await navigator.clipboard.writeText(rawUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }  return (
    <article className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/85 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75">
        <Header />
      </div>  {/* Spacer for fixed header */}
  <div className="h-[var(--header-height,80px)]" />

  {/* Brand bar (Daddieshinor accent) */}
  
  

  {/* Main content */}
  <div className="mx-auto max-w-[1320px] px-6 pb-16 pt-10">
    <div className="grid grid-cols-12 gap-10">
      {/* LEFT RAIL – Identity + Share */}
      <aside className="col-span-12 hidden md:block md:col-span-3 lg:col-span-2">
        <div className="sticky top-30 space-y-8">
          {/* Identity */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-black/70 dark:text-white/70">By</span>
              <span className="inline-flex items-center rounded-full border border-black/20 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider dark:border-white/15 dark:bg-zinc-950">
                {author}
              </span>
            </div>

            <div className="mt-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest dark:border-white/15 dark:bg-zinc-950">
                <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                {category}
              </span>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-black/60 dark:text-white/60">
              Daddieshinor is where tech moves become thought moves.
            </p>
          </div>

          {/* Share */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
            <p className="text-xs font-black tracking-[0.24em] uppercase text-black/70 dark:text-white/70">
              Share
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ShareIcon
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                label="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </ShareIcon>

              <ShareIcon
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                label="Share on X"
              >
                <Twitter className="h-5 w-5" />
              </ShareIcon>

              <ShareIcon
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
                label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </ShareIcon>

              <ShareIcon
                href={`mailto:?subject=${shareText}&body=Check out this article: ${shareUrl}`}
                label="Share by Email"
              >
                <Mail className="h-5 w-5" />
              </ShareIcon>

              <button
                type="button"
                onClick={copyLink}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-extrabold uppercase tracking-wider text-black shadow-sm hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                aria-label="Copy link"
              >
                <Link2 className="h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <main className="col-span-12 md:col-span-6 lg:col-span-7">
        {/* Date */}
        <div className="flex justify-end">
          <time className="text-sm font-semibold text-black/70 dark:text-white/70">
            {dateLabel}
          </time>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-[34px] leading-[1.12] font-black tracking-tight md:text-[44px]">
          {title}
        </h1>

        {/* Micro tagline */}
        <p className="mt-4 text-base md:text-lg text-black/70 dark:text-white/70">
          Not just news. Meaning. Pattern. Perspective.
        </p>

        {/* Hero image */}
        <div className="mt-7">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-black/10 shadow-md dark:bg-zinc-800 dark:ring-white/10">
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* bottom chips */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 p-4">
              <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur">
                Daddieshinor Essay
              </span>
              <span className="inline-flex items-center rounded-full bg-orange-500/90 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white shadow">
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-10">
          <div
            className="
              post-body drop-cap
              prose prose-zinc dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:tracking-tight
              prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-200
              prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic
            "
          >
            {children}
          </div>
        </div>

        {/* Mobile share strip */}
        <div className="mt-12 rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/40 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black tracking-[0.24em] uppercase text-black/70 dark:text-white/70">
              Share
            </p>

            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-black shadow-sm hover:bg-zinc-50 hover:shadow transition dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <Link2 className="h-4 w-4" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ShareIcon
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              label="Share on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </ShareIcon>

            <ShareIcon
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
              label="Share on X"
            >
              <Twitter className="h-5 w-5" />
            </ShareIcon>

            <ShareIcon
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
              label="Share on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </ShareIcon>

            <ShareIcon
              href={`mailto:?subject=${shareText}&body=Check out this article: ${shareUrl}`}
              label="Share by Email"
            >
              <Mail className="h-5 w-5" />
            </ShareIcon>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR – Newsletter */}
      <aside className="col-span-12 md:col-span-3 lg:col-span-3">
        <div className="sticky top-30 space-y-6">
          {/* Newsletter card */}
          <div className="rounded-2xl border border-zinc-300 bg-[#f4f3dc] p-7 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-black/80 dark:border-white/10 dark:bg-zinc-950 dark:text-white/80">
              Daddieshinor Letters
            </div>

            <h3 className="mt-4 text-2xl font-black leading-tight">{newsletterTitle}</h3>

            <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
              {newsletterSubtitle}
            </p>

            <form className="mt-5 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="h-11 w-full rounded-xl border border-black/20 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-zinc-800 dark:focus:ring-orange-400/25"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-xl bg-black px-4 text-sm font-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-6 flex justify-end text-[11px] text-black/45 dark:text-white/45">
              <span>powered by fynaro tech</span>
            </div>
          </div>

          {/*  NEW Partner tile (below newsletter) */}
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 dark:bg-orange-500/15 dark:ring-orange-400/20">
                <Handshake className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </span>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-black/70 dark:text-white/70">
                  Partner with Daddieshinor
                </p>
                <p className="mt-2 text-sm leading-relaxed text-black/75 dark:text-white/75">
                  Thoughtful brands supporting thoughtful readers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>

  
</article>  );
}
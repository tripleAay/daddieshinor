// app/essays/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";

// ────────────────────────────────────────────────
// Your PostLayout component (copied exactly as you shared)
"use client";

import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

type PostLayoutProps = {
  title: string;
  author: string;
  dateLabel: string;
  heroImage: string;
  heroAlt?: string;
  children: React.ReactNode;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
};

function ShareIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-black hover:bg-zinc-100 transition"
    >
      {children}
    </a>
  );
}

function PostLayout({
  title,
  author,
  dateLabel,
  heroImage,
  heroAlt = "",
  children,
  newsletterTitle = "Notjustok Weekly",
  newsletterSubtitle = "Get access to NJO New Music Friday.",
}: PostLayoutProps) {
  return (
    <article className="bg-white text-black">
      {/* Top rule */}
      <div className="h-3 w-full bg-black" />
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="border-t border-black/80" />
      </div>

      {/* Main grid */}
      <div className="mx-auto max-w-[1320px] px-6 pb-16 pt-6">
        <div className="grid grid-cols-12 gap-10">
          {/* LEFT RAIL – Share + Author */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="sticky top-6">
              {/* By */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-black/80">By</span>
                <span className="inline-flex items-center rounded-full border border-black px-3 py-1 text-xs font-semibold">
                  {author}
                </span>
              </div>

              {/* Share */}
              <div className="mt-10">
                <p className="text-sm font-extrabold tracking-widest uppercase">
                  Share
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <ShareIcon href="#" label="Share on Facebook">
                    <Facebook className="h-5 w-5" />
                  </ShareIcon>
                  <ShareIcon href="#" label="Share on Twitter">
                    <Twitter className="h-5 w-5" />
                  </ShareIcon>
                  <ShareIcon href="#" label="Share on LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </ShareIcon>
                  <ShareIcon href="#" label="Share by Email">
                    <Mail className="h-5 w-5" />
                  </ShareIcon>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER CONTENT */}
          <main className="col-span-12 md:col-span-6 lg:col-span-7">
            {/* Date */}
            <div className="flex justify-end">
              <time className="text-sm font-semibold text-black/80">
                {dateLabel}
              </time>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-[34px] leading-[1.15] font-extrabold tracking-tight md:text-[40px]">
              {title}
            </h1>

            {/* Hero image */}
            <div className="mt-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={heroImage}
                  alt={heroAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Body */}
            <div className="mt-10">
              <div className="post-body">{children}</div>
            </div>
          </main>

          {/* RIGHT SIDEBAR – Newsletter */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3">
            <div className="sticky top-6">
              <div className="rounded-md border border-zinc-300 bg-[#f4f3dc] p-7">
                <h3 className="text-xl font-extrabold">{newsletterTitle}</h3>
                <p className="mt-2 text-sm text-black/70">
                  {newsletterSubtitle}
                </p>

                <form
                  className="mt-5 flex items-center gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="h-11 w-full rounded-md border border-black/30 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <button
                    type="submit"
                    className="h-11 shrink-0 rounded-md bg-black px-4 text-sm font-bold text-white hover:bg-black/90"
                  >
                    Get in!
                  </button>
                </form>

                <div className="mt-8 flex justify-end text-xs text-black/40">
                  <span>beehiv</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Local styles */}
      <style jsx>{`
        .post-body :global(p) {
          font-size: 15px;
          line-height: 1.85;
          margin: 0 0 14px 0;
          color: rgba(0, 0, 0, 0.88);
        }

        .post-body :global(p:first-of-type::first-letter) {
          float: left;
          font-size: 68px;
          line-height: 0.9;
          padding-right: 12px;
          padding-top: 6px;
          font-weight: 800;
          color: #000;
        }

        .post-body :global(a) {
          color: #e11d48;
          text-decoration: none;
        }

        .post-body :global(a:hover) {
          text-decoration: underline;
        }
      `}</style>
    </article>
  );
}

// ────────────────────────────────────────────────
// WP Types & Helpers
// ────────────────────────────────────────────────
type WPMedia = {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    sizes?: Record<string, { source_url: string }>;
  };
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: any[];
  };
};

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://your-site.com";

function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  return input
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8230;/g, "…");
}

function stripHtml(input: string) {
  return decodeHtmlEntities(input.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function getFeatured(post: WPPost) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const url =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.source_url;

  return {
    url: url || "/fallback.jpg",
    alt: media?.alt_text || stripHtml(post?.title?.rendered || "Daddieshinor"),
  };
}

function getCategory(post: WPPost) {
  const terms = post?._embedded?.["wp:term"];
  const cats = Array.isArray(terms) ? terms.flat() : [];
  const name =
    cats.find((t: any) => t?.taxonomy === "category")?.name ||
    post?._embedded?.["wp:term"]?.[0]?.[0]?.name ||
    "Uncategorized";
  return stripHtml(String(name));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Pre-build popular slugs (optional but great for performance)
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${WP_BASE_URL}/wp-json/wp/v2/posts?per_page=30&status=publish&orderby=date&order=desc`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const posts: WPPost[] = await res.json();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// Metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  if (!post) return { title: "Not found — Daddieshinor" };
  const title = stripHtml(post.title?.rendered || "Daddieshinor");
  const desc = stripHtml(post.excerpt?.rendered || "").slice(0, 160);
  return { title: `${title} — Daddieshinor`, description: desc };
}

async function fetchPost(slug: string): Promise<WPPost | null> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const data: WPPost[] = await res.json();
  return data?.[0] || null;
}

// ────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────
export default async function EssayPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  if (!post) return notFound();

  const title = stripHtml(post.title?.rendered || "Untitled");
  const category = getCategory(post);
  const date = formatDate(post.date);
  const featured = getFeatured(post);

  return (
    <PostLayout
      title={title}
      author="Shina Hustlé"           // ← dynamic later if WP exposes author
      dateLabel={date}
      heroImage={featured.url}
      heroAlt={featured.alt}
      newsletterTitle="Stay in the Loop"
      newsletterSubtitle="Get new essays, thoughts, and rare insights delivered straight to your inbox — no spam, ever."
    >
      {/* Article body – your prose styles will apply here */}
      <article
        className="
          prose prose-zinc max-w-none
          prose-headings:font-black prose-headings:tracking-tight
          prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-200
          prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md
          prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic
          dark:prose-invert
          mt-10
        "
        dangerouslySetInnerHTML={{ __html: post.content?.rendered || "" }}
      />
    </PostLayout>
  );
}
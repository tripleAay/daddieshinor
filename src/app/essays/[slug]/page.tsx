import Image from "next/image";
import { notFound } from "next/navigation";

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
    url: url || "",
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

// Optional (recommended): let Next prebuild some slugs (fast)
// If you don't want static params, delete this function.
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

// Optional SEO (nice)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  if (!post) return { title: "Not found — Daddieshinor" };
  const title = stripHtml(post.title?.rendered || "Daddieshinor");
  const desc = stripHtml(post.excerpt?.rendered || "").slice(0, 160);
  return { title: `${title} — Daddieshinor`, description: desc };
}

async function fetchPost(slug: string): Promise<WPPost | null> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&slug=${encodeURIComponent(slug)}`;

  const res = await fetch(url, { next: { revalidate: 300 } }); // cache + refresh
  if (!res.ok) return null;

  const data: WPPost[] = await res.json();
  return data?.[0] || null;
}

export default async function EssayPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  if (!post) return notFound();

  const title = stripHtml(post.title?.rendered || "Untitled");
  const category = getCategory(post);
  const date = formatDate(post.date);
  const featured = getFeatured(post);

  return (
    <main className="mx-auto max-w-[900px] px-5 py-12 md:py-16">
      {/* Top meta */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-zinc-800 dark:border-zinc-800 dark:bg-black dark:text-zinc-200">
          {category}
        </span>
        {date && <span className="text-sm text-zinc-500 dark:text-zinc-400">{date}</span>}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black leading-tight tracking-tight text-black dark:text-white md:text-5xl">
        {title}
      </h1>

      {/* Featured image */}
      {featured.url && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
          <Image
            src={featured.url}
            alt={featured.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 900px"
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article
        className="
          prose prose-zinc mt-10 max-w-none
          prose-headings:font-black prose-headings:tracking-tight
          prose-p:leading-relaxed
          dark:prose-invert
        "
        dangerouslySetInnerHTML={{ __html: post.content?.rendered || "" }}
      />
    </main>
  );
}

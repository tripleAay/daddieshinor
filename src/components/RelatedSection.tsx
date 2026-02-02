// components/RelatedSection.tsx
import Image from "next/image";
import Link from "next/link";

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
  title: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
  };
};

type RelatedPost = {
  id: number;
  title: string;
  image: string;
  href: string;
  editorsPick?: boolean;
};

type RelatedSectionProps = {
  currentSlug: string;
  categoryId: number | null;
  categoryName?: string;
};

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";

// Brand accent color
const ACCENT = "#968e68";
const ACCENT_HOVER = "#a8a07a";

function stripHtml(input: string) {
  return (input || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getFeaturedImage(post: WPPost): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0] as any;
  const url =
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url;

  return url || "/fallback.jpg";
}

async function fetchRelated(categoryId: number, currentSlug: string): Promise<RelatedPost[]> {
  const url =
    `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=8&status=publish` +
    `&categories=${categoryId}&orderby=date&order=desc`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];

  const posts: WPPost[] = await res.json();

  // Remove current post + limit to 5
  const filtered = posts.filter((p) => p.slug !== currentSlug).slice(0, 5);

  return filtered.map((p, idx) => ({
    id: p.id,
    title: stripHtml(p.title?.rendered || "Untitled"),
    image: getFeaturedImage(p),
    href: `/essays/${p.slug}`,
    editorsPick: idx < 2, // first 2 as Editor’s Pick
  }));
}

export default async function RelatedSection({
  currentSlug,
  categoryId,
  categoryName = "Related",
}: RelatedSectionProps) {
  if (!categoryId) return null;

  const relatedPosts = await fetchRelated(categoryId, currentSlug);

  if (!relatedPosts.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white">
          More in {categoryName}
        </h2>
        <div className="mt-4 h-1.5 w-32 mx-auto rounded-full bg-gradient-to-r from-black via-[#968e68] to-black dark:from-white dark:via-[#968e68] dark:to-white" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={post.href}
            className="group block overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-[#968e68]/50 transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105 duration-500"
              />
              {post.editorsPick && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex rounded-full bg-[#968e68]/90 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md backdrop-blur">
                    Editor’s Pick
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg md:text-xl font-bold leading-tight text-black dark:text-white group-hover:text-[#968e68] transition-colors line-clamp-2">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
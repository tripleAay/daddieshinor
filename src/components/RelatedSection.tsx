// components/RelatedPosts.tsx
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

type RelatedPostsProps = {
  currentSlug: string;
  categoryId: number | null;
  categoryName?: string;
};

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";

const ACCENT = "#968e68";

function stripHtml(input: string) {
  return (input || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getFeaturedImage(post: WPPost): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const url =
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url ||
    "/fallback.jpg";
  return url;
}

async function fetchRelatedPosts(
  categoryId: number,
  currentSlug: string
): Promise<RelatedPost[]> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=6&status=publish&categories=${categoryId}&orderby=date&order=desc`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const posts: WPPost[] = await res.json();

    // Filter out current post + take max 5
    const filtered = posts
      .filter((p) => p.slug !== currentSlug)
      .slice(0, 5);

    return filtered.map((p, idx) => ({
      id: p.id,
      title: stripHtml(p.title?.rendered || "Untitled"),
      image: getFeaturedImage(p),
      href: `/essays/${p.slug}`,
      editorsPick: idx < 2, // first two get the badge
    }));
  } catch {
    return [];
  }
}

export default async function RelatedPosts({
  currentSlug,
  categoryId,
  categoryName = "Related Essays",
}: RelatedPostsProps) {
  if (!categoryId) return null;

  const posts = await fetchRelatedPosts(categoryId, currentSlug);
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white">
          More in {categoryName}
        </h2>
        <div className="mt-4 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#968e68] to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.href}
            className="group block rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm hover:border-[#968e68]/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {post.editorsPick && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center rounded-full bg-[#968e68]/90 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                    Editor’s Pick
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-base sm:text-lg font-bold leading-tight text-black dark:text-white group-hover:text-[#968e68] transition-colors line-clamp-2 min-h-[2.5rem]">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
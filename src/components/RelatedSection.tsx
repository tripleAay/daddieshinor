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

function stripHtml(input: string) {
  return (input || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getFeaturedImage(post: WPPost): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0] as any;
  const url =
    media?.media_details?.sizes?.thumbnail?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url;

  return url || "/fallback.jpg"; // ensure /public/fallback.jpg exists
}

async function fetchRelated(categoryId: number, currentSlug: string): Promise<RelatedPost[]> {
  const url =
    `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&per_page=8&status=publish` +
    `&categories=${categoryId}&orderby=date&order=desc`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];

  const posts: WPPost[] = await res.json();

  // remove current post + map
  const filtered = posts.filter((p) => p.slug !== currentSlug).slice(0, 5);

  return filtered.map((p, idx) => ({
    id: p.id,
    title: stripHtml(p.title?.rendered || "Untitled"),
    image: getFeaturedImage(p),
    href: `/essays/${p.slug}`,
    // optional: first 2 as “Editor’s Pick”
    editorsPick: idx < 2,
  }));
}

export default async function RelatedSection({
  currentSlug,
  categoryId,
  categoryName = "Related",
}: RelatedSectionProps) {
  // No category found → don’t show empty section
  if (!categoryId) return null;

  const relatedPosts = await fetchRelated(categoryId, currentSlug);

  // Nothing found → don’t show section
  if (!relatedPosts.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div>
        <h2 className="mb-4 border-b border-black pb-2 text-2xl font-extrabold uppercase">
          Related in {categoryName}
        </h2>

        <ul className="space-y-6">
          {relatedPosts.map((post) => (
            <li
              key={post.id}
              className="flex gap-4 border-b border-black pb-6 last:border-none"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div>
                {post.editorsPick && (
                  <span className="mb-1 inline-block rounded border border-black px-2 py-[2px] text-[10px] font-semibold uppercase">
                    Editor’s Pick
                  </span>
                )}

                <Link
                  href={post.href}
                  className="block text-sm font-semibold leading-snug hover:underline"
                >
                  {post.title}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

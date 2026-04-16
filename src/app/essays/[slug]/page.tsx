import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PostLayout from "../[slug]/PostLayoutWrapper";
import WpContentRenderer from "@/components/WpContentRenderer";
import HeadlineLayout from "@/components/headline-layout";
import RelatedPosts from "@/components/RelatedSection";
import Footer from "@/components/footerr";
import PostComments from "@/components/postcomment";

const WP_BASE_URL = (
  process.env.NEXT_PUBLIC_WP_URL || "https://api.daddieshinor.com"
).replace(/\/+$/, "");

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://daddieshinor.com"
).replace(/\/+$/, "");

// --------------------- Types ---------------------
type WPMedia = {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    sizes?: Record<string, { source_url: string }>;
  };
};

type WPTerm = {
  id: number;
  name: string;
  taxonomy: string;
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

// --------------------- Helpers ---------------------
function decodeHtmlEntities(input: string): string {
  if (!input) return "";

  return input
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "…")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(input: string): string {
  return decodeHtmlEntities((input || "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeWpHtml(html: string): string {
  if (!html) return "";

  return html
    .replace(/https:\/\/api\.daddieshinor\.com/gi, SITE_URL)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

function getFeatured(post: WPPost): { url: string; alt: string } {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  const url =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.source_url ||
    "/fallback.jpg";

  return {
    url,
    alt: media?.alt_text || stripHtml(post?.title?.rendered || "Daddieshinor"),
  };
}

function getPrimaryCategory(post: WPPost): { id: number | null; name: string } {
  const terms = post?._embedded?.["wp:term"];
  const flat: WPTerm[] = Array.isArray(terms) ? terms.flat() : [];
  const cat = flat.find((term) => term?.taxonomy === "category");

  if (!cat) {
    return { id: null, name: "Uncategorized" };
  }

  return {
    id: cat.id,
    name: stripHtml(cat.name || "Uncategorized"),
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getReadingTime(html: string): string {
  const text = stripHtml(html);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

// --------------------- Data Fetch ---------------------
async function fetchPost(slug: string): Promise<WPPost | null> {
  const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&slug=${encodeURIComponent(
    slug
  )}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const data: WPPost[] = await res.json();
    return data?.[0] || null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// --------------------- Static Params ---------------------
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${WP_BASE_URL}/wp-json/wp/v2/posts?per_page=30&status=publish&orderby=date&order=desc`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const posts: WPPost[] = await res.json();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

// --------------------- Metadata ---------------------
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: "Not found | Daddieshinor",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = stripHtml(post.title?.rendered || "Daddieshinor");
  const desc =
    stripHtml(post.excerpt?.rendered || "") ||
    stripHtml(post.content?.rendered || "").slice(0, 160);

  const featured = getFeatured(post);
  const canonicalUrl = `${SITE_URL}/essays/${slug}`;

  return {
    title: `${title} | Daddieshinor`,
    description: desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: desc,
      url: canonicalUrl,
      siteName: "Daddieshinor",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified || post.date,
      images: featured.url
        ? [
            {
              url: featured.url,
              width: 1200,
              height: 630,
              alt: featured.alt || title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: featured.url ? [featured.url] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// --------------------- Page Component ---------------------
export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) return notFound();

  const title = stripHtml(post.title?.rendered || "Untitled");
  const desc =
    stripHtml(post.excerpt?.rendered || "") ||
    stripHtml(post.content?.rendered || "").slice(0, 160);

  const date = formatDate(post.date);
  const featured = getFeatured(post);
  const primaryCategory = getPrimaryCategory(post);
  const safeHtml = sanitizeWpHtml(post.content?.rendered || "");
  const readingTime = getReadingTime(post.content?.rendered || "");
  const canonicalUrl = `${SITE_URL}/essays/${slug}`;

  const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",

  "@id": `${canonicalUrl}#article`,
  url: canonicalUrl,

  headline: title,
  description: desc.slice(0, 160),

  image: featured.url ? [featured.url] : [],

  datePublished: post.date,
  dateModified: post.modified || post.date,

  author: {
    "@type": "Person",
    name: "Shina Hustle",
  },

  publisher: {
    "@type": "Organization",
    name: "Daddieshinor",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  },

  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonicalUrl,
  },

  articleSection: primaryCategory.name,

  keywords: [
    "productivity",
    "burnout",
    "discipline",
    "self improvement",
    "growth mindset",
  ],

  wordCount: stripHtml(post.content?.rendered || "").split(/\s+/).length,
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <PostLayout
        title={title}
        category={primaryCategory.name}
        author="Shina Hustle"
        dateLabel={date}
        heroImage={featured.url}
        heroAlt={featured.alt}
        readingTime={readingTime}
      >
        <WpContentRenderer html={safeHtml} />

        <div className="mt-14">
          <PostComments postId={post.id} />
        </div>

        <div className="mt-14">
          <RelatedPosts
            currentSlug={slug}
            categoryId={primaryCategory.id}
            categoryName={primaryCategory.name}
          />
        </div>

        <div className="mt-14">
          <HeadlineLayout title="Latest Essays" />
        </div>

        <div className="mt-14">
          <Footer />
        </div>
      </PostLayout>
    </>
  );
}
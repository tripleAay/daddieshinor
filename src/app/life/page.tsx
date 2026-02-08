// app/life/page.tsx
import { Metadata } from "next";
import LifeCategoryView from "./lifeCategoryView";

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com";
const LIFE_CATEGORY_ID = 18;

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type WPMediaSize = {
  source_url: string;
};

type WPMedia = {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    sizes?: {
      large?: WPMediaSize;
      medium_large?: WPMediaSize;
      [key: string]: WPMediaSize | undefined;
    };
  };
};

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
  };
};

export type CardPost = {
  id: number;
  href: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  image: string;
  alt: string;
};

// ────────────────────────────────────────────────
// Utility Functions
// ────────────────────────────────────────────────
function decodeHtmlEntities(input: string | undefined): string {
  if (!input) return "";
  return input
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')     // ← fixed here
    .replace(/&#8230;/g, "…")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html: string | undefined): string {
  if (!html) return "";
  const decoded = decodeHtmlEntities(html);
  const plain = decoded.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getBestImage(post: WPPost): { url: string; alt: string } {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) {
    return { url: "/fallback.jpg", alt: "Daddieshinor placeholder" };
  }

  const sizes = media.media_details?.sizes;

  const url =
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    media.source_url ||
    "/fallback.jpg";

  const alt = media.alt_text || stripHtml(post.title.rendered) || "Daddieshinor";

  return { url, alt };
}

// ────────────────────────────────────────────────
// Data Fetching
// ────────────────────────────────────────────────
async function fetchLifePosts(): Promise<CardPost[]> {
  try {
    const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&categories=${LIFE_CATEGORY_ID}&per_page=12&orderby=date&order=desc`;

    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5 minutes
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch life posts: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: WPPost[] = await res.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected data format from WP API");
      return [];
    }

    return data.map((post) => {
      const { url: image, alt } = getBestImage(post);
      const title = stripHtml(post.title.rendered) || "Untitled";
      const rawExcerpt = stripHtml(post.excerpt?.rendered);
      const excerpt = rawExcerpt ? `${rawExcerpt.slice(0, 180)}…` : "";

      return {
        id: post.id,
        href: `/essays/${post.slug}`,
        title,
        excerpt,
        dateLabel: formatDate(post.date),
        image,
        alt,
      };
    });
  } catch (error) {
    console.error("Error fetching life posts:", error);
    return [];
  }
}

// ────────────────────────────────────────────────
// Metadata (SEO + Social)
// ────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Life – Daddieshinor",
  description:
    "Life in motion — habits, clarity, relationships, and the quiet work of becoming.",
  openGraph: {
    title: "Life – Daddieshinor",
    description:
      "Life in motion — habits, clarity, relationships, and the quiet work of becoming.",
    url: "https://daddieshinor.com/life",
    siteName: "Daddieshinor",
    type: "website",
    images: [
      {
        url: "/og-life.jpg",
        width: 1200,
        height: 630,
        alt: "Life – Daddieshinor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life – Daddieshinor",
    description:
      "Life in motion — habits, clarity, relationships, and the quiet work of becoming.",
    images: ["/og-life.jpg"],
  },
  // Optional: add canonical if needed
  // alternates: { canonical: "https://daddieshinor.com/life" },
};

// ────────────────────────────────────────────────
// Page Component
// ────────────────────────────────────────────────
export default async function LifePage() {
  const posts = await fetchLifePosts();
  return <LifeCategoryView posts={posts} />;
}
import { Metadata } from "next";
import BrandingCategoryView from "./brandcultureCategoryView";

const WP_BASE_URL = (process.env.NEXT_PUBLIC_WP_URL || "https://daddieshinor.com").replace(/\/$/, "");
const BRANDING_CATEGORY_ID = 13;
const url = `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish&categories=${BRANDING_CATEGORY_ID}&per_page=12&orderby=date&order=desc`;



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
    excerpt?: { rendered: string };
    _embedded?: {
        "wp:featuredmedia"?: WPMedia[];
    };
};

type CardPost = {
    id: number;
    href: string;
    title: string;
    excerpt: string;
    dateLabel: string;
    image: string;
    alt: string;
};

// --- Helpers (SSR-safe) ---
function decodeHtmlEntities(input: string): string {
    if (!input) return "";
    return input
        .replace(/&amp;/g, "&")
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#8230;/g, "…");
}

function stripHtml(input: string) {
    return decodeHtmlEntities((input || "").replace(/<[^>]*>/g, " "))
        .replace(/\s+/g, " ")
        .trim();
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getFeaturedImage(post: WPPost): { url: string; alt: string } {
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

// --- Fetch Posts safely ---
async function fetchBrandingPosts(): Promise<CardPost[]> {
    try {
        const url =
            `${WP_BASE_URL}/wp-json/wp/v2/posts?_embed&status=publish` +
            `&categories=${BRANDING_CATEGORY_ID}&per_page=12&orderby=date&order=desc`;

        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) return [];

        const data: WPPost[] = await res.json();
        if (!Array.isArray(data)) return [];

        return data.map((post) => {
            const title = stripHtml(post.title?.rendered || "Untitled");
            const excerpt = stripHtml(post.excerpt?.rendered || "").slice(0, 180);
            const img = getFeaturedImage(post);

            return {
                id: post.id,
                href: `/essays/${post.slug}`,
                title,
                excerpt: excerpt ? `${excerpt}…` : "",
                dateLabel: formatDate(post.date),
                image: img.url,
                alt: img.alt,
            };
        });
    } catch (err) {
        console.error("Failed to fetch branding posts:", err);
        return []; // Never crash build
    }
}

export const metadata: Metadata = {
    title: "Branding – Daddieshinor",
    description:
        "Brand strategy, identity, positioning, and the psychology behind what people trust.",
    alternates: {
        canonical: "https://daddieshinor.com/brands",
    },
    openGraph: {
        title: "Branding – Daddieshinor",
        description:
            "Brand strategy, identity, positioning, and the psychology behind what people trust.",
        url: "https://daddieshinor.com/brands",
        siteName: "Daddieshinor",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Branding – Daddieshinor",
        description:
            "Brand strategy, identity, positioning, and the psychology behind what people trust.",
    },
};


export default async function BrandingPage() {
    const posts = await fetchBrandingPosts();
    return <BrandingCategoryView posts={posts} />;
}

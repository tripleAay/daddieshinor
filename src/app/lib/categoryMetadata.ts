import type { Metadata } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://daddieshinor.com"
).replace(/\/+$/, "");

type CategoryMetaInput = {
  title: string;
  description: string;
  slug: string;
  og: string;
  keywords?: readonly string[];
};

export function createCategoryMetadata({
  title,
  description,
  slug,
  og,
  keywords = [],
}: CategoryMetaInput): Metadata {
  return {
    title: `${title} | Daddieshinor`,
    description,
    keywords: [...keywords],
    alternates: {
      canonical: `${SITE_URL}/${slug}`,
    },
    openGraph: {
      title: `${title} | Daddieshinor`,
      description,
      url: `${SITE_URL}/${slug}`,
      siteName: "Daddieshinor",
      type: "website",
      images: [
        {
          url: `${SITE_URL}${og}`,
          width: 1200,
          height: 630,
          alt: `${title} — Daddieshinor`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Daddieshinor`,
      description,
      images: [`${SITE_URL}${og}`],
    },
  };
}

export function createCollectionPageSchema({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${title} | Daddieshinor`,
    description,
    url: `${SITE_URL}/${slug}`,
  };
}
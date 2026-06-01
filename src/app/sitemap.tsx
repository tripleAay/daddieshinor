// src/app/sitemap.ts
import { MetadataRoute } from "next";

type WPPost = {
  slug: string;
  modified?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://daddieshinor.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/tech`, lastModified: new Date() },
    { url: `${baseUrl}/branding`, lastModified: new Date() },
    { url: `${baseUrl}/culture`, lastModified: new Date() },
    { url: `${baseUrl}/life`, lastModified: new Date() },
  ];

  try {
    const res = await fetch(
      "https://api.daddieshinor.com/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=slug,modified",
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return staticPages;

    const posts: WPPost[] = await res.json();

    const postUrls: MetadataRoute.Sitemap = posts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${baseUrl}/essays/${post.slug}`,
        lastModified: post.modified ? new Date(post.modified) : new Date(),
      }));

    return [...staticPages, ...postUrls];
  } catch {
    return staticPages;
  }
}
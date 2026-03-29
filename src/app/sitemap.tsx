import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://daddieshinor.com";

  let posts: any[] = [];

  try {
    const res = await fetch(
      "https://api.daddieshinor.com/wp-json/wp/v2/posts?per_page=100&_embed",
      { cache: "no-store" }
    );

    if (res.ok) {
      posts = await res.json();
    }
  } catch (err) {
    console.error("Sitemap fetch error:", err);
  }

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/essays/${post.slug}`,
    lastModified: new Date(post.modified),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tech`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/branding`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/culture`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/life`,
      lastModified: new Date(),
    },

    ...postUrls,
  ];
}
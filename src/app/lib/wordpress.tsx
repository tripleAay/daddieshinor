const WP_URL = process.env.NEXT_PUBLIC_WP_URL!;

export async function getPosts() {
  const res = await fetch(
    `${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=10&status=publish&orderby=date&order=desc`,
    {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("WordPress fetch failed:", res.status, res.statusText);
    throw new Error("Failed to fetch posts");
  }

  const posts = await res.json();

  return posts.map((post: any) => ({
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered,
    date: post.date,

    // ✅ SAFE FEATURED IMAGE EXTRACTION
    featuredImage:
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,

    // optional extras
    categories: post.categories,
    author: post._embedded?.author?.[0]?.name ?? "Admin",
  }));
}

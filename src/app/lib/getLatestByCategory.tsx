const WP_URL = process.env.NEXT_PUBLIC_WP_URL;

export async function getLatestByCategory(categorySlug: string) {
  const res = await fetch(
    `${WP_URL}/wp-json/wp/v2/posts?_embed&per_page=1&categories=${categorySlug}&orderby=date&order=desc`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ${categorySlug}`);
  }

  const posts = await res.json();
  return posts[0] ?? null;
}

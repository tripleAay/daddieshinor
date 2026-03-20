/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://daddieshinor.com',          // Your live domain
  generateRobotsTxt: true,                      // Also creates robots.txt
  changefreq: 'weekly',                         // Good default for blog posts
  priority: 0.7,                                // Standard for most pages
  sitemapSize: 7000,                            // Safe even if you grow to thousands of posts
  exclude: [
    '/wp-admin/*',
    '/private/*',
    '/api/*',
    '/wp-json/*',                               // Optional: exclude WP API endpoints
    '/admin/*',                                 // Any other internal paths
  ],

  // Optional: customize each entry (e.g. for static pages)
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },

  // Dynamically include all your essays from WordPress
  additionalPaths: async (config) => {
    try {
      const response = await fetch(
        'https://daddieshinor.com/wp-json/wp/v2/posts?per_page=100&_embed=1',
        { next: { revalidate: 3600 } } // Cache for 1 hour – adjust as needed
      );

      if (!response.ok) {
        console.warn('Failed to fetch posts for sitemap:', response.status);
        return [];
      }

      const posts = await response.json();

      return posts.map((post) => ({
        loc: `/essays/${post.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: post.modified ? new Date(post.modified).toISOString() : undefined,
      }));
    } catch (error) {
      console.error('Error fetching posts for sitemap:', error);
      return []; // Fallback: empty array – build won't fail
    }
  },
};
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://daddieshinor.com/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://daddieshinor.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://daddieshinor.com/tech",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // add other static routes
  ];
}

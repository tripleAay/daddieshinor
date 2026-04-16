export const CATEGORY_CONFIG = {
  tech: {
    id: 4,
    title: "Technology Insights, Analysis & Commentary",
    description:
      "Explore technology through depth, clarity, and perspective — sharp analysis of trends, tools, innovation, digital culture, and the real human implications of tech.",
    slug: "tech",
    og: "/og-tech.jpg",
    keywords: [
      "technology blog",
      "tech analysis",
      "technology insights",
      "digital culture commentary",
      "innovation and society",
      "tech trends explained",
      "human impact of technology",
      "Daddieshinor tech",
    ],
  },

  branding: {
    id: 13,
    title: "Brand Strategy, Identity & Positioning",
    description:
      "Explore brand strategy, identity, positioning, and the psychology of trust through thoughtful analysis, creative insight, and real-world brand commentary.",
    slug: "branding",
    og: "/og-branding.jpg",
    keywords: [
      "brand strategy",
      "brand identity",
      "brand positioning",
      "branding psychology",
      "creative strategy",
      "brand commentary",
      "modern branding insights",
      "Daddieshinor branding",
    ],
  },

  culture: {
    id: 17,
    title: "Culture Insights, Commentary & Analysis",
    description:
      "Explore culture through depth, clarity, and perspective — commentary on what people feel, follow, repeat, and become across media, society, identity, and modern life.",
    slug: "culture",
    og: "/og-culture.jpg",
    keywords: [
      "culture blog",
      "culture analysis",
      "digital culture",
      "media and society",
      "identity and culture",
      "modern life commentary",
      "cultural insights",
      "Daddieshinor culture",
    ],
  },

  life: {
    id: 18,
    title: "Real Life, Perspective & Personal Growth",
    description:
      "Explore personal growth, lived experience, reflection, and perspective through essays on life, struggle, meaning, and becoming.",
    slug: "life",
    og: "/og-life.jpg",
    keywords: [
      "personal growth blog",
      "life perspective",
      "self reflection",
      "modern life commentary",
      "personal development",
      "mindset and growth",
      "Daddieshinor life",
    ],
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
export type CategoryConfig = (typeof CATEGORY_CONFIG)[CategoryKey];
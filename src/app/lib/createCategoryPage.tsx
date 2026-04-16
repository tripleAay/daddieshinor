import type { Metadata } from "next";
import type { ReactNode } from "react";

import type { CategoryConfig } from "@/app/lib/categories";
import { fetchPostsByCategory } from "@/app/lib/fetchPosts";
import {
  createCategoryMetadata,
  createCollectionPageSchema,
} from "@/app/lib/categoryMetadata";

type ViewComponentProps = {
  posts: Awaited<ReturnType<typeof fetchPostsByCategory>>;
};

type ViewComponent = (props: ViewComponentProps) => ReactNode;

export function buildCategoryMetadata(config: CategoryConfig): Metadata {
  return createCategoryMetadata({
    title: config.title,
    description: config.description,
    slug: config.slug,
    og: config.og,
    keywords: config.keywords ? [...config.keywords] : undefined,
  });
}

export async function renderCategoryPage(
  config: CategoryConfig,
  View: ViewComponent
) {
  const posts = await fetchPostsByCategory(config.id);

  const schema = createCollectionPageSchema({
    title: config.title,
    description: config.description,
    slug: config.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <View posts={posts} />
    </>
  );
}
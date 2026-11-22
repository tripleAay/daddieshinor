import { Metadata } from "next";
import LifeCategoryView from "./lifeCategoryView";

import { CATEGORY_CONFIG } from "@/app/lib/categories";
import {
  buildCategoryMetadata,
  renderCategoryPage,
} from "@/app/lib/createCategoryPage";

const config = CATEGORY_CONFIG.life;

export const metadata: Metadata = buildCategoryMetadata(config);

export default async function LifePage() {
  return renderCategoryPage(config, LifeCategoryView);
}
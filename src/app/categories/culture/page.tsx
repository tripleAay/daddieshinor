import { Metadata } from "next";
import CultureCategoryView from "./cultureCategoryView";

import { CATEGORY_CONFIG } from "@/app/lib/categories";
import {
  buildCategoryMetadata,
  renderCategoryPage,
} from "@/app/lib/createCategoryPage";

const config = CATEGORY_CONFIG.culture;

export const metadata: Metadata = buildCategoryMetadata(config);

export default async function CulturePage() {
  return renderCategoryPage(config, CultureCategoryView);
}
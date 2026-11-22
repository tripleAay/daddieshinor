import { Metadata } from "next";
import TechCategoryView from "./techCategoryView";

import { CATEGORY_CONFIG } from "@/app/lib/categories";
import {
  buildCategoryMetadata,
  renderCategoryPage,
} from "@/app/lib/createCategoryPage";

const config = CATEGORY_CONFIG.tech;

export const metadata: Metadata = buildCategoryMetadata(config);

export default async function TechPage() {
  return renderCategoryPage(config, TechCategoryView);
}
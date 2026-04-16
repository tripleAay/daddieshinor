import { Metadata } from "next";
import BrandingCategoryView from "./brandcultureCategoryView";

import { CATEGORY_CONFIG } from "@/app/lib/categories";
import {
  buildCategoryMetadata,
  renderCategoryPage,
} from "@/app/lib/createCategoryPage";

const config = CATEGORY_CONFIG.branding;

export const metadata: Metadata = buildCategoryMetadata(config);

export default async function BrandingPage() {
  return renderCategoryPage(config, BrandingCategoryView);
}
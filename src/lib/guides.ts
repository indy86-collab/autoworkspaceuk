import { guideDocuments } from "@/content/guides";
import { guideHeadings, guideHrefs, guidePlainText, guideWordCount, type GuideDocument } from "@/content/guides/blocks";
import { HOME_GUIDE_SLUGS, guideSlug } from "@/content/guide-routes";
import { publicCategoryOf } from "@/lib/categories";
import type { Listing } from "@/lib/types";

const guidesBySlug = new Map(guideDocuments.map((guide) => [guide.slug, guide]));

const guideForCategorySlug: Record<string, string> = {
  "rent-a-ramp": guideSlug.rentARamp,
  "self-service-garage": guideSlug.ownCar,
  "automotive-workshop-hire": guideSlug.trade,
  "garage-bay-hire": guideSlug.checklist,
  "vehicle-lift-hire": guideSlug.lifts,
  "spray-booth-hire": guideSlug.checklist,
  "detailing-bay-hire": guideSlug.checklist,
  "motorcycle-workspace": guideSlug.ownCar,
  "hgv-workshop-hire": guideSlug.trade,
};

export function getAllGuides(): readonly GuideDocument[] {
  return guideDocuments;
}

export function getPublishedGuides(): GuideDocument[] {
  return guideDocuments.filter((guide) => guide.status === "published");
}

export function getGuide(slug: string): GuideDocument | undefined {
  const guide = guidesBySlug.get(slug);
  return guide?.status === "published" ? guide : undefined;
}

export function publishedGuideParams(): { slug: string }[] {
  return getPublishedGuides().map((guide) => ({ slug: guide.slug }));
}

export function getHomeGuides(): GuideDocument[] {
  return HOME_GUIDE_SLUGS.flatMap((slug) => {
    const guide = getGuide(slug);
    return guide ? [guide] : [];
  });
}

export function getRelatedGuides(guide: GuideDocument): GuideDocument[] {
  return guide.relatedGuideSlugs.flatMap((slug) => {
    const related = getGuide(slug);
    return related ? [related] : [];
  });
}

export function getGuideForCategory(slug: string): GuideDocument | undefined {
  const guideId = guideForCategorySlug[slug];
  return guideId ? getGuide(guideId) : undefined;
}

export function getGuideForListing(listing: Listing): GuideDocument | undefined {
  const category = publicCategoryOf(listing.primary_category);
  if (!category) {
    return undefined;
  }
  return getGuideForCategory(category.slug);
}

export function readingMinutes(guide: GuideDocument): number {
  return Math.max(1, Math.round(guideWordCount(guide) / 220));
}

export { guideHeadings, guideHrefs, guidePlainText, guideWordCount };

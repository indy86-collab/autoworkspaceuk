/**
 * Public-copy checks. Unpublished JSON notes may mention review/coming-soon
 * status; those records must not appear on public pages.
 */

import { getCategoryEditorial } from "@/content/category-editorial";
import { guidePlainText } from "@/content/guides/blocks";
import { getPublishedGuides } from "@/lib/guides";
import { getPopulatedCategories } from "@/lib/listings";
import { publicOverview, visiblePriceSummary } from "@/lib/public-listing";
import type { Listing } from "@/lib/types";

const PUBLIC_PLACEHOLDERS =
  /\blorem ipsum\b|\bTODO\b|\bFIXME\b|\bsample data\b|\bplaceholder copy\b|\b\[fixture\]\b|\bis_fixture\b|\bdevelopment only\b|\blocalhost(?::\d+)?\b/i;

export function publicContentIssues(listings: readonly Listing[]): string[] {
  const issues: string[] = [];
  const live = listings.filter((listing) => listing.publish_status === "live");

  for (const listing of live) {
    const publicText = [publicOverview(listing), visiblePriceSummary(listing.pricing) ?? ""].join("\n");
    if (PUBLIC_PLACEHOLDERS.test(publicText)) {
      issues.push(`${listing.slug}: public listing copy still looks like placeholder or development text`);
    }
    if (/\bcoming soon\b/i.test(publicText)) {
      issues.push(`${listing.slug}: live listing public copy contains “coming soon”`);
    }
    if (/https?:\/\/localhost\b/i.test(publicText)) {
      issues.push(`${listing.slug}: live listing public copy contains a localhost URL`);
    }
  }

  for (const guide of getPublishedGuides()) {
    const text = guidePlainText(guide);
    if (PUBLIC_PLACEHOLDERS.test(text) || /\blorem ipsum\b/i.test(text)) {
      issues.push(`guide ${guide.slug}: published copy still looks like placeholder or development text`);
    }
  }

  for (const category of getPopulatedCategories()) {
    const copy = getCategoryEditorial(category.slug);
    if (!copy) {
      continue;
    }
    if (PUBLIC_PLACEHOLDERS.test(JSON.stringify(copy))) {
      issues.push(`category ${category.slug}: editorial copy still looks like placeholder or development text`);
    }
  }

  return issues;
}

export function sourceTextLooksLikePlaceholder(value: string): boolean {
  return PUBLIC_PLACEHOLDERS.test(value);
}

import { getCategory } from "@/lib/categories";
import { audienceLabel, formatVerifiedDate } from "@/lib/format";
import { getListingsByCategory } from "@/lib/listings";
import { cardPriceLabel, formatPlace, orderedAudience } from "@/lib/public-listing";
import { siteConfig } from "@/lib/site";
import type { Listing } from "@/lib/types";
import type { Metadata } from "next";

export function isIndexableListing(listing: Listing): boolean {
  return listing.publish_status === "live";
}

export function isIndexableCategory(slug: string): boolean {
  return getListingsByCategory(slug).some((listing) => isIndexableListing(listing));
}

export function buildMetadata({
  title,
  description,
  path,
  index,
  follow,
}: {
  title: string;
  description: string;
  path: string;
  index: boolean;
  follow?: boolean;
}): Metadata {
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const robots = { index, follow: follow ?? index };

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots,
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function listingMetaTitle(listing: Listing): string {
  const category = getCategory(listing.primary_category)?.name ?? "Automotive workspace";
  return `${listing.name} — ${category} in ${listing.address.city} | ${siteConfig.name}`;
}

export function listingDescription(listing: Listing): string {
  const category = getCategory(listing.primary_category)?.name ?? "Automotive workspace";
  const price = cardPriceLabel(listing.pricing);
  const who = orderedAudience(listing.audience).map(audienceLabel).join(" and ");
  const priceText = price ? ` ${price}.` : "";
  return `${listing.name} is a ${category} in ${formatPlace(listing)}.${priceText} ${who}. Last checked ${formatVerifiedDate(listing.last_verified)}.`;
}

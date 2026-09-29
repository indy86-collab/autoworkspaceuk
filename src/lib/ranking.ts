import { hasNumericPrice } from "@/lib/format";
import { hasAnyNumericPrice } from "@/lib/public-listing";
import type { Listing, ListingPricing } from "@/lib/types";

export const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price", label: "Lowest published starting price" },
  { id: "verified", label: "Recently verified" },
  { id: "name", label: "A–Z" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

const SORT_IDS = new Set<string>(SORT_OPTIONS.map((option) => option.id));

export function parseSortId(value: string | string[] | undefined): SortId {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && SORT_IDS.has(raw) ? (raw as SortId) : "recommended";
}

function verificationScore(listing: Listing): number {
  switch (listing.verification_level) {
    case "first_party":
      return 40;
    case "secondary":
      return 22;
    case "marketplace_current":
      return 14;
    case "conflicting":
      return 0;
  }
}

function completenessScore(listing: Listing): number {
  let score = 0;
  if (listing.website) {
    score += 8;
  }
  if (listing.phone) {
    score += 6;
  }
  if (listing.email) {
    score += 3;
  }
  if (listing.address.line1) {
    score += 4;
  }
  if (listing.address.postcode) {
    score += 4;
  }
  if (listing.equipment.length >= 4) {
    score += 8;
  } else if (listing.equipment.length > 0) {
    score += 4;
  }
  if (hasNumericPrice(listing.pricing)) {
    score += 12;
  } else if (listing.pricing.summary?.includes("£")) {
    score += 6;
  }
  if (listing.notes && listing.notes.trim().length > 40) {
    score += 4;
  }
  if (listing.audience.length > 1) {
    score += 2;
  }
  return score;
}

function recencyScore(listing: Listing): number {
  const stamp = Number(listing.last_verified.replace(/-/g, ""));
  if (!Number.isFinite(stamp)) {
    return 0;
  }
  return stamp / 1_000_000;
}

export function recommendedScore(listing: Listing): number {
  return verificationScore(listing) + completenessScore(listing) + recencyScore(listing);
}

/**
 * Ranking-only figure. Hourly rates are compared directly. Longer periods are
 * converted to a rough hourly equivalent so a day rate is not treated as cheaper
 * than an hourly rate simply because the period label is different.
 */
export function comparableStartingPrice(pricing: ListingPricing): number | null {
  if (pricing.hourly_from_gbp != null) {
    return pricing.hourly_from_gbp;
  }
  if (pricing.half_day_from_gbp != null) {
    return pricing.half_day_from_gbp / 4;
  }
  if (pricing.day_from_gbp != null) {
    return pricing.day_from_gbp / 8;
  }
  if (pricing.week_from_gbp != null) {
    return pricing.week_from_gbp / 40;
  }
  if (pricing.monthly_from_gbp != null) {
    return pricing.monthly_from_gbp / 160;
  }
  return null;
}

export function sortListings(listings: readonly Listing[], sort: SortId): Listing[] {
  const copy = [...listings];

  switch (sort) {
    case "price":
      copy.sort((a, b) => {
        const aPrice = comparableStartingPrice(a.pricing);
        const bPrice = comparableStartingPrice(b.pricing);
        if (aPrice == null && bPrice == null) {
          return a.name.localeCompare(b.name, "en-GB");
        }
        if (aPrice == null) {
          return 1;
        }
        if (bPrice == null) {
          return -1;
        }
        return aPrice - bPrice || a.name.localeCompare(b.name, "en-GB");
      });
      return copy;
    case "verified":
      copy.sort(
        (a, b) =>
          b.last_verified.localeCompare(a.last_verified) || a.name.localeCompare(b.name, "en-GB"),
      );
      return copy;
    case "name":
      copy.sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
      return copy;
    case "recommended":
    default:
      copy.sort(
        (a, b) =>
          recommendedScore(b) - recommendedScore(a) ||
          b.last_verified.localeCompare(a.last_verified) ||
          a.name.localeCompare(b.name, "en-GB"),
      );
      return copy;
  }
}

export function hasPublishedPrice(pricing: ListingPricing): boolean {
  return hasAnyNumericPrice(pricing) || Boolean(pricing.summary?.includes("£"));
}

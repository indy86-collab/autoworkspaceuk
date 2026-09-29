import { listingMatchesCategory, publicCategoryOf } from "@/lib/categories";
import { formatGbp, formatVerifiedDate } from "@/lib/format";
import { getListingsByCategory, getLiveListings, getPopulatedCategories, getRegions } from "@/lib/listings";
import { formatPlace, hasAnyNumericPrice, publicPriceSummary } from "@/lib/public-listing";
import type { Listing, VerificationLevel } from "@/lib/types";
import { verificationSourceSummary } from "@/lib/verification";

export function median(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

export function isRampOrLiftListing(listing: Listing): boolean {
  return listingMatchesCategory(listing, "rent-a-ramp") || listingMatchesCategory(listing, "vehicle-lift-hire");
}

function equipmentMentionsTools(listing: Listing): boolean {
  return listing.equipment.some((item) => /\btools?\b|\btoolset\b|\btoolkit\b/i.test(item));
}

function equipmentMentionsTwoPost(listing: Listing): boolean {
  return listing.equipment.some((item) => /\b(two-post|2-post)\b/i.test(item));
}

function equipmentMentionsFourPost(listing: Listing): boolean {
  return listing.equipment.some((item) => /\b(four-post|4-post)\b/i.test(item));
}

function equipmentMentionsLift(listing: Listing): boolean {
  return listing.equipment.some((item) => /\b(lifts?|ramps?|hoists?|two-post|four-post|2-post|4-post)\b/i.test(item));
}

/** Rent-a-ramp or vehicle-lift category, or equipment text that names a lift, ramp, or hoist. */
export function mentionsLiftOrRamp(listing: Listing): boolean {
  return isRampOrLiftListing(listing) || equipmentMentionsLift(listing);
}

function publishedPriceText(listing: Listing): string | null {
  const summary = publicPriceSummary(listing.pricing.summary);
  if (!summary || !summary.includes("£")) {
    return null;
  }
  return summary;
}

export function hasPublishedPrice(listing: Listing): boolean {
  return hasAnyNumericPrice(listing.pricing) || publishedPriceText(listing) !== null;
}

function verificationLabel(level: VerificationLevel): string {
  return verificationSourceSummary(level);
}

export interface ReportStat {
  display: string;
  label: string;
  detail: string;
}

export const REPORT_STAT_IDS = [
  "verifiedFacilities",
  "regions",
  "populatedCategories",
  "publishedPrices",
  "hourlyPrices",
  "tools",
  "lifts",
  "consumerAccess",
  "tradeAccess",
] as const;

export type ReportStatId = (typeof REPORT_STAT_IDS)[number];

export interface WorkspaceReport {
  liveCount: number;
  regionCount: number;
  regionNames: readonly string[];
  populatedCategoryCount: number;
  earliestVerified: string;
  latestVerified: string;
  earliestVerifiedLabel: string;
  latestVerifiedLabel: string;
  categories: readonly { slug: string; name: string; count: number }[];
  audience: {
    consumerOnly: number;
    tradeOnly: number;
    both: number;
    other: number;
    consumerAvailable: number;
    tradeAvailable: number;
  };
  publishedPriceCount: number;
  numericPriceCount: number;
  prosePriceCount: number;
  hourlyCount: number;
  toolCount: number;
  liftMentionCount: number;
  twoPostCount: number;
  fourPostCount: number;
  liftWithoutNamedPostCount: number;
  verification: readonly { label: string; count: number }[];
  stats: Record<ReportStatId, ReportStat>;
}

function latestIso(dates: readonly string[]): string {
  return [...dates].sort((a, b) => a.localeCompare(b)).at(-1) ?? "";
}

function earliestIso(dates: readonly string[]): string {
  return [...dates].sort((a, b) => a.localeCompare(b))[0] ?? "";
}

export function getWorkspaceReport(): WorkspaceReport {
  const live = getLiveListings();
  const dates = live.map((listing) => listing.last_verified);
  const earliestVerified = earliestIso(dates);
  const latestVerified = latestIso(dates);
  const regionNames = getRegions();

  const categories = getPopulatedCategories()
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      count: getListingsByCategory(category.slug).length,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "en-GB"));

  const audience = { consumerOnly: 0, tradeOnly: 0, both: 0, other: 0 };
  for (const listing of live) {
    const consumer = listing.audience.includes("consumer");
    const trade = listing.audience.includes("trade");
    if (consumer && trade) {
      audience.both += 1;
    } else if (consumer) {
      audience.consumerOnly += 1;
    } else if (trade) {
      audience.tradeOnly += 1;
    } else {
      audience.other += 1;
    }
  }

  const publishedPriceCount = live.filter(hasPublishedPrice).length;
  const numericPriceCount = live.filter((listing) => hasAnyNumericPrice(listing.pricing)).length;
  const prosePriceCount = live.filter((listing) => !hasAnyNumericPrice(listing.pricing) && publishedPriceText(listing) !== null).length;
  const hourlyCount = live.filter((listing) => listing.pricing.hourly_from_gbp != null).length;
  const toolCount = live.filter(equipmentMentionsTools).length;
  const liftListings = live.filter(mentionsLiftOrRamp);
  const twoPostCount = live.filter(equipmentMentionsTwoPost).length;
  const fourPostCount = live.filter(equipmentMentionsFourPost).length;
  const liftWithoutNamedPostCount = liftListings.filter(
    (listing) => !equipmentMentionsTwoPost(listing) && !equipmentMentionsFourPost(listing),
  ).length;

  const verificationCounts = new Map<string, number>();
  for (const listing of live) {
    const label = verificationLabel(listing.verification_level);
    verificationCounts.set(label, (verificationCounts.get(label) ?? 0) + 1);
  }
  const verification = [...verificationCounts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "en-GB"));

  const consumerAvailable = audience.consumerOnly + audience.both;
  const tradeAvailable = audience.tradeOnly + audience.both;
  const liveCount = live.length;

  const stats: Record<ReportStatId, ReportStat> = {
    verifiedFacilities: {
      display: String(liveCount),
      label: "Verified facilities",
      detail: "Published listings only. Records still being checked, marked coming soon, or held back are excluded.",
    },
    regions: {
      display: String(regionNames.length),
      label: "Region labels",
      detail: "Distinct region names on published listings. They are not a single official map of UK counties.",
    },
    populatedCategories: {
      display: String(categories.length),
      label: "Workspace types with listings",
      detail: "Public categories that currently have at least one published facility.",
    },
    publishedPrices: {
      display: String(publishedPriceCount),
      label: "Facilities with a published price",
      detail: "A numeric starting rate, or a public price statement that includes a pound amount.",
    },
    hourlyPrices: {
      display: String(hourlyCount),
      label: "Facilities with an hourly starting price",
      detail: "The hourly field is filled in. A price for a block of hours is not converted into an hourly rate.",
    },
    tools: {
      display: String(toolCount),
      label: "Facilities mentioning tools",
      detail: "Equipment text includes tool, tools, toolset, or toolkit. A single named hand tool is not counted on its own.",
    },
    lifts: {
      display: String(liftListings.length),
      label: "Facilities mentioning a lift or ramp",
      detail: "Equipment text names a lift, ramp, or hoist, or the listing is filed under Rent a Ramp or Vehicle Lift Hire.",
    },
    consumerAccess: {
      display: String(consumerAvailable),
      label: "Recorded as open to consumer use",
      detail: `${audience.consumerOnly} consumer-only and ${audience.both} recorded as both consumer and trade.`,
    },
    tradeAccess: {
      display: String(tradeAvailable),
      label: "Recorded as open to trade use",
      detail: `${audience.tradeOnly} trade-only and ${audience.both} recorded as both consumer and trade.`,
    },
  };

  return {
    liveCount,
    regionCount: regionNames.length,
    regionNames,
    populatedCategoryCount: categories.length,
    earliestVerified,
    latestVerified,
    earliestVerifiedLabel: formatVerifiedDate(earliestVerified),
    latestVerifiedLabel: formatVerifiedDate(latestVerified),
    categories,
    audience: { ...audience, consumerAvailable, tradeAvailable },
    publishedPriceCount,
    numericPriceCount,
    prosePriceCount,
    hourlyCount,
    toolCount,
    liftMentionCount: liftListings.length,
    twoPostCount,
    fourPostCount,
    liftWithoutNamedPostCount,
    verification,
    stats,
  };
}

export interface PriceExample {
  slug: string;
  name: string;
  place: string;
  categorySlug: string;
  categoryName: string;
  amount: number;
  vatExcluded: boolean;
  hourly: number | null;
}

export interface ProsePriceExample {
  slug: string;
  name: string;
  place: string;
  categorySlug: string;
  categoryName: string;
  text: string;
}

export interface HourEquivalent {
  slug: string;
  name: string;
  hours: number;
}

export interface OtherHourlyGroup {
  slug: string;
  name: string;
  count: number;
  lowest: number;
  highest: number;
  examples: readonly PriceExample[];
}

export interface RampPriceResearch {
  rampOrLiftCount: number;
  hourly: readonly PriceExample[];
  halfDay: readonly PriceExample[];
  day: readonly PriceExample[];
  prosePrices: readonly ProsePriceExample[];
  lowestHourly: number | null;
  highestHourly: number | null;
  medianHourly: number | null;
  dayEquivalents: readonly HourEquivalent[];
  halfDayEquivalents: readonly HourEquivalent[];
  vatExcludedHourlyCount: number;
  otherHourly: readonly OtherHourlyGroup[];
  earliestVerified: string | null;
  latestVerified: string | null;
  earliestVerifiedLabel: string | null;
  latestVerifiedLabel: string | null;
}

function priceExample(listing: Listing, amount: number): PriceExample {
  const category = publicCategoryOf(listing.primary_category);
  return {
    slug: listing.slug,
    name: listing.name,
    place: formatPlace(listing),
    categorySlug: category?.slug ?? listing.primary_category,
    categoryName: category?.name ?? "Automotive workspace",
    amount,
    vatExcluded: listing.pricing.vat_excluded === true,
    hourly: listing.pricing.hourly_from_gbp ?? null,
  };
}

function byAmountThenName(a: PriceExample, b: PriceExample): number {
  return a.amount - b.amount || a.name.localeCompare(b.name, "en-GB");
}

export function formatHourEquivalent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const clean = Math.abs(value - rounded) < 1e-9;
  const quantity = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  const unit = rounded === 1 ? "hour" : "hours";
  return clean ? `${quantity} ${unit}` : `about ${quantity} ${unit}`;
}

export function getRampPriceResearch(): RampPriceResearch {
  const scoped = getLiveListings().filter(isRampOrLiftListing);
  const hourly = scoped
    .filter((listing) => listing.pricing.hourly_from_gbp != null)
    .map((listing) => priceExample(listing, listing.pricing.hourly_from_gbp as number))
    .sort(byAmountThenName);
  const halfDay = scoped
    .filter((listing) => listing.pricing.half_day_from_gbp != null)
    .map((listing) => priceExample(listing, listing.pricing.half_day_from_gbp as number))
    .sort(byAmountThenName);
  const day = scoped
    .filter((listing) => listing.pricing.day_from_gbp != null)
    .map((listing) => priceExample(listing, listing.pricing.day_from_gbp as number))
    .sort(byAmountThenName);
  const prosePrices = scoped.flatMap((listing) => {
    if (hasAnyNumericPrice(listing.pricing)) {
      return [];
    }
    const text = publishedPriceText(listing);
    if (!text) {
      return [];
    }
    const category = publicCategoryOf(listing.primary_category);
    return [
      {
        slug: listing.slug,
        name: listing.name,
        place: formatPlace(listing),
        categorySlug: category?.slug ?? listing.primary_category,
        categoryName: category?.name ?? "Automotive workspace",
        text,
      },
    ];
  });

  const hourlyAmounts = hourly.map((item) => item.amount);
  const dayEquivalents = day.flatMap((item) => {
    if (item.hourly == null || item.hourly <= 0) {
      return [];
    }
    return [{ slug: item.slug, name: item.name, hours: item.amount / item.hourly }];
  });
  const halfDayEquivalents = halfDay.flatMap((item) => {
    if (item.hourly == null || item.hourly <= 0) {
      return [];
    }
    return [{ slug: item.slug, name: item.name, hours: item.amount / item.hourly }];
  });

  const otherByCategory = new Map<string, PriceExample[]>();
  for (const listing of getLiveListings()) {
    if (isRampOrLiftListing(listing) || listing.pricing.hourly_from_gbp == null) {
      continue;
    }
    const example = priceExample(listing, listing.pricing.hourly_from_gbp);
    const group = otherByCategory.get(example.categorySlug) ?? [];
    group.push(example);
    otherByCategory.set(example.categorySlug, group);
  }
  const otherHourly = [...otherByCategory.entries()]
    .map(([slug, examples]) => {
      const sorted = [...examples].sort(byAmountThenName);
      return {
        slug,
        name: sorted[0]?.categoryName ?? slug,
        count: sorted.length,
        lowest: sorted[0]?.amount ?? 0,
        highest: sorted[sorted.length - 1]?.amount ?? 0,
        examples: sorted,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "en-GB"));

  const dated = scoped.filter(
    (listing) =>
      listing.pricing.hourly_from_gbp != null ||
      listing.pricing.half_day_from_gbp != null ||
      listing.pricing.day_from_gbp != null ||
      publishedPriceText(listing) !== null,
  );
  const dates = dated.map((listing) => listing.last_verified).filter(Boolean);
  const earliestVerified = dates.length > 0 ? earliestIso(dates) : null;
  const latestVerified = dates.length > 0 ? latestIso(dates) : null;

  return {
    rampOrLiftCount: scoped.length,
    hourly,
    halfDay,
    day,
    prosePrices,
    lowestHourly: hourlyAmounts.length > 0 ? hourlyAmounts[0] : null,
    highestHourly: hourlyAmounts.length > 0 ? hourlyAmounts[hourlyAmounts.length - 1] : null,
    medianHourly: median(hourlyAmounts),
    dayEquivalents,
    halfDayEquivalents,
    vatExcludedHourlyCount: hourly.filter((item) => item.vatExcluded).length,
    otherHourly,
    earliestVerified,
    latestVerified,
    earliestVerifiedLabel: earliestVerified ? formatVerifiedDate(earliestVerified) : null,
    latestVerifiedLabel: latestVerified ? formatVerifiedDate(latestVerified) : null,
  };
}

export function formatGbpAmount(amount: number): string {
  return formatGbp(amount);
}

import { getCategory } from "@/lib/categories";
import {
  AUDIENCES,
  PUBLISH_STATUSES,
  VERIFICATION_LEVELS,
  type Audience,
  type Listing,
  type ListingPricing,
  type PublishStatus,
  type VerificationLevel,
} from "@/lib/types";

const LISTING_KEYS = new Set([
  "id",
  "slug",
  "name",
  "publish_status",
  "verification_level",
  "primary_category",
  "categories",
  "audience",
  "address",
  "phone",
  "email",
  "website",
  "pricing",
  "equipment",
  "notes",
  "source_url",
  "last_verified",
  "restrictions",
  "vehicle_capacity",
]);

const ADDRESS_KEYS = new Set(["line1", "city", "region", "postcode", "country"]);

const PRICING_KEYS = new Set([
  "hourly_from_gbp",
  "half_day_from_gbp",
  "day_from_gbp",
  "week_from_gbp",
  "month_from_gbp",
  "monthly_from_gbp",
  "vat_excluded",
  "summary",
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(id: string, message: string): never {
  throw new Error(`Listing ${id}: ${message}`);
}

function assertKnownKeys(record: Record<string, unknown>, allowed: Set<string>, id: string, label: string): void {
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      fail(id, `unexpected ${label} field "${key}"`);
    }
  }
}

function requiredString(record: Record<string, unknown>, key: string, id: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "") {
    fail(id, `${key} must be a non-empty string`);
  }
  return value;
}

function nullableString(record: Record<string, unknown>, key: string, id: string): string | null {
  const value = record[key];
  if (value === null) {
    return null;
  }
  if (typeof value !== "string" || value.trim() === "") {
    fail(id, `${key} must be a string or null`);
  }
  return value;
}

function httpUrl(value: string, id: string, field: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    fail(id, `${field} must be an http(s) URL`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    fail(id, `${field} must be an http(s) URL`);
  }

  return value;
}

function optionalPrice(record: Record<string, unknown>, key: string, id: string): number | undefined {
  if (!(key in record)) {
    return undefined;
  }

  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    fail(id, `${key} must be a non-negative number when present`);
  }

  return value;
}

function parsePricing(value: unknown, id: string): ListingPricing {
  if (!isRecord(value)) {
    fail(id, "pricing must be an object");
  }

  assertKnownKeys(value, PRICING_KEYS, id, "pricing");

  const pricing: ListingPricing = {};
  const hourly = optionalPrice(value, "hourly_from_gbp", id);
  const halfDay = optionalPrice(value, "half_day_from_gbp", id);
  const day = optionalPrice(value, "day_from_gbp", id);
  const week = optionalPrice(value, "week_from_gbp", id);

  if (hourly !== undefined) pricing.hourly_from_gbp = hourly;
  if (halfDay !== undefined) pricing.half_day_from_gbp = halfDay;
  if (day !== undefined) pricing.day_from_gbp = day;
  if (week !== undefined) pricing.week_from_gbp = week;

  const legacyMonth = optionalPrice(value, "month_from_gbp", id);
  const monthly = optionalPrice(value, "monthly_from_gbp", id);
  if (legacyMonth !== undefined && monthly !== undefined && legacyMonth !== monthly) {
    fail(id, "month_from_gbp and monthly_from_gbp do not match");
  }
  const month = monthly ?? legacyMonth;
  if (month !== undefined) pricing.monthly_from_gbp = month;

  if ("vat_excluded" in value) {
    if (typeof value.vat_excluded !== "boolean") {
      fail(id, "pricing.vat_excluded must be a boolean when present");
    }
    pricing.vat_excluded = value.vat_excluded;
  }

  if ("summary" in value) {
    if (typeof value.summary !== "string" || value.summary.trim() === "") {
      fail(id, "pricing.summary must be a non-empty string when present");
    }
    pricing.summary = value.summary;
  }

  return pricing;
}

function parseListing(value: unknown, index: number): Listing {
  if (!isRecord(value)) {
    throw new Error(`Listing at index ${index} must be an object`);
  }

  const id = typeof value.id === "string" && value.id.trim() !== "" ? value.id : `#${index}`;
  assertKnownKeys(value, LISTING_KEYS, id, "listing");

  const listingId = requiredString(value, "id", id);
  const slug = requiredString(value, "slug", listingId);
  if (!SLUG_PATTERN.test(slug)) {
    fail(listingId, "slug must use lowercase letters, numbers, and hyphens");
  }

  const publishStatus = requiredString(value, "publish_status", listingId);
  if (!PUBLISH_STATUSES.includes(publishStatus as PublishStatus)) {
    fail(listingId, `publish_status must be one of ${PUBLISH_STATUSES.join(", ")}`);
  }

  const verificationLevel = requiredString(value, "verification_level", listingId);
  if (!VERIFICATION_LEVELS.includes(verificationLevel as VerificationLevel)) {
    fail(listingId, `verification_level must be one of ${VERIFICATION_LEVELS.join(", ")}`);
  }

  const primaryCategory = requiredString(value, "primary_category", listingId);
  if (!getCategory(primaryCategory)) {
    fail(listingId, `unknown primary_category "${primaryCategory}". Add it to src/lib/categories.ts`);
  }

  if (!Array.isArray(value.categories) || value.categories.length === 0) {
    fail(listingId, "categories must be a non-empty array");
  }

  const categories: string[] = [];
  for (const category of value.categories) {
    if (typeof category !== "string" || !getCategory(category)) {
      fail(listingId, `unknown category "${String(category)}". Add it to src/lib/categories.ts`);
    }
    if (!categories.includes(category)) {
      categories.push(category);
    }
  }

  if (!categories.includes(primaryCategory)) {
    fail(listingId, "categories must include primary_category");
  }

  if (!Array.isArray(value.audience) || value.audience.length === 0) {
    fail(listingId, "audience must include consumer, trade, or both");
  }

  const audience: Audience[] = [];
  for (const entry of value.audience) {
    if (typeof entry !== "string" || !AUDIENCES.includes(entry as Audience)) {
      fail(listingId, "audience entries must be consumer or trade");
    }
    const typed = entry as Audience;
    if (!audience.includes(typed)) {
      audience.push(typed);
    }
  }

  if (!isRecord(value.address)) {
    fail(listingId, "address must be an object");
  }
  assertKnownKeys(value.address, ADDRESS_KEYS, listingId, "address");

  const country = value.address.country;
  if (country !== "GB") {
    fail(listingId, 'address.country must be "GB"');
  }

  const phone = nullableString(value, "phone", listingId);
  const email = nullableString(value, "email", listingId);
  const website = nullableString(value, "website", listingId);

  if (email !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail(listingId, "email must be a valid address or null");
  }

  if (website !== null) {
    httpUrl(website, listingId, "website");
  }

  if (!Array.isArray(value.equipment) || value.equipment.some((item) => typeof item !== "string" || item.trim() === "")) {
    fail(listingId, "equipment must be an array of non-empty strings");
  }

  const lastVerified = requiredString(value, "last_verified", listingId);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastVerified) || Number.isNaN(Date.parse(`${lastVerified}T00:00:00Z`))) {
    fail(listingId, "last_verified must be an ISO date (YYYY-MM-DD)");
  }

  const sourceUrl = httpUrl(requiredString(value, "source_url", listingId), listingId, "source_url");

  let notes: string | undefined;
  if ("notes" in value) {
    if (typeof value.notes !== "string" || value.notes.trim() === "") {
      fail(listingId, "notes must be a non-empty string when present");
    }
    notes = value.notes;
  }

  let restrictions: string[] | undefined;
  if ("restrictions" in value) {
    if (
      !Array.isArray(value.restrictions) ||
      value.restrictions.length === 0 ||
      value.restrictions.some((item) => typeof item !== "string" || item.trim() === "")
    ) {
      fail(listingId, "restrictions must be an array of non-empty strings when present");
    }
    restrictions = value.restrictions;
  }

  let vehicleCapacity: string | undefined;
  if ("vehicle_capacity" in value) {
    if (typeof value.vehicle_capacity !== "string" || value.vehicle_capacity.trim() === "") {
      fail(listingId, "vehicle_capacity must be a non-empty string when present");
    }
    vehicleCapacity = value.vehicle_capacity;
  }

  const listing: Listing = {
    id: listingId,
    slug,
    name: requiredString(value, "name", listingId),
    publish_status: publishStatus as PublishStatus,
    verification_level: verificationLevel as VerificationLevel,
    primary_category: primaryCategory,
    categories,
    audience,
    address: {
      line1: nullableString(value.address, "line1", listingId),
      city: requiredString(value.address, "city", listingId),
      region: nullableString(value.address, "region", listingId),
      postcode: nullableString(value.address, "postcode", listingId),
      country: "GB",
    },
    phone,
    email,
    website,
    pricing: parsePricing(value.pricing, listingId),
    equipment: value.equipment as string[],
    source_url: sourceUrl,
    last_verified: lastVerified,
  };

  if (notes !== undefined) {
    listing.notes = notes;
  }
  if (restrictions !== undefined) {
    listing.restrictions = restrictions;
  }
  if (vehicleCapacity !== undefined) {
    listing.vehicle_capacity = vehicleCapacity;
  }

  return listing;
}

export function parseListings(value: unknown): Listing[] {
  if (!Array.isArray(value)) {
    throw new Error("listings.json must be an array");
  }

  const listings = value.map((entry, index) => parseListing(entry, index));
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const listing of listings) {
    if (ids.has(listing.id)) {
      throw new Error(`Duplicate listing id "${listing.id}"`);
    }
    if (slugs.has(listing.slug)) {
      throw new Error(`Duplicate listing slug "${listing.slug}"`);
    }
    ids.add(listing.id);
    slugs.add(listing.slug);
  }

  return listings;
}

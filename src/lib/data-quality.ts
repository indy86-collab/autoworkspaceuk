import { getCategory } from "@/lib/categories";
import { equipmentLabelNeedsNormalisation, normaliseEquipmentLabel } from "@/lib/equipment";
import { hasAnyNumericPrice } from "@/lib/public-listing";
import { getVerificationAge } from "@/lib/verification";
import type { Listing } from "@/lib/types";

export interface NamedRecord {
  id: string;
  slug: string;
  name: string;
  detail?: string;
}

export interface DuplicateGroup {
  value: string;
  listings: NamedRecord[];
}

export interface EquipmentInconsistency {
  raw: string;
  normalised: string;
  listings: string[];
}

export interface DataAuditReport {
  totalRecords: number;
  liveRecords: number;
  liveMissingPostcode: NamedRecord[];
  liveMissingStreet: NamedRecord[];
  liveMissingWebsite: NamedRecord[];
  liveMissingPhone: NamedRecord[];
  liveMissingPricing: NamedRecord[];
  liveSecondaryVerification: NamedRecord[];
  duplicatePhones: DuplicateGroup[];
  duplicateWebsites: DuplicateGroup[];
  duplicatePostcodes: DuplicateGroup[];
  suspiciousCityRegion: NamedRecord[];
  unknownCategories: string[];
  inconsistentEquipment: EquipmentInconsistency[];
  pricingSummaryOnly: NamedRecord[];
}

export interface MaintenanceReport {
  addressCompletion: NamedRecord[];
  firstPartyVerification: NamedRecord[];
  missingPricing: NamedRecord[];
  notCheckedRecently: NamedRecord[];
  reviewReadyForPromotion: NamedRecord[];
}

function named(listing: Listing, detail?: string): NamedRecord {
  return { id: listing.id, slug: listing.slug, name: listing.name, detail };
}

function digits(value: string): string {
  return value.replace(/\D/g, "");
}

function websiteKey(value: string): string {
  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, "").toLowerCase() + url.pathname.replace(/\/$/, "").toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

function postcodeKey(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

function duplicates(items: Array<{ key: string; listing: Listing }>): DuplicateGroup[] {
  const groups = new Map<string, Listing[]>();
  for (const item of items) {
    const list = groups.get(item.key) ?? [];
    list.push(item.listing);
    groups.set(item.key, list);
  }
  return [...groups.entries()]
    .filter(([, listings]) => listings.length > 1)
    .map(([value, listings]) => ({
      value,
      listings: listings.map((listing) => named(listing)),
    }))
    .sort((a, b) => a.value.localeCompare(b.value, "en-GB"));
}

function hasPricing(listing: Listing): boolean {
  return hasAnyNumericPrice(listing.pricing) || Boolean(listing.pricing.summary?.trim());
}

export function buildDataAudit(listings: readonly Listing[]): DataAuditReport {
  const live = listings.filter((listing) => listing.publish_status === "live");
  const unknownCategories = new Set<string>();
  const equipmentMap = new Map<string, EquipmentInconsistency>();

  for (const listing of listings) {
    for (const slug of [listing.primary_category, ...listing.categories]) {
      if (!getCategory(slug)) {
        unknownCategories.add(slug);
      }
    }
    for (const item of listing.equipment) {
      if (!equipmentLabelNeedsNormalisation(item)) {
        continue;
      }
      const normalised = normaliseEquipmentLabel(item);
      const existing = equipmentMap.get(item) ?? { raw: item, normalised, listings: [] };
      if (!existing.listings.includes(listing.slug)) {
        existing.listings.push(listing.slug);
      }
      equipmentMap.set(item, existing);
    }
  }

  return {
    totalRecords: listings.length,
    liveRecords: live.length,
    liveMissingPostcode: live.filter((listing) => !listing.address.postcode).map((listing) => named(listing)),
    liveMissingStreet: live.filter((listing) => !listing.address.line1).map((listing) => named(listing)),
    liveMissingWebsite: live.filter((listing) => !listing.website).map((listing) => named(listing)),
    liveMissingPhone: live.filter((listing) => !listing.phone).map((listing) => named(listing)),
    liveMissingPricing: live.filter((listing) => !hasPricing(listing)).map((listing) => named(listing)),
    liveSecondaryVerification: live
      .filter((listing) => listing.verification_level === "secondary")
      .map((listing) => named(listing, listing.verification_level)),
    duplicatePhones: duplicates(
      live.filter((listing) => listing.phone).map((listing) => ({ key: digits(listing.phone as string), listing })),
    ),
    duplicateWebsites: duplicates(
      live.filter((listing) => listing.website).map((listing) => ({ key: websiteKey(listing.website as string), listing })),
    ),
    duplicatePostcodes: duplicates(
      live
        .filter((listing) => listing.address.postcode)
        .map((listing) => ({ key: postcodeKey(listing.address.postcode as string), listing })),
    ),
    suspiciousCityRegion: live
      .filter(
        (listing) =>
          Boolean(listing.address.region) &&
          listing.address.city.trim().toLowerCase() === listing.address.region!.trim().toLowerCase(),
      )
      .map((listing) => named(listing, `${listing.address.city} / ${listing.address.region}`)),
    unknownCategories: [...unknownCategories].sort((a, b) => a.localeCompare(b, "en-GB")),
    inconsistentEquipment: [...equipmentMap.values()].sort((a, b) => a.raw.localeCompare(b.raw, "en-GB")),
    pricingSummaryOnly: live
      .filter((listing) => !hasAnyNumericPrice(listing.pricing) && Boolean(listing.pricing.summary?.trim()))
      .map((listing) => named(listing)),
  };
}

export function buildMaintenanceReport(listings: readonly Listing[], now: Date = new Date()): MaintenanceReport {
  const live = listings.filter((listing) => listing.publish_status === "live");
  const review = listings.filter((listing) => listing.publish_status === "review");

  return {
    addressCompletion: live
      .filter((listing) => !listing.address.line1 || !listing.address.postcode)
      .map((listing) =>
        named(
          listing,
          [!listing.address.line1 ? "street" : null, !listing.address.postcode ? "postcode" : null].filter(Boolean).join(", "),
        ),
      ),
    firstPartyVerification: live
      .filter((listing) => listing.verification_level !== "first_party")
      .map((listing) => named(listing, listing.verification_level)),
    missingPricing: live.filter((listing) => !hasPricing(listing)).map((listing) => named(listing)),
    notCheckedRecently: listings
      .filter((listing) => getVerificationAge(listing.last_verified, now).freshness === "potentially_stale")
      .map((listing) => named(listing, `${listing.last_verified} (${listing.publish_status})`)),
    reviewReadyForPromotion: review
      .filter((listing) => {
        if (listing.verification_level === "conflicting") {
          return false;
        }
        const hasPlace = Boolean(listing.address.line1 || listing.address.postcode);
        return Boolean(listing.website) && hasPlace;
      })
      .map((listing) => named(listing, listing.verification_level)),
  };
}

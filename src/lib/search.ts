import { getDiscoveryArea, listingInArea } from "@/lib/areas";
import { categoryLabels, listingMatchesCategory } from "@/lib/categories";
import { hasNumericPrice } from "@/lib/format";
import { isLiveListing } from "@/lib/publishing";
import { hasPublishedPrice, sortListings, type SortId } from "@/lib/ranking";
import type { Audience, Listing } from "@/lib/types";

export const EQUIPMENT_FILTERS = [
  {
    id: "vehicle-lift",
    label: "Vehicle lift / ramp",
    keywords: ["vehicle lift", "two-post", "four-post", "2-post", "4-post", "vehicle ramp", "vehicle hoist", "ramp"],
  },
  { id: "tools", label: "Tools", keywords: ["tool"] },
  { id: "engine-hoist", label: "Engine hoist", keywords: ["engine hoist", "engine crane"] },
  { id: "diagnostics", label: "Diagnostics", keywords: ["diagnostic", "autodata"] },
  { id: "welding", label: "Welding", keywords: ["weld"] },
  { id: "spray-booth", label: "Spray booth", keywords: ["spray booth", "paint booth"] },
] as const;

export type EquipmentFilterId = (typeof EQUIPMENT_FILTERS)[number]["id"];

export const PRICE_FILTERS = [{ id: "listed", label: "Has published price" }] as const;

export type PriceFilterId = (typeof PRICE_FILTERS)[number]["id"];

export interface DirectoryQuery {
  location: string;
  category: string;
  region: string;
  area: string;
  audience: Audience | "";
  price: PriceFilterId | "";
  equipment: EquipmentFilterId[];
}

type SearchParamValue = string | string[] | undefined;

export type DirectorySearchParams = Record<string, SearchParamValue>;

const PRICE_IDS = new Set<string>(PRICE_FILTERS.map((filter) => filter.id));
const EQUIPMENT_IDS = new Set<string>(EQUIPMENT_FILTERS.map((filter) => filter.id));
const LEGACY_PRICE_IDS = new Set(["hourly", "half_day", "day", "week", "month"]);

export function emptyDirectoryQuery(): DirectoryQuery {
  return {
    location: "",
    category: "",
    region: "",
    area: "",
    audience: "",
    price: "",
    equipment: [],
  };
}

function firstValue(value: SearchParamValue): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

function manyValues(value: SearchParamValue): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
}

export function parseDirectoryQuery(params: DirectorySearchParams): DirectoryQuery {
  const audience = firstValue(params.audience);
  const price = firstValue(params.price);
  const listedPrice = PRICE_IDS.has(price) || LEGACY_PRICE_IDS.has(price) ? "listed" : "";

  return {
    location: firstValue(params.location),
    category: firstValue(params.category),
    region: firstValue(params.region),
    area: firstValue(params.area),
    audience: audience === "consumer" || audience === "trade" ? audience : "",
    price: listedPrice,
    equipment: manyValues(params.equipment).filter((value): value is EquipmentFilterId => EQUIPMENT_IDS.has(value)),
  };
}

export function hasActiveQuery(query: DirectoryQuery): boolean {
  return Boolean(
    query.location ||
      query.category ||
      query.region ||
      query.area ||
      query.audience ||
      query.price ||
      query.equipment.length > 0,
  );
}

export function activeFilterCount(query: DirectoryQuery): number {
  return [
    query.location,
    query.category,
    query.region,
    query.area,
    query.audience,
    query.price,
    ...query.equipment,
  ].filter(Boolean).length;
}

export function directoryQueryToSearchParams(query: DirectoryQuery, sort?: SortId): URLSearchParams {
  const params = new URLSearchParams();
  if (query.location) {
    params.set("location", query.location);
  }
  if (query.category) {
    params.set("category", query.category);
  }
  if (query.region) {
    params.set("region", query.region);
  }
  if (query.area) {
    params.set("area", query.area);
  }
  if (query.audience) {
    params.set("audience", query.audience);
  }
  if (query.price) {
    params.set("price", query.price);
  }
  for (const item of query.equipment) {
    params.append("equipment", item);
  }
  if (sort && sort !== "recommended") {
    params.set("sort", sort);
  }
  return params;
}

function compactPostcode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function outwardCode(postcode: string): string | null {
  const match = compactPostcode(postcode).match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/);
  return match?.[1] ?? null;
}

function looksLikePostcodeQuery(query: string): boolean {
  return /^[A-Z]{1,2}\d[A-Z\d]?(\d[A-Z]{2})?$/.test(compactPostcode(query));
}

function postcodeMatches(postcode: string | null, query: string): boolean {
  if (!postcode || !looksLikePostcodeQuery(query)) {
    return false;
  }

  const compactListing = compactPostcode(postcode);
  const compactQuery = compactPostcode(query);
  if (compactListing === compactQuery) {
    return true;
  }

  const outward = outwardCode(postcode);
  if (!outward) {
    return false;
  }

  return outward === compactQuery || (compactQuery.startsWith(outward) && compactListing.startsWith(compactQuery));
}

function normaliseText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function listingText(listing: Listing): string {
  const labels = listing.categories.flatMap((slug) => categoryLabels(slug));
  return [listing.name, listing.address.city, listing.address.region ?? "", ...labels, ...listing.equipment]
    .join(" \n ")
    .toLowerCase();
}

function matchesLocation(listing: Listing, location: string): boolean {
  const query = normaliseText(location);
  if (!query) {
    return true;
  }

  if (postcodeMatches(listing.address.postcode, query)) {
    return true;
  }

  if (looksLikePostcodeQuery(query)) {
    return false;
  }

  return listingText(listing).includes(query);
}

function matchesEquipment(listing: Listing, filterId: EquipmentFilterId): boolean {
  const filter = EQUIPMENT_FILTERS.find((item) => item.id === filterId);
  if (!filter) {
    return false;
  }

  return listing.equipment.some((item) => {
    const value = item.toLowerCase();
    return filter.keywords.some((keyword) => value.includes(keyword));
  });
}

function matchesPrice(listing: Listing, price: DirectoryQuery["price"]): boolean {
  if (!price) {
    return true;
  }

  if (price === "listed") {
    return hasPublishedPrice(listing.pricing) || hasNumericPrice(listing.pricing);
  }

  return true;
}

function matchesQuery(listing: Listing, query: DirectoryQuery): boolean {
  if (query.category && !listingMatchesCategory(listing, query.category)) {
    return false;
  }

  if (query.region && (listing.address.region ?? "").toLowerCase() !== query.region.toLowerCase()) {
    return false;
  }

  if (query.area) {
    const area = getDiscoveryArea(query.area);
    if (!area || !listingInArea(listing, area)) {
      return false;
    }
  }

  if (query.audience && !listing.audience.includes(query.audience)) {
    return false;
  }

  if (!matchesPrice(listing, query.price)) {
    return false;
  }

  if (query.equipment.some((filterId) => !matchesEquipment(listing, filterId))) {
    return false;
  }

  return matchesLocation(listing, query.location);
}

export function filterListings(listings: readonly Listing[], query: DirectoryQuery): Listing[] {
  return listings.filter((listing) => isLiveListing(listing) && matchesQuery(listing, query));
}

export function fallbackListings(listings: readonly Listing[], query: DirectoryQuery, limit = 3): Listing[] {
  const live = listings.filter(isLiveListing);
  const relaxed: DirectoryQuery[] = [];

  if (query.location) {
    relaxed.push({ ...emptyDirectoryQuery(), location: query.location });
  }
  if (query.area) {
    relaxed.push({ ...emptyDirectoryQuery(), area: query.area });
  }
  if (query.region) {
    relaxed.push({ ...emptyDirectoryQuery(), region: query.region });
  }
  if (query.category) {
    relaxed.push({ ...emptyDirectoryQuery(), category: query.category });
  }

  const seen = new Set<string>();
  const picked: Listing[] = [];

  for (const candidate of relaxed) {
    const matches = sortListings(filterListings(live, candidate), "recommended");
    for (const listing of matches) {
      if (seen.has(listing.id)) {
        continue;
      }
      seen.add(listing.id);
      picked.push(listing);
      if (picked.length >= limit) {
        return picked;
      }
    }
  }

  return picked;
}

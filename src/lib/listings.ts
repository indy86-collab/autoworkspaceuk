import { listingsInArea, DISCOVERY_AREAS, type DiscoveryArea } from "@/lib/areas";
import { getPublicCategories, HOMEPAGE_CATEGORY_SLUGS, type CategoryDefinition } from "@/lib/categories";
import { createDirectory } from "@/lib/directory";
import rawListings from "@/data/listings.json";
import { suggestionSourcesFromListings, type LocationSuggestion } from "@/lib/location-suggestions";
import { parseListings } from "@/lib/validate-listings";
import type { Listing } from "@/lib/types";

const directory = createDirectory(parseListings(rawListings));

/**
 * Every record in the JSON file, including review, coming_soon, and hold.
 * Public pages must use getLiveListings() instead.
 */
export function getStoredListings(): Listing[] {
  return directory.getStoredListings();
}

export function getLiveListings(): Listing[] {
  return directory.getLiveListings();
}

export function getListingBySlug(slug: string): Listing | undefined {
  return directory.getListingBySlug(slug);
}

export function getListingsByCategory(categorySlug: string): Listing[] {
  return directory.getListingsByCategory(categorySlug);
}

export function getListingsByCity(city: string): Listing[] {
  return directory.getListingsByCity(city);
}

export function getListingsByRegion(region: string): Listing[] {
  return directory.getListingsByRegion(region);
}

export function getNearbyAlternatives(listing: Listing, limit = 3): Listing[] {
  return directory.getNearbyAlternatives(listing, limit);
}

export function getFeaturedListings(limit = 6): Listing[] {
  return directory.getFeaturedListings(limit);
}

export function liveListingParams(): { slug: string }[] {
  return getLiveListings().map((listing) => ({ slug: listing.slug }));
}

export function getPopulatedCategories(): CategoryDefinition[] {
  return getPublicCategories().filter((category) => getListingsByCategory(category.slug).length > 0);
}

export function populatedCategoryParams(): { slug: string }[] {
  return getPopulatedCategories().map((category) => ({ slug: category.slug }));
}

export function getHomepageCategories(): CategoryDefinition[] {
  const populated = new Set(getPopulatedCategories().map((category) => category.slug));
  return HOMEPAGE_CATEGORY_SLUGS.flatMap((slug) => {
    const category = getPublicCategories().find((item) => item.slug === slug);
    return category && populated.has(slug) ? [category] : [];
  });
}

export function getRegions(): string[] {
  return [
    ...new Set(
      getLiveListings()
        .map((listing) => listing.address.region)
        .filter((region): region is string => Boolean(region)),
    ),
  ].sort((a, b) => a.localeCompare(b, "en-GB"));
}

export interface DirectoryStats {
  locationCount: number;
  locationLabel: string;
  regionCount: number;
  regionLabel: string;
  categoryCount: number;
  categoryLabel: string;
}

export function publishedCountLabel(listings: readonly Listing[]): string {
  const count = listings.length;
  const noun = count === 1 ? "workspace" : "workspaces";
  return `${count} verified ${noun}`;
}

export function getDirectoryStats(): DirectoryStats {
  const locationCount = getLiveListings().length;
  const regionCount = getRegions().length;
  const categoryCount = getPopulatedCategories().length;

  return {
    locationCount,
    locationLabel: locationCount === 1 ? "verified workspace" : "verified workspaces",
    regionCount,
    regionLabel: regionCount === 1 ? "region" : "regions",
    categoryCount,
    categoryLabel: categoryCount === 1 ? "workspace type" : "workspace types",
  };
}

export function getLocationSuggestionSources(): LocationSuggestion[] {
  return suggestionSourcesFromListings(getLiveListings().map((listing) => listing.address));
}

export function getPopulatedDiscoveryAreas(): { area: DiscoveryArea; listings: Listing[] }[] {
  const live = getLiveListings();
  return DISCOVERY_AREAS.flatMap((area) => {
    const listings = listingsInArea(live, area);
    return listings.length > 0 ? [{ area, listings }] : [];
  });
}

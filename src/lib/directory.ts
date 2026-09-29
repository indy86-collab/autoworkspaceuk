import { listingMatchesCategory, publicCategoriesForListing, publicCategoryOf } from "@/lib/categories";
import { isLiveListing } from "@/lib/publishing";
import type { Listing } from "@/lib/types";

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

function byPlaceThenName(a: Listing, b: Listing): number {
  return a.address.city.localeCompare(b.address.city, "en-GB") || a.name.localeCompare(b.name, "en-GB");
}

function sameCity(a: Listing, b: Listing): boolean {
  return normalise(a.address.city) === normalise(b.address.city);
}

function sameRegion(a: Listing, b: Listing): boolean {
  if (!a.address.region || !b.address.region) {
    return false;
  }
  return normalise(a.address.region) === normalise(b.address.region);
}

function sharesCategory(a: Listing, b: Listing): boolean {
  const aPrimary = publicCategoryOf(a.primary_category)?.slug;
  const bPrimary = publicCategoryOf(b.primary_category)?.slug;
  if (!aPrimary || !bPrimary) {
    return false;
  }
  if (aPrimary === bPrimary) {
    return true;
  }
  const aPublic = new Set(publicCategoriesForListing(a).map((category) => category.slug));
  const bPublic = new Set(publicCategoriesForListing(b).map((category) => category.slug));
  return bPublic.has(aPrimary) || aPublic.has(bPrimary);
}

export function listingSimilarityTier(origin: Listing, other: Listing): number {
  const region = sameArea(origin, other);
  const category = sharesCategory(origin, other);
  if (region && category) {
    return 1;
  }
  if (region) {
    return 2;
  }
  if (category) {
    return 3;
  }
  return 9;
}

function sameArea(a: Listing, b: Listing): boolean {
  return sameRegion(a, b) || sameCity(a, b);
}

function byCloseness(origin: Listing) {
  return (a: Listing, b: Listing): number => {
    const cityRank = (listing: Listing) => (sameCity(listing, origin) ? 0 : 1);
    return cityRank(a) - cityRank(b) || a.name.localeCompare(b.name, "en-GB");
  };
}

export interface ListingDirectory {
  getStoredListings: () => Listing[];
  getLiveListings: () => Listing[];
  getListingBySlug: (slug: string) => Listing | undefined;
  getListingsByCategory: (categorySlug: string) => Listing[];
  getListingsByCity: (city: string) => Listing[];
  getListingsByRegion: (region: string) => Listing[];
  getNearbyAlternatives: (listing: Listing, limit?: number) => Listing[];
  getFeaturedListings: (limit?: number) => Listing[];
}

/**
 * Region and category stand in for distance until real geo search exists.
 * Order: same region and category, then same region, then same category.
 * Unrelated listings are not padded in.
 */
export function createDirectory(listings: readonly Listing[]): ListingDirectory {
  const stored = [...listings];
  const live = stored.filter(isLiveListing).sort(byPlaceThenName);

  function publicMatches(predicate: (listing: Listing) => boolean): Listing[] {
    return live.filter(predicate);
  }

  return {
    getStoredListings() {
      return [...stored];
    },
    getLiveListings() {
      return [...live];
    },
    getListingBySlug(slug: string) {
      return live.find((listing) => listing.slug === slug);
    },
    getListingsByCategory(categorySlug: string) {
      const slug = categorySlug.trim();
      return publicMatches((listing) => listingMatchesCategory(listing, slug));
    },
    getListingsByCity(city: string) {
      const needle = normalise(city);
      return publicMatches((listing) => normalise(listing.address.city) === needle);
    },
    getListingsByRegion(region: string) {
      const needle = normalise(region);
      return publicMatches((listing) => normalise(listing.address.region ?? "") === needle);
    },
    getNearbyAlternatives(listing: Listing, limit = 3) {
      const others = live.filter((item) => item.id !== listing.id && isLiveListing(item));
      const ranked = [...others].sort(byCloseness(listing));
      const sameAreaAndCategory = ranked.filter((item) => sameArea(item, listing) && sharesCategory(item, listing));
      const sameAreaOnly = ranked.filter((item) => sameArea(item, listing) && !sharesCategory(item, listing));
      const categoryOnly = ranked.filter((item) => sharesCategory(item, listing) && !sameArea(item, listing));

      const picked: Listing[] = [];
      for (const group of [sameAreaAndCategory, sameAreaOnly, categoryOnly]) {
        for (const item of group) {
          if (picked.length >= limit) {
            return picked;
          }
          if (!picked.some((existing) => existing.id === item.id)) {
            picked.push(item);
          }
        }
      }

      return picked;
    },
    getFeaturedListings(limit = 6) {
      const remaining = [...live];
      const picked: Listing[] = [];
      const regions = new Set<string>();
      const categories = new Set<string>();

      while (picked.length < limit && remaining.length > 0) {
        let bestIndex = 0;
        let bestScore = -1;

        for (let index = 0; index < remaining.length; index += 1) {
          const candidate = remaining[index];
          const region = candidate.address.region?.trim().toLowerCase() ?? "";
          let score = 0;
          if (region && !regions.has(region)) {
            score += 4;
          }
          if (!categories.has(candidate.primary_category)) {
            score += 2;
          }

          const betterName =
            score === bestScore && candidate.name.localeCompare(remaining[bestIndex].name, "en-GB") < 0;
          if (score > bestScore || betterName) {
            bestScore = score;
            bestIndex = index;
          }
        }

        const next = remaining.splice(bestIndex, 1)[0];
        picked.push(next);
        if (next.address.region) {
          regions.add(next.address.region.trim().toLowerCase());
        }
        categories.add(next.primary_category);
      }

      return picked;
    },
  };
}

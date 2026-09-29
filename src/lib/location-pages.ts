/**
 * Location pages are intentionally not generated yet.
 *
 * A future /location/[slug] page may be indexed only when it has enough live
 * listings to be a useful directory AND substantial unique content of its own.
 * A town name on its own is not enough. Do not add thin city routes that only
 * repeat the same template.
 */
export const LOCATION_PAGE_RULE = {
  minimumLiveListings: 3,
  requiresSubstantialUniqueContent: true,
} as const;

export interface LocationPageCandidate {
  slug: string;
  liveListingCount: number;
  hasSubstantialUniqueContent: boolean;
}

export function isLocationPageIndexable(candidate: LocationPageCandidate): boolean {
  return (
    candidate.liveListingCount >= LOCATION_PAGE_RULE.minimumLiveListings &&
    candidate.hasSubstantialUniqueContent
  );
}

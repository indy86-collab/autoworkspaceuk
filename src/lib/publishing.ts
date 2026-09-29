import type { Listing } from "@/lib/types";

/**
 * The only status that may appear in normal public directory results.
 * review, coming_soon, and hold stay in the data file and stay off public pages.
 */
export function isLiveListing(listing: Listing): boolean {
  return listing.publish_status === "live";
}

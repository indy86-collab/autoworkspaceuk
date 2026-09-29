import type { Listing } from "@/lib/types";

export interface DiscoveryArea {
  id: string;
  name: string;
  regions: readonly string[];
}

/**
 * Broad UK areas used for homepage discovery. Links go to /browse, not to
 * location SEO pages. Only areas with live listings should be shown.
 */
export const DISCOVERY_AREAS: readonly DiscoveryArea[] = [
  {
    id: "london-south-east",
    name: "London & South East",
    regions: ["Greater London / Surrey", "Kent", "Hampshire", "West Sussex", "Buckinghamshire", "Oxfordshire"],
  },
  {
    id: "midlands",
    name: "Midlands",
    regions: [
      "West Midlands",
      "Warwickshire",
      "Derbyshire",
      "South Derbyshire",
      "Staffordshire",
      "Worcestershire",
      "Lincolnshire",
    ],
  },
  {
    id: "north-west",
    name: "North West",
    regions: ["Merseyside", "Greater Manchester", "Lancashire", "Cumbria"],
  },
  {
    id: "north-east",
    name: "North East",
    regions: ["County Durham"],
  },
  {
    id: "east-of-england",
    name: "East of England",
    regions: ["Norfolk"],
  },
  {
    id: "scotland",
    name: "Scotland",
    regions: ["Scotland", "Scottish Borders"],
  },
  {
    id: "wales",
    name: "Wales",
    regions: ["Wales"],
  },
  {
    id: "south-west",
    name: "South West",
    regions: ["Gloucestershire", "Somerset", "Dorset", "Cornwall"],
  },
];

const areaById = new Map(DISCOVERY_AREAS.map((area) => [area.id, area]));

export function getDiscoveryArea(id: string): DiscoveryArea | undefined {
  return areaById.get(id);
}

export function listingInArea(listing: Listing, area: DiscoveryArea): boolean {
  const region = listing.address.region?.trim().toLowerCase() ?? "";
  if (!region) {
    return false;
  }
  return area.regions.some((item) => item.toLowerCase() === region);
}

export function listingsInArea(listings: readonly Listing[], area: DiscoveryArea): Listing[] {
  return listings.filter((listing) => listingInArea(listing, area));
}

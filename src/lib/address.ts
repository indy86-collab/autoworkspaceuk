import type { Listing, ListingAddress } from "@/lib/types";

export type AddressMode = "full" | "town_postcode" | "town" | "region";

export interface PublicAddress {
  mode: AddressMode;
  /** Visible heading for the listing address section. */
  heading: "Address" | "Location";
  /** Deduplicated lines. Missing parts are omitted, never invented. */
  lines: string[];
  /** Short place label for cards and metadata. */
  place: string;
  /** Compact contact-panel line. */
  compact: string;
}

function uniqueParts(parts: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const lines: string[] = [];

  for (const part of parts) {
    const value = part?.trim();
    if (!value) {
      continue;
    }
    const key = value.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    lines.push(value);
  }

  return lines;
}

function townEqualsRegion(address: ListingAddress): boolean {
  return Boolean(address.region && address.region.toLowerCase() === address.city.toLowerCase());
}

function placeLabel(address: ListingAddress): string {
  const city = address.city.trim();
  const region = address.region?.trim() ?? "";
  if (region && region.toLowerCase() !== city.toLowerCase()) {
    return `${city}, ${region}`;
  }
  return city;
}

/**
 * Public address presentation. Does not invent street, town, region, or postcode.
 */
export function publicAddress(listing: Listing): PublicAddress {
  const { line1, city, region, postcode } = listing.address;
  const hasStreet = Boolean(line1?.trim());
  const hasTown = Boolean(city.trim());
  const hasRegion = Boolean(region?.trim());
  const hasPostcode = Boolean(postcode?.trim());
  const sameTownRegion = townEqualsRegion(listing.address);
  const place = placeLabel(listing.address);

  if (!hasStreet && !hasPostcode) {
    if (sameTownRegion && hasTown) {
      return {
        mode: "region",
        heading: "Location",
        lines: [`Location: ${city.trim()}`],
        place: city.trim(),
        compact: city.trim(),
      };
    }
    if (hasTown) {
      return {
        mode: "town",
        heading: "Location",
        lines: [`Location: ${place}`],
        place,
        compact: place,
      };
    }
    if (hasRegion) {
      const regionName = region!.trim();
      return {
        mode: "region",
        heading: "Location",
        lines: [`Location: ${regionName}`],
        place: regionName,
        compact: regionName,
      };
    }
  }

  if (!hasStreet && hasPostcode) {
    const lines = uniqueParts([city, sameTownRegion ? null : region, postcode]);
    return {
      mode: "town_postcode",
      heading: "Address",
      lines,
      place,
      compact: uniqueParts([city, postcode]).join(", "),
    };
  }

  const lines = uniqueParts([line1, city, sameTownRegion ? null : region, postcode]);
  return {
    mode: "full",
    heading: "Address",
    lines,
    place,
    compact: uniqueParts([city, postcode]).join(", ") || place,
  };
}

export function formatPlace(listing: Listing): string {
  return publicAddress(listing).place;
}

export function addressLines(listing: Listing): string[] {
  return publicAddress(listing).lines;
}

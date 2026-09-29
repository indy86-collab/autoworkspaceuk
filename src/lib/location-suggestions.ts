export type LocationSuggestionKind = "city" | "region" | "postcode";

export interface LocationSuggestion {
  label: string;
  kind: LocationSuggestionKind;
}

export interface SuggestionAddress {
  city: string;
  region: string | null;
  postcode: string | null;
}

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function compactPostcode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function parts(label: string): string[] {
  return [label, ...label.split("/").map((part) => part.trim())].filter((part) => part.length > 0);
}

function uniquePush(target: LocationSuggestion[], seen: Set<string>, item: LocationSuggestion): void {
  const key = `${item.kind}:${normalise(item.label)}`;
  if (seen.has(key) || !item.label.trim()) {
    return;
  }
  seen.add(key);
  target.push({ label: item.label.trim(), kind: item.kind });
}

export function suggestionSourcesFromListings(listings: readonly SuggestionAddress[]): LocationSuggestion[] {
  const seen = new Set<string>();
  const sources: LocationSuggestion[] = [];

  for (const listing of listings) {
    uniquePush(sources, seen, { label: listing.city, kind: "city" });
    if (listing.region && listing.region.toLowerCase() !== listing.city.toLowerCase()) {
      uniquePush(sources, seen, { label: listing.region, kind: "region" });
    }
    if (listing.postcode) {
      uniquePush(sources, seen, { label: listing.postcode, kind: "postcode" });
    }
  }

  return sources;
}

function prefixScore(label: string, query: string): number | null {
  const needle = normalise(query);
  if (!needle) {
    return null;
  }

  if (label.startsWith(needle)) {
    return 0;
  }

  for (const part of parts(label)) {
    const value = normalise(part);
    if (value.startsWith(needle)) {
      return 1;
    }
  }

  if (normalise(label).includes(needle)) {
    return 4;
  }

  for (const part of parts(label)) {
    if (normalise(part).includes(needle)) {
      return 5;
    }
  }

  return null;
}

function postcodeScore(postcode: string, query: string): number | null {
  const compactQuery = compactPostcode(query);
  const compactValue = compactPostcode(postcode);
  if (!compactQuery || !compactValue.startsWith(compactQuery)) {
    return null;
  }
  return compactQuery.length === compactValue.length ? 0 : 2;
}

export function matchLocationSuggestions(
  sources: readonly LocationSuggestion[],
  query: string,
  listings: readonly SuggestionAddress[] = [],
  limit = 8,
): LocationSuggestion[] {
  const trimmed = query.trim();
  if (trimmed.length < 1) {
    return [];
  }

  const ranked: { item: LocationSuggestion; score: number }[] = [];
  const seen = new Set<string>();

  for (const source of sources) {
    const score =
      source.kind === "postcode" ? postcodeScore(source.label, trimmed) : prefixScore(source.label, trimmed);
    if (score == null) {
      continue;
    }
    const kindBias = source.kind === "city" ? 0 : source.kind === "region" ? 1 : 2;
    ranked.push({ item: source, score: score * 10 + kindBias });
  }

  ranked.sort(
    (a, b) => a.score - b.score || a.item.label.localeCompare(b.item.label, "en-GB"),
  );

  const results: LocationSuggestion[] = [];
  for (const entry of ranked) {
    uniquePush(results, seen, entry.item);
    if (results.length >= limit) {
      return results;
    }
  }

  if (trimmed.length >= 3) {
    const matchedCities = ranked
      .filter((entry) => entry.item.kind === "city" && entry.score < 40)
      .map((entry) => entry.item.label);
    for (const city of matchedCities) {
      for (const listing of listings) {
        if (listing.city.toLowerCase() !== city.toLowerCase() || !listing.postcode) {
          continue;
        }
        uniquePush(results, seen, { label: listing.postcode, kind: "postcode" });
        if (results.length >= limit) {
          return results;
        }
      }
    }
  }

  return results;
}

export function suggestionKindLabel(kind: LocationSuggestionKind): string {
  switch (kind) {
    case "city":
      return "Town or city";
    case "region":
      return "Region";
    case "postcode":
      return "Postcode";
  }
}

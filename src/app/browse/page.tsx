import { EmptyResults } from "@/components/EmptyResults";
import { BrowseSort } from "@/components/BrowseSort";
import { ListingGrid } from "@/components/ListingGrid";
import { SearchFilters } from "@/components/SearchFilters";
import {
  getLiveListings,
  getLocationSuggestionSources,
  getPopulatedCategories,
  publishedCountLabel,
} from "@/lib/listings";
import { parseSortId, sortListings } from "@/lib/ranking";
import { fallbackListings, filterListings, hasActiveQuery, parseDirectoryQuery } from "@/lib/search";
import { buildMetadata } from "@/lib/seo";
import { getDiscoveryArea } from "@/lib/areas";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Browse automotive workspace",
  description:
    "Browse verified UK automotive workspace for ramp hire, DIY garages, workshop bays, spray booths, detailing bays and specialist vehicle space.",
  path: "/browse",
  index: false,
  follow: true,
});

export default async function BrowsePage(props: PageProps<"/browse">) {
  const searchParams = await props.searchParams;
  const query = parseDirectoryQuery(searchParams);
  const sort = parseSortId(searchParams.sort);
  const live = getLiveListings();
  const listings = sortListings(filterListings(live, query), sort);
  const filtered = hasActiveQuery(query);
  const area = query.area ? getDiscoveryArea(query.area) : undefined;
  const suggestions = listings.length === 0 ? fallbackListings(live, query, 3) : [];
  const sources = getLocationSuggestionSources();
  const suggestionAddresses = live.map((listing) => listing.address);

  return (
    <div className="site-wrap py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Browse workspace</h1>
      <p className="mt-3 max-w-2xl text-slate-700">
        {area
          ? `Verified automotive workspace in ${area.name}.`
          : "Only verified automotive workspaces are shown."}
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
        <SearchFilters
          query={query}
          sort={sort}
          categories={getPopulatedCategories().map((category) => ({
            value: category.slug,
            label: category.name,
          }))}
          sources={sources}
          listings={suggestionAddresses}
        />
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-navy">
              {filtered ? `${listings.length} verified ${listings.length === 1 ? "workspace" : "workspaces"}` : publishedCountLabel(listings)}
            </p>
            <BrowseSort query={query} sort={sort} />
          </div>
          <div className="mt-4">
            {listings.length > 0 ? (
              <ListingGrid listings={listings} layout="results" />
            ) : (
              <EmptyResults suggestions={suggestions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

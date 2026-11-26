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
import { publicCategoryOf } from "@/lib/categories";
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
  const category = publicCategoryOf(query.category);
  const heading = category?.name ?? "Browse workspace";
  const suggestions = listings.length === 0 ? fallbackListings(live, query, 3) : [];
  const sources = getLocationSuggestionSources();
  const suggestionAddresses = live.map((listing) => listing.address);

  return (
    <div className="site-wrap py-7 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-4xl font-bold leading-tight tracking-[-.05em] sm:text-5xl">{heading}{area ? ` in ${area.name}` : ""}</h1>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          Compare prices, equipment and who can book.
        </p>
      </header>
      <div className="grid items-start gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-7">
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
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line pb-3">
            <p className="font-semibold text-navy" role="status">
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

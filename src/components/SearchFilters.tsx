"use client";

import { LocationField } from "@/components/LocationField";
import type { LocationSuggestion, SuggestionAddress } from "@/lib/location-suggestions";
import type { SortId } from "@/lib/ranking";
import {
  EQUIPMENT_FILTERS,
  directoryQueryToSearchParams,
  emptyDirectoryQuery,
  hasActiveQuery,
  parseDirectoryQuery,
  type DirectoryQuery,
} from "@/lib/search";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

interface FilterOption {
  value: string;
  label: string;
}

export function SearchFilters({
  query,
  sort,
  categories,
  sources,
  listings,
}: {
  query: DirectoryQuery;
  sort: SortId;
  categories: readonly FilterOption[];
  sources: readonly LocationSuggestion[];
  listings: readonly SuggestionAddress[];
}) {
  const router = useRouter();
  const advancedCount = Number(Boolean(query.audience)) + Number(Boolean(query.price)) + query.equipment.length;
  const clearQuery = directoryQueryToSearchParams(emptyDirectoryQuery(), sort).toString();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = parseDirectoryQuery({
      location: String(form.get("location") ?? ""),
      category: String(form.get("category") ?? ""),
      region: query.region,
      area: query.area,
      audience: String(form.get("audience") ?? ""),
      price: String(form.get("price") ?? ""),
      equipment: form.getAll("equipment").map(String),
    });
    if (next.location !== query.location && next.location) {
      next.area = "";
      next.region = "";
    }
    const params = directoryQueryToSearchParams(next, sort).toString();
    router.push(params ? `/browse?${params}` : "/browse");
  }

  return (
    <form
      key={JSON.stringify(query)}
      action="/browse"
      method="get"
      role="search"
      aria-label="Filter workspaces"
      onSubmit={onSubmit}
      className="rounded-xl border border-line bg-white p-4 lg:sticky lg:top-20"
    >
      {query.region ? <input type="hidden" name="region" value={query.region} /> : null}
      {query.area ? <input type="hidden" name="area" value={query.area} /> : null}
      {sort !== "recommended" ? <input type="hidden" name="sort" value={sort} /> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <LocationField
          id="filter-location"
          name="location"
          defaultValue={query.location}
          sources={sources}
          listings={listings}
        />
        <div>
          <label htmlFor="filter-category" className="text-sm font-medium text-navy">Workspace type</label>
          <select id="filter-category" name="category" defaultValue={query.category} className="field">
            <option value="">All types</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
      </div>

      <details className="group mt-4 border-t border-line pt-2" open={advancedCount > 0}>
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md text-sm font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-accent" />
          More filters
          {advancedCount > 0 ? <span className="chip bg-blue-50 text-blue-800">{advancedCount} active</span> : null}
          <ChevronDown aria-hidden="true" className="ml-auto h-4 w-4 text-slate-600 group-open:rotate-180" />
        </summary>
        <div className="mt-2 space-y-3 pb-3">
          <div>
            <label htmlFor="filter-audience" className="text-sm font-medium text-navy">Who can book</label>
            <select id="filter-audience" name="audience" className="field" defaultValue={query.audience}>
              <option value="">Anyone</option>
              <option value="consumer">Private customers</option>
              <option value="trade">Trade customers</option>
            </select>
          </div>
          <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="price" value="listed" defaultChecked={query.price === "listed"} className="h-4 w-4 accent-accent" />
            Has published price
          </label>
          <fieldset>
            <legend className="text-sm font-medium text-navy">Equipment and facilities</legend>
            {EQUIPMENT_FILTERS.map((filter) => (
              <label key={filter.id} className="flex min-h-9 cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="equipment"
                  value={filter.id}
                  defaultChecked={query.equipment.includes(filter.id)}
                  className="h-4 w-4 accent-accent"
                />
                {filter.label}
              </label>
            ))}
          </fieldset>
        </div>
      </details>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary flex-1">
          <Search aria-hidden="true" className="h-4 w-4" /> Apply filters
        </button>
        {hasActiveQuery(query) ? (
          <Link href={clearQuery ? `/browse?${clearQuery}` : "/browse"} className="section-link">Clear all</Link>
        ) : null}
      </div>
    </form>
  );
}

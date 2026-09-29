"use client";

import { directoryQueryToSearchParams, type DirectoryQuery } from "@/lib/search";
import { SORT_OPTIONS, type SortId } from "@/lib/ranking";
import { useRouter } from "next/navigation";

export function BrowseSort({ query, sort }: { query: DirectoryQuery; sort: SortId }) {
  const router = useRouter();

  return (
    <div>
      <label htmlFor="browse-sort" className="sr-only">
        Sort results
      </label>
      <select
        id="browse-sort"
        name="sort"
        value={sort}
        className="field mt-0 min-h-10 w-full min-w-44 sm:w-auto"
        onChange={(event) => {
          const next = event.target.value as SortId;
          const params = directoryQueryToSearchParams(query, next);
          const href = params.toString();
          router.push(href ? `/browse?${href}` : "/browse");
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

"use client";

import { LocationField } from "@/components/LocationField";
import type { LocationSuggestion, SuggestionAddress } from "@/lib/location-suggestions";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

interface HeroCategory {
  slug: string;
  name: string;
}

export function HeroSearch({
  categories,
  sources,
  listings,
}: {
  categories: readonly HeroCategory[];
  sources: readonly LocationSuggestion[];
  listings: readonly SuggestionAddress[];
}) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const key of ["location", "category"]) {
      const value = formData.get(key);
      if (typeof value === "string" && value.trim()) {
        params.set(key, value.trim());
      }
    }

    const query = params.toString();
    router.push(query ? `/browse?${query}` : "/browse");
  }

  return (
    <form
      action="/browse"
      method="get"
      role="search"
      onSubmit={onSubmit}
      className="card mt-8 p-4 sm:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] md:items-end">
        <LocationField id="location" name="location" sources={sources} listings={listings} />
        <div>
          <label htmlFor="category" className="text-sm font-medium text-navy">
            Workspace type
          </label>
          <select id="category" name="category" defaultValue="" className="field">
            <option value="">All types</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary h-11 gap-2 md:mt-0">
          <Search aria-hidden="true" className="h-4 w-4" />
          Find workspace
        </button>
      </div>
      <p className="mt-3 text-sm text-slate-600">Examples: Liverpool, Cardiff, L9, NP19</p>
    </form>
  );
}

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
      aria-label="Find a workspace"
      className="mt-6 rounded-xl border border-line bg-paper p-3.5 sm:p-4"
    >
      <div className="grid gap-3 min-[440px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] min-[440px]:items-end">
        <LocationField id="home-location" name="location" sources={sources} listings={listings} />
        <div>
          <label htmlFor="home-category" className="text-sm font-medium text-navy">
            Workspace type
          </label>
          <select id="home-category" name="category" defaultValue="" className="field">
            <option value="">All types</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary h-11 min-[440px]:col-span-2">
          <Search aria-hidden="true" className="h-4 w-4" />
          Search workspaces
        </button>
      </div>
    </form>
  );
}

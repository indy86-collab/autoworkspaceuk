"use client";

import { LocationField } from "@/components/LocationField";
import {
  EQUIPMENT_FILTERS,
  activeFilterCount,
  directoryQueryToSearchParams,
  type DirectoryQuery,
} from "@/lib/search";
import type { LocationSuggestion, SuggestionAddress } from "@/lib/location-suggestions";
import type { SortId } from "@/lib/ranking";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

interface FilterOption {
  value: string;
  label: string;
}

function readQuery(form: HTMLFormElement, sort: SortId): URLSearchParams {
  const formData = new FormData(form);
  const params = new URLSearchParams();

  for (const key of ["location", "category", "audience", "price", "area"] as const) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim() && value !== "any") {
      params.set(key, value.trim());
    }
  }

  for (const value of formData.getAll("equipment")) {
    if (typeof value === "string" && value.trim()) {
      params.append("equipment", value.trim());
    }
  }

  if (sort !== "recommended") {
    params.set("sort", sort);
  }

  if (params.get("location")) {
    params.delete("area");
  }

  return params;
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
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(query);

  function apply(form: HTMLFormElement) {
    const params = readQuery(form, sort);
    const next = params.toString();
    router.push(next ? `/browse?${next}` : "/browse");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    apply(event.currentTarget);
  }

  const fields = (
    <div className="space-y-5">
      {query.area ? <input type="hidden" name="area" value={query.area} /> : null}
      <LocationField
        id="filter-location"
        name="location"
        defaultValue={query.location}
        sources={sources}
        listings={listings}
        examples="Liverpool, Cardiff, L9, NP19"
        onSelect={() => {
          const form = formRef.current;
          if (form) {
            window.setTimeout(() => apply(form), 0);
          }
        }}
      />
      <div>
        <label htmlFor="filter-category" className="text-sm font-medium text-navy">
          Workspace type
        </label>
        <select
          id="filter-category"
          name="category"
          defaultValue={query.category}
          className="field"
          onChange={(event) => {
            if (event.currentTarget.form) {
              apply(event.currentTarget.form);
            }
          }}
        >
          <option value="">All types</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="text-sm font-medium text-navy">Audience</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { value: "any", label: "Any" },
            { value: "consumer", label: "Consumer" },
            { value: "trade", label: "Trade" },
          ].map((option) => (
            <label
              key={option.label}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-2 text-sm font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 ${
                (option.value === "any" ? query.audience === "" : query.audience === option.value)
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <input
                type="radio"
                name="audience"
                value={option.value}
                defaultChecked={option.value === "any" ? query.audience === "" : query.audience === option.value}
                className="sr-only"
                onChange={(event) => {
                  if (event.currentTarget.form) {
                    apply(event.currentTarget.form);
                  }
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="price"
          value="listed"
          defaultChecked={query.price === "listed"}
          className="h-4 w-4 accent-blue-600"
          onChange={(event) => {
            if (event.currentTarget.form) {
              apply(event.currentTarget.form);
            }
          }}
        />
        Has published price
      </label>
      <fieldset>
        <legend className="text-sm font-medium text-navy">Equipment and facilities</legend>
        <div className="mt-2 space-y-1">
          {EQUIPMENT_FILTERS.map((filter) => (
            <label key={filter.id} className="flex min-h-10 cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="equipment"
                value={filter.id}
                defaultChecked={query.equipment.includes(filter.id)}
                className="h-4 w-4 accent-blue-600"
                onChange={(event) => {
                  if (event.currentTarget.form) {
                    apply(event.currentTarget.form);
                  }
                }}
              />
              {filter.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary">
          Apply filters
        </button>
        <Link
          href={
            sort === "recommended"
              ? "/browse"
              : `/browse?${directoryQueryToSearchParams(emptyClearedQuery(), sort)}`
          }
          className="btn-secondary"
        >
          Clear all filters
        </Link>
      </div>
    </div>
  );

  return (
    <form ref={formRef} key={JSON.stringify(query)} action="/browse" method="get" onSubmit={onSubmit}>
      <div className="lg:hidden">
        <button
          type="button"
          className="btn-secondary w-full justify-between"
          aria-expanded={open}
          aria-controls="browse-filter-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            Filters
            {count > 0 ? <span className="chip">{count}</span> : null}
          </span>
          <span className="text-sm font-medium text-slate-600">{open ? "Hide" : "Show"}</span>
        </button>
      </div>
      <div
        id="browse-filter-panel"
        className={`card mt-3 p-4 lg:sticky lg:top-20 lg:mt-0 ${open ? "block" : "hidden"} lg:block`}
      >
        <h2 className="hidden text-base font-semibold text-navy lg:block">Filters</h2>
        <div className="lg:mt-4">{fields}</div>
      </div>
    </form>
  );
}

function emptyClearedQuery(): DirectoryQuery {
  return {
    location: "",
    category: "",
    region: "",
    area: "",
    audience: "",
    price: "",
    equipment: [],
  };
}

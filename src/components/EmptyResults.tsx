import { ListingGrid } from "@/components/ListingGrid";
import type { Listing } from "@/lib/types";
import Link from "next/link";

export function EmptyResults({ suggestions = [] }: { suggestions?: readonly Listing[] }) {
  return (
    <div className="card px-5 py-8 sm:px-8">
      <h2 className="text-lg font-semibold text-navy">No verified workspace matched your search.</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
        Try a broader location, another workspace type, or clear the filters. Review, coming soon, and on-hold records
        stay out of the public directory.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href="/browse" className="btn-secondary">
          Clear filters
        </Link>
        <Link href="/browse" className="btn-secondary">
          Browse all workspaces
        </Link>
        <Link href="/add-listing" className="btn-primary">
          Add/suggest a facility
        </Link>
      </div>
      {suggestions.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-base font-semibold text-navy">Other verified workspaces you may want to consider</h3>
          <p className="mt-1 text-sm text-slate-600">
            These are other published listings that share a region or workspace type with your search. They are not
            ranked by distance.
          </p>
          <div className="mt-4">
            <ListingGrid listings={suggestions} layout="results" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { ListingGrid } from "@/components/ListingGrid";
import type { Listing } from "@/lib/types";

export function NearbyListings({ listings }: { listings: readonly Listing[] }) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-navy">Similar workspaces</h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Other verified listings in the same region and category, then the same region, then the same category.
      </p>
      <div className="mt-5">
        <ListingGrid listings={listings} />
      </div>
    </section>
  );
}

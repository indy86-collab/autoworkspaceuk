import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

export function ListingGrid({
  listings,
  layout = "grid",
}: {
  listings: readonly Listing[];
  layout?: "grid" | "results";
}) {
  const className =
    layout === "results" ? "grid gap-3 xl:grid-cols-2" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <ul className={className}>
      {listings.map((listing) => (
        <li key={listing.id} className="h-full min-w-0">
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}

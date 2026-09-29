import { CategoryIcon } from "@/components/CategoryIcon";
import { VerificationBadge } from "@/components/VerificationBadge";
import { publicCategoryOf } from "@/lib/categories";
import { compactFeatures } from "@/lib/features";
import { audienceLabel, formatVerifiedDate } from "@/lib/format";
import { cardPriceLabel, formatPlace, orderedAudience } from "@/lib/public-listing";
import type { Listing } from "@/lib/types";
import Link from "next/link";
import listingImages from "@/data/listing-images.json";

export function ListingCard({ listing }: { listing: Listing }) {
  const category = publicCategoryOf(listing.primary_category);
  const audience = orderedAudience(listing.audience);
  const features = compactFeatures(listing.equipment, 3);
  const price = cardPriceLabel(listing.pricing);

  return (
    <article className="card flex h-full min-w-0 flex-col overflow-hidden">
      {listingImages[listing.slug as keyof typeof listingImages] ? (
        <div
          className="h-32 w-full bg-cover bg-center"
          role="img"
          aria-label={`Photo from ${listing.name}`}
          style={{ backgroundImage: `url(${listingImages[listing.slug as keyof typeof listingImages]})` }}
        />
      ) : null}
      <div className="flex min-h-0 flex-1">
      <div className="flex w-14 shrink-0 items-start justify-center bg-slate-50 pt-4 text-blue-700 sm:w-16">
        {category ? <CategoryIcon name={category.icon} className="h-6 w-6" /> : null}
        <span className="sr-only">{category?.name ?? "Automotive workspace"}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="min-w-0 text-base font-semibold leading-snug text-navy">
            <Link href={`/listing/${listing.slug}`} className="hover:text-blue-700">
              {listing.name}
            </Link>
          </h3>
          <VerificationBadge listing={listing} />
        </div>
        <p className="mt-1 text-sm text-slate-600">{formatPlace(listing)}</p>
        {category ? <p className="mt-1 text-sm font-medium text-blue-800">{category.shortName}</p> : null}
        <p className="mt-2 text-sm font-semibold text-navy">{price ?? "Contact for pricing"}</p>
        {audience.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {audience.map((item) => (
              <li key={item} className="chip">
                {audienceLabel(item)}
              </li>
            ))}
          </ul>
        ) : null}
        {features.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {features.map((item) => (
              <li key={item} className="chip bg-white ring-1 ring-slate-200">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <p className="text-xs text-slate-500">Last checked {formatVerifiedDate(listing.last_verified)}</p>
          <Link
            href={`/listing/${listing.slug}`}
            className="btn-primary min-h-10 px-3 py-2"
            aria-label={`View workspace: ${listing.name}`}
          >
            View workspace
          </Link>
        </div>
      </div>
      </div>
    </article>
  );
}

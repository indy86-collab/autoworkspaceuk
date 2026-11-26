import { CategoryIcon } from "@/components/CategoryIcon";
import { VerificationBadge } from "@/components/VerificationBadge";
import listingImages from "@/data/listing-images.json";
import { publicCategoryOf } from "@/lib/categories";
import { compactFeatures } from "@/lib/features";
import { audienceLabel, formatVerifiedDate } from "@/lib/format";
import { cardPriceLabel, formatPlace, orderedAudience } from "@/lib/public-listing";
import type { Listing } from "@/lib/types";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ListingCard({ listing, layout = "grid" }: { listing: Listing; layout?: "grid" | "results" }) {
  const category = publicCategoryOf(listing.primary_category);
  const audience = orderedAudience(listing.audience);
  const features = compactFeatures(listing.equipment, 3);
  const price = cardPriceLabel(listing.pricing);
  const imageUrl = listingImages[listing.slug as keyof typeof listingImages];
  const isResult = layout === "results";

  return (
    <article className={`card group relative flex h-full min-w-0 flex-col overflow-hidden hover:border-blue-300 ${isResult && imageUrl ? "sm:grid sm:grid-cols-[minmax(8.5rem,24%)_minmax(0,1fr)]" : ""}`}>
      {imageUrl ? (
        <div className={`relative w-full shrink-0 bg-slate-100 ${isResult ? "aspect-[2.45/1] sm:aspect-auto" : "aspect-[2.25/1]"}`}>
          <Image src={imageUrl} alt="" fill unoptimized className="object-cover" />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {category ? (
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <CategoryIcon name={category.icon} className="h-4 w-4" />
              {category.shortName}
            </p>
          ) : null}
          <VerificationBadge listing={listing} />
        </div>
        <h3 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight">
          <Link
            href={`/listing/${listing.slug}`}
            className="after:absolute after:inset-0 after:rounded-xl group-hover:text-accent focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-accent"
          >
            {listing.name}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-600">
          <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /> {formatPlace(listing)}
        </p>
        {features.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Equipment">
            {features.map((item) => <li key={item} className="chip">{item}</li>)}
          </ul>
        ) : null}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-bold text-navy">{price ?? "Contact for pricing"}</p>
              <p className="mt-0.5 text-xs text-slate-600">{audience.map(audienceLabel).join(" · ")} · Checked {formatVerifiedDate(listing.last_verified)}</p>
            </div>
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-accent group-hover:bg-accent group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EquipmentList } from "@/components/EquipmentList";
import { JsonLd } from "@/components/JsonLd";
import { NearbyListings } from "@/components/NearbyListings";
import { PriceDisplay } from "@/components/PriceDisplay";
import { VerificationBadge } from "@/components/VerificationBadge";
import { publicAddress } from "@/lib/address";
import { publicCategoryOf } from "@/lib/categories";
import { audienceLabel, formatVerifiedDate, priceRows } from "@/lib/format";
import { breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/json-ld";
import { getGuideForListing } from "@/lib/guides";
import { getNearbyAlternatives } from "@/lib/listings";
import {
  formatPlace,
  orderedAudience,
  primaryCategoryName,
  publicOverview,
  startingPriceLabel,
  telHref,
  VERIFIED_LISTING_HELP,
  verificationNote,
} from "@/lib/public-listing";
import type { Listing } from "@/lib/types";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import listingImages from "@/data/listing-images.json";

export function ListingDetail({ listing }: { listing: Listing }) {
  const category = publicCategoryOf(listing.primary_category);
  const nearby = getNearbyAlternatives(listing, 3);
  const guide = getGuideForListing(listing);
  const checked = formatVerifiedDate(listing.last_verified);
  const business = localBusinessJsonLd(listing);
  const overview = publicOverview(listing);
  const audience = orderedAudience(listing.audience);
  const address = publicAddress(listing);
  const categoryLabel = primaryCategoryName(listing);
  const mobileActions = listing.website || listing.phone;
  const imageUrl = listingImages[listing.slug as keyof typeof listingImages] ?? "/images/ramp-bay.png";
  const isIllustrativeImage = !listingImages[listing.slug as keyof typeof listingImages];
  const breadcrumbs = [
    { name: "Home", path: "/" },
    {
      name: category?.name ?? "Categories",
      path: category ? `/category/${category.slug}` : "/categories",
    },
    { name: listing.name, path: `/listing/${listing.slug}` },
  ];

  return (
    <article className={`site-wrap py-8 ${mobileActions ? "pb-28 lg:pb-8" : ""}`}>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      {business ? <JsonLd data={business} /> : null}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category?.name ?? "Categories", href: category ? `/category/${category.slug}` : "/categories" },
          { label: listing.name },
        ]}
      />

      <section className="mt-6 overflow-hidden rounded-2xl bg-ink text-white shadow-xl">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-64 overflow-hidden lg:min-h-80">
            <div className="absolute inset-0 bg-cover bg-center" role="img" aria-label={`Workspace image for ${listing.name}`} style={{ backgroundImage: `url(${imageUrl})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-5 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">{isIllustrativeImage ? "Illustrative workspace image" : "Image from facility website"}</span>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2"><VerificationBadge listing={listing} />{audience.map((item) => <span key={item} className="chip bg-white/10 text-white ring-1 ring-white/20">{audienceLabel(item)}</span>)}</div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{listing.name}</h1>
            <p className="mt-4 flex items-start gap-2 text-white/75"><MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#f7a46f]" /><span>{formatPlace(listing)}</span></p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#f7a46f]">{categoryLabel}</p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <div className="min-w-0">
          <div className="mt-10 space-y-10">
            <section>
              <h2 className="text-xl font-semibold text-navy">Overview</h2>
              <p className="mt-3 leading-7 break-words text-slate-700">{overview}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy">Pricing</h2>
              <div className="mt-3">
                <PriceDisplay pricing={listing.pricing} detailed />
              </div>
            </section>

            {listing.equipment.length > 0 ? (
              <section>
                <h2 className="text-xl font-semibold text-navy">Equipment &amp; facilities</h2>
                <div className="mt-3">
                  <EquipmentList equipment={listing.equipment} />
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="text-xl font-semibold text-navy">Who can use it</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {audience.map((item) => (
                  <li key={item} className="chip bg-blue-50 text-blue-800">
                    {audienceLabel(item)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {audience.length === 1 && audience[0] === "trade"
                  ? "Recorded as trade. A private customer should confirm they can book before travelling."
                  : audience.length === 1
                    ? "Recorded as open to consumer use."
                    : "Recorded as open to consumer and trade customers."}
              </p>
              {listing.restrictions && listing.restrictions.length > 0 ? (
                <>
                  <h3 className="mt-4 text-sm font-semibold text-navy">Recorded restrictions</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                    {listing.restrictions.map((restriction) => (
                      <li key={restriction}>{restriction}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>

            <section>
              <h2 className="text-xl font-semibold text-navy">{address.heading}</h2>
              <address className="mt-3 not-italic leading-7 break-words text-slate-700">
                {address.lines.map((line, index) => (
                  <span key={`${line}-${index}`} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-3 text-sm text-slate-600">
                Only the address details on record are shown. Confirm the premises with the facility before travelling.
              </p>
            </section>

            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-semibold text-navy">Verified by AutoWorkspace UK</h2>
              <p className="mt-3 font-medium text-navy">Last checked {checked}</p>
              <p className="mt-3 leading-7 text-slate-700">{VERIFIED_LISTING_HELP}</p>
              {listing.verification_level === "conflicting" ? (
                <p className="mt-3 leading-7 text-slate-700">{verificationNote(listing.verification_level)}</p>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-700">{verificationNote(listing.verification_level)}</p>
              )}
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This is a check of published evidence. It is not a physical inspection, an endorsement, a certification,
                or a guarantee.
              </p>
              <p className="mt-4">
                <Link href="/methodology" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                  How verification works
                </Link>
              </p>
            </section>
          </div>

          {guide ? (
            <section className="mt-10 rounded-lg border border-slate-200 p-5">
              <h2 className="text-xl font-semibold text-navy">Related guide</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <Link href={`/guides/${guide.slug}`} className="font-semibold text-blue-700 hover:text-blue-800">
                  {guide.title}
                </Link>
              </p>
            </section>
          ) : null}
        </div>

        <ListingContactPanel listing={listing} checked={checked} />
      </div>

      <NearbyListings listings={nearby} />
      {mobileActions ? <ListingMobileActions listing={listing} /> : null}
    </article>
  );
}

function ListingContactPanel({ listing, checked }: { listing: Listing; checked: string }) {
  const rows = priceRows(listing.pricing);
  const price = startingPriceLabel(listing.pricing);
  const place = publicAddress(listing).compact;

  return (
    <aside className="card p-5 lg:sticky lg:top-20">
      <h2 className="text-base font-semibold text-navy">Hire details</h2>
      {rows.length > 1 ? (
        <dl className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-slate-600">{row.label}</dt>
              <dd className="text-sm font-semibold text-navy">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 text-lg font-semibold text-navy">{price ?? "Contact for pricing"}</p>
      )}
      <div className="mt-5 space-y-3">
        {listing.website ? (
          <a
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full min-h-12"
          >
            Visit website
          </a>
        ) : null}
        {listing.phone ? (
          <a href={telHref(listing.phone)} className="btn-secondary w-full min-h-12">
            <Phone aria-hidden="true" className="h-4 w-4" />
            {listing.phone}
          </a>
        ) : null}
        {listing.email ? (
          <a href={`mailto:${listing.email}`} className="btn-secondary w-full min-h-12">
            <Mail aria-hidden="true" className="h-4 w-4" />
            <span className="truncate">{listing.email}</span>
          </a>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-slate-600">{place}</p>
      <p className="mt-1 text-xs text-slate-500">Last verified {checked}</p>
      <p className="mt-4">
        <Link href={`/report?listing=${listing.slug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          Report incorrect information
        </Link>
      </p>
      <div className="mt-5 border-t border-slate-200 pt-4">
        <p className="text-sm font-semibold text-navy">Own this business?</p>
        <p className="mt-1">
          <Link
            href={`/claim-listing?listing=${listing.slug}`}
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            Claim or update this listing
          </Link>
        </p>
      </div>
    </aside>
  );
}

function ListingMobileActions({ listing }: { listing: Listing }) {
  const actions = [
    listing.website
      ? {
          href: listing.website,
          label: "Website",
          external: true,
          primary: true,
        }
      : null,
    listing.phone
      ? {
          href: telHref(listing.phone),
          label: "Call",
          external: false,
          primary: !listing.website,
        }
      : null,
  ].filter((item): item is { href: string; label: string; external: boolean; primary: boolean } => item !== null);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
      <div className={`site-wrap grid gap-2 ${actions.length > 1 ? "grid-cols-2" : "grid-cols-1"} px-0`}>
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={action.primary ? "btn-primary min-h-12" : "btn-secondary min-h-12"}
            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}

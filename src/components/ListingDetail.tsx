import { CategoryIcon } from "@/components/CategoryIcon";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EquipmentList } from "@/components/EquipmentList";
import { JsonLd } from "@/components/JsonLd";
import { NearbyListings } from "@/components/NearbyListings";
import { PriceDisplay } from "@/components/PriceDisplay";
import { VerificationBadge } from "@/components/VerificationBadge";
import { listingEditorial } from "@/content/listing-editorial";
import { publicAddress } from "@/lib/address";
import { publicCategoryOf } from "@/lib/categories";
import { audienceLabel, formatVerifiedDate } from "@/lib/format";
import { breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/json-ld";
import { getGuideForListing } from "@/lib/guides";
import { getNearbyAlternatives } from "@/lib/listings";
import {
  cardPriceLabel,
  formatPlace,
  orderedAudience,
  primaryCategoryName,
  publicOverview,
  telHref,
  VERIFIED_LISTING_HELP,
  verificationNote,
} from "@/lib/public-listing";
import type { Listing } from "@/lib/types";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import listingImages from "@/data/listing-images.json";

export function ListingDetail({ listing }: { listing: Listing }) {
  const category = publicCategoryOf(listing.primary_category);
  const nearby = getNearbyAlternatives(listing, 3);
  const guide = getGuideForListing(listing);
  const checked = formatVerifiedDate(listing.last_verified);
  const business = localBusinessJsonLd(listing);
  const overview = publicOverview(listing);
  const bookingQuestion = listingEditorial[listing.slug]?.bookingQuestion;
  const audience = orderedAudience(listing.audience);
  const address = publicAddress(listing);
  const categoryLabel = primaryCategoryName(listing);
  const mobileActions = listing.website || listing.phone || listing.email;
  const imageUrl = listingImages[listing.slug as keyof typeof listingImages];
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

      <header className={`mt-5 overflow-hidden rounded-2xl border border-line bg-white ${imageUrl ? "grid md:grid-cols-[minmax(0,1fr)_minmax(0,38%)]" : ""}`}>
        <div className="p-5 sm:p-8">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-accent">
            {category ? <CategoryIcon name={category.icon} className="h-5 w-5" /> : null}
            {categoryLabel}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] tracking-[-.05em] sm:text-5xl">{listing.name}</h1>
          <p className="mt-3 flex items-start gap-2 text-slate-600">
            <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            {formatPlace(listing)}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <VerificationBadge listing={listing} />
            <span className="text-sm text-slate-600">Checked <time dateTime={listing.last_verified}>{checked}</time></span>
          </div>
        </div>
        {imageUrl ? (
          <figure className="relative min-h-40 border-t border-line bg-slate-100 md:min-h-52 md:border-t-0 md:border-l">
            <Image src={imageUrl} alt="" fill unoptimized className="object-cover" />
            <figcaption className="absolute right-3 bottom-3 rounded-md bg-ink/85 px-2.5 py-1.5 text-xs text-white">
              Image from facility website
            </figcaption>
          </figure>
        ) : null}
      </header>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-7">
        <ListingContactPanel listing={listing} />
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <div className="space-y-7 rounded-2xl border border-line bg-white p-5 sm:p-8">
            <section>
              <h2 className="text-xl font-semibold text-navy">What you can hire</h2>
              <p className="mt-3 leading-7 break-words text-slate-700">{overview}</p>
              {bookingQuestion ? (
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <h3 className="font-semibold text-navy">Ask before booking</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{bookingQuestion}</p>
                </div>
              ) : null}
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

            <section className="rounded-xl border border-line bg-paper p-5">
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
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-blue-700">
                <Link href={`/report?listing=${listing.slug}`} className="hover:underline">Report incorrect information</Link>
                <Link href={`/claim-listing?listing=${listing.slug}`} className="hover:underline">Claim or update this listing</Link>
              </div>
            </section>
          </div>

          {guide ? (
            <section className="mt-5 rounded-xl border border-line bg-white p-5">
              <h2 className="text-xl font-semibold text-navy">Related guide</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <Link href={`/guides/${guide.slug}`} className="font-semibold text-blue-700 hover:text-blue-800">
                  {guide.title}
                </Link>
              </p>
            </section>
          ) : null}
        </div>

      </div>

      <NearbyListings listings={nearby} />
      {mobileActions ? <ListingMobileActions listing={listing} /> : null}
    </article>
  );
}

function ListingContactPanel({ listing }: { listing: Listing }) {
  const price = cardPriceLabel(listing.pricing);

  return (
    <aside className="rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-20 lg:col-start-2 lg:row-start-1">
      <h2 className="text-base font-bold">Contact the operator</h2>
      <p className="mt-2 text-lg font-bold text-navy">{price ?? "Contact for pricing"}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">Confirm availability and book directly with the facility.</p>
      <div className="mt-4 space-y-2.5">
        {listing.website ? (
          <a
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            Visit operator website <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        ) : null}
        {listing.phone ? (
          <a href={telHref(listing.phone)} className={`${listing.website ? "btn-secondary" : "btn-primary"} w-full`}>
            <Phone aria-hidden="true" className="h-4 w-4" />
            {listing.phone}
          </a>
        ) : null}
        {listing.email ? (
          <a href={`mailto:${listing.email}`} className={`${listing.website || listing.phone ? "btn-secondary" : "btn-primary"} w-full`}>
            <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="truncate">{listing.email}</span>
          </a>
        ) : null}
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
    listing.email && !listing.website && !listing.phone
      ? { href: `mailto:${listing.email}`, label: "Email", external: false, primary: true }
      : null,
  ].filter((item): item is { href: string; label: string; external: boolean; primary: boolean } => item !== null);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <div className={`site-wrap grid gap-2 ${actions.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
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

import { CategoryIcon } from "@/components/CategoryIcon";
import { GuideCardLink } from "@/components/content/GuideArticle";
import { JsonLd } from "@/components/JsonLd";
import { ListingGrid } from "@/components/ListingGrid";
import { HeroSearch } from "@/components/HeroSearch";
import { getWorkspaceReport } from "@/lib/dataset-insights";
import { websiteJsonLd } from "@/lib/json-ld";
import { getHomeGuides } from "@/lib/guides";
import {
  getFeaturedListings,
  getHomepageCategories,
  getListingsByCategory,
  getLiveListings,
  getLocationSuggestionSources,
  getPopulatedDiscoveryAreas,
} from "@/lib/listings";
import { buildMetadata } from "@/lib/seo";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const homeTitle = "DIY Garages, Ramp Hire & Car Lifts Near You | AutoWorkspace UK";

export const metadata: Metadata = {
  ...buildMetadata({
    title: homeTitle,
    description: "Find verified DIY garages, rent-a-ramp bays, car lift hire, workshop space and spray booths across the UK. Compare prices, equipment and who can book.",
    path: "/",
    index: true,
  }),
  title: { absolute: homeTitle },
};

export default function HomePage() {
  const categories = getHomepageCategories();
  const categoryCounts = categories.map((category) => ({ category, count: getListingsByCategory(category.slug).length }));
  const featured = getFeaturedListings(6);
  const guides = getHomeGuides();
  const report = getWorkspaceReport();
  const areas = getPopulatedDiscoveryAreas();
  const locations = getLocationSuggestionSources();
  const addresses = getLiveListings().map((listing) => listing.address);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <section className="border-b border-line bg-white">
        <div className="site-wrap grid items-center gap-8 py-9 sm:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:py-14">
          <div>
            <h1 className="max-w-xl font-display text-[clamp(2.6rem,5vw,4.6rem)] font-bold leading-[1.02] tracking-[-.06em]">
              DIY garages and <span className="text-accent">ramp hire</span> across the UK
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600 sm:text-lg">
              Find a place to work on your vehicle. Compare hire prices, equipment and who can book.
            </p>
            <HeroSearch categories={categories} sources={locations} listings={addresses} />
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck aria-hidden="true" className="h-4 w-4 text-accent" />
                {report.liveCount} checked workspaces across {report.regionCount} regions
              </span>
              <Link href="/methodology" className="font-semibold text-blue-700 hover:underline">How we check</Link>
            </div>
          </div>
          <figure className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-slate-200 lg:aspect-[5/4]">
            <Image
              src="/images/workshop-hero-v2.webp"
              alt=""
              fill
              preload
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, calc(100vw - 2rem)"
              className="object-cover object-center"
            />
            <figcaption className="absolute bottom-3 right-3 rounded-md bg-ink/85 px-2.5 py-1.5 text-xs text-white">
              Illustrative workshop image
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="site-wrap page-section" aria-labelledby="workspace-types">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="workspace-types" className="section-title">Browse by workspace type</h2>
          <Link href="/categories" className="section-link">All categories <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categoryCounts.map(({ category, count }) => (
            <li key={category.slug}>
              <Link href={`/category/${category.slug}`} className="card group flex h-full flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:p-4">
                <span className="category-tile-icon"><CategoryIcon name={category.icon} className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-snug text-ink group-hover:text-accent sm:text-base">{category.shortName}</span>
                  <span className="mt-0.5 block text-sm text-slate-600">{count} {count === 1 ? "workspace" : "workspaces"}</span>
                </span>
                <ArrowRight aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-slate-400 group-hover:text-accent sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-white">
        <div className="site-wrap page-section">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="section-title">Featured workspaces</h2>
            <Link href="/browse" className="section-link">Browse all workspaces <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
          <div className="mt-5"><ListingGrid listings={featured} /></div>
        </div>
      </section>

      {areas.length > 0 ? (
        <section className="site-wrap page-section">
          <h2 className="section-title">Browse by region</h2>
          <ul className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {areas.map(({ area, listings }) => (
              <li key={area.id}>
                <Link href={`/browse?area=${area.id}`} className="card group flex h-full items-center gap-2.5 px-3 py-3.5 sm:px-4">
                  <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                  <span className="flex-1 text-sm font-semibold group-hover:text-accent">{area.name}</span>
                  <span className="text-xs text-slate-600" aria-label={`${listings.length} workspaces`}>{listings.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="site-wrap pt-2 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="section-title">Before you book</h2>
          <Link href="/guides" className="section-link">All guides <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
        <ul className="mt-5 grid gap-4 lg:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.slug}><GuideCardLink guide={guide} /></li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4">
          <div>
            <h3 className="font-bold">UK automotive workspace report</h3>
            {report.latestVerified ? (
              <p className="mt-1 text-sm text-slate-600">
                Most recent listing check <time dateTime={report.latestVerified}>{report.latestVerifiedLabel}</time>
              </p>
            ) : null}
          </div>
          <Link href="/insights/uk-automotive-workspace-report" className="section-link">Read the report <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}

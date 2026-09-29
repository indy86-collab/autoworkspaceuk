import { CategoryIcon } from "@/components/CategoryIcon";
import { DatasetStatList } from "@/components/content/DatasetStatList";
import { GuideCardLink } from "@/components/content/GuideArticle";
import { MethodologyNote } from "@/components/content/MethodologyNote";
import { JsonLd } from "@/components/JsonLd";
import { ListingGrid } from "@/components/ListingGrid";
import { HomeJobFinder } from "@/components/HomeJobFinder";
import { websiteJsonLd } from "@/lib/json-ld";
import { getHomeGuides } from "@/lib/guides";
import {
  getFeaturedListings,
  getHomepageCategories,
  getListingsByCategory,
  getLiveListings,
  getPopulatedCategories,
  getPopulatedDiscoveryAreas,
  publishedCountLabel,
} from "@/lib/listings";
import { buildMetadata } from "@/lib/seo";
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

const whyPoints = [
  {
    title: "Listings are manually researched",
    text: "Each published facility is checked against current evidence that someone outside the business can hire the space or the equipment.",
  },
  {
    title: "Repair garages are not added automatically",
    text: "A garage that only repairs customer cars is a different business. Owning a ramp is not enough to be listed.",
  },
  {
    title: "Verification dates are shown",
    text: "Every live listing shows when the evidence was last checked, so you can judge how fresh the record is.",
  },
  {
    title: "Several kinds of workspace",
    text: "Ramp hire, DIY bays, workshops, spray booths, detailing bays, and commercial vehicle space are filed separately.",
  },
];

export default function HomePage() {
  const categories = getHomepageCategories();
  const featured = getFeaturedListings(6);
  const guides = getHomeGuides();
  const live = getLiveListings();
  const areas = getPopulatedDiscoveryAreas();

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-65"><Image src="/images/home-workbench.png" alt="" fill priority sizes="100vw" className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
        <div className="site-wrap relative flex min-h-[540px] items-end py-20 sm:min-h-[620px] lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow text-[#f7a46f]">A better place to work on your vehicle</p>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-[.93] tracking-[-.05em] sm:text-8xl">Your car.<br /><span className="text-[#f7a46f]">Your rules.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/75">Find a DIY garage, rent-a-ramp bay, car lift or workshop near you. 31 real UK workspaces, checked and ready to explore.</p>
          </div>
        </div>
      </section>

      <HomeJobFinder categories={getPopulatedCategories()} />

      <section className="site-wrap -mt-2 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dedbd4] bg-white/50 px-5 py-4 text-sm text-ink/65">
          <span><strong className="text-ink">{live.length}</strong> verified workspaces across <strong className="text-ink">23</strong> regions</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#4f9b73]" /> Last checked this week</span>
        </div>
      </section>

      <section className="site-wrap page-section">
        <div className="flex items-end justify-between gap-4">
          <div><p className="eyebrow text-accent">Start with the job</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">What are you looking for?</h2></div>
          <Link href="/categories" className="shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-800">
            All categories
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="card flex h-full items-start gap-4 p-5 hover:border-accent"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f6dfd1] text-accent">
                  <CategoryIcon name={category.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display font-bold text-ink">{category.name}</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {publishedCountLabel(getListingsByCategory(category.slug))}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {areas.length > 0 ? (
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="site-wrap page-section">
            <h2 className="font-display text-3xl font-bold text-ink">Find DIY garages and ramp hire around the UK</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              These links filter the live directory. They are not separate town pages.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map(({ area, listings }) => (
                <li key={area.id}>
                  <Link
                    href={`/browse?area=${area.id}`}
                    className="card flex items-center justify-between gap-3 px-4 py-4 hover:border-blue-200"
                  >
                    <span className="font-semibold text-navy">{area.name}</span>
                    <span className="text-sm text-slate-600">{publishedCountLabel(listings)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="site-wrap page-section">
        <h2 className="text-2xl font-semibold text-navy">Featured listings</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Verified locations chosen from different regions and workspace types.
        </p>
        <div className="mt-6">
          <ListingGrid listings={featured} />
        </div>
      </section>

      <section className="site-wrap pb-12">
        <h2 className="text-2xl font-semibold text-navy">Why AutoWorkspace UK?</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {whyPoints.map((point) => (
            <li key={point.title} className="card px-4 py-4">
              <h3 className="font-semibold text-navy">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{point.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/methodology" className="font-semibold text-blue-700 hover:text-blue-800">
            How listings are verified
          </Link>
        </p>
      </section>

      <section className="site-wrap pb-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-navy">Guides for working on your vehicle</h2>
          <Link href="/guides" className="shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-800">
            All guides
          </Link>
        </div>
        <ul className="mt-5 grid gap-4 lg:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <GuideCardLink guide={guide} />
            </li>
          ))}
        </ul>
      </section>

      <section className="site-wrap pb-12">
        <h2 className="text-2xl font-semibold text-navy">UK automotive workspace insights</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Counts from the facilities currently published in the directory.
        </p>
        <div className="mt-5">
          <DatasetStatList ids={["verifiedFacilities", "regions", "publishedPrices", "hourlyPrices"]} />
        </div>
        <div className="mt-4 max-w-3xl">
          <MethodologyNote />
        </div>
        <p className="mt-4">
          <Link
            href="/insights/uk-automotive-workspace-report"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Read the UK workspace report
          </Link>
        </p>
      </section>
    </>
  );
}

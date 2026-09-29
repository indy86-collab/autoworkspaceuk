import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "How AutoWorkspace UK Verifies Listings",
  description:
    "What qualifies for AutoWorkspace UK, which sources are used, why ordinary garages are excluded, and how unpublished records are kept off the directory.",
  path: "/methodology",
  index: true,
});

export default function MethodologyPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Methodology", path: "/methodology" },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Methodology" }]} />
      <article className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">How AutoWorkspace UK Verifies Listings</h1>
        <div className="mt-6 space-y-4 leading-7 text-slate-700">
          <p>
            {siteConfig.name} publishes a facility only where there is current evidence that someone outside the business can hire or use the space or equipment. The check is of published information. We do not physically inspect facilities, and a listing is not a statement that we have visited the premises or tested the lift.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-navy">What qualifies</h2>
          <p className="mt-4 leading-7 text-slate-700">
            A facility qualifies when current evidence shows that external customers or businesses can hire or use:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700">
            <li>automotive workspace</li>
            <li>a vehicle ramp or lift</li>
            <li>a workshop bay</li>
            <li>a spray booth</li>
            <li>a detailing bay</li>
            <li>specialist automotive workspace, such as a motorcycle bay or commercial vehicle space</li>
          </ul>
          <p className="mt-4 leading-7 text-slate-700">
            The public categories follow those kinds of hire. A listing can appear in more than one category when the record supports each one. Counts on the{" "}
            <Link href="/insights/uk-automotive-workspace-report" className="font-semibold text-blue-700 hover:text-blue-800">
              workspace report
            </Link>{" "}
            therefore add up to more than the number of facilities.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-navy">What does not qualify</h2>
          <div className="mt-4 space-y-4 leading-7 text-slate-700">
            <p>
              Ordinary repair garages are not added because they own a ramp. If the business only takes cars in and repairs them, it is a repair garage. The customer is not hiring the bay.
            </p>
            <p>
              An MOT booking, a service booked with a technician, a parts shop, a general tool-hire shop, and a storage unit that does not allow automotive work are outside the directory. A domestic garage tenancy that forbids repairs is not workspace hire. A town having garages is not, by itself, a reason to publish a page.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-navy">Evidence we use</h2>
          <p className="mt-4 leading-7 text-slate-700">A listing needs current evidence from at least one of these:</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700">
            <li>the facility&apos;s own website</li>
            <li>a booking page</li>
            <li>an official business profile</li>
            <li>another current published source</li>
            <li>a current marketplace listing</li>
          </ul>
          <p className="mt-4 leading-7 text-slate-700">
            The listing page says, in plain language, whether the check used information published by the facility or another current source. Research notes and the address of a background source are not printed on the public page. Where the sources do not agree, the listing says the price and contact details should be treated as unresolved.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-navy">Last-checked dates</h2>
          <div className="mt-4 space-y-4 leading-7 text-slate-700">
            <p>
              Every published listing shows the date the evidence was last checked. That date is the freshness of the record. It is not an opening-hours feed, and it is not a promise that the price is still current when you call.
            </p>
            <p>
              Prices, tools, and access rules change. A starting price is shown only when one was recorded. VAT is marked as excluded only when the source said the rate excluded VAT. If VAT is not mentioned, the listing does not claim the price includes it.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-navy">Records that stay unpublished</h2>
          <div className="mt-4 space-y-4 leading-7 text-slate-700">
            <p>
              Some records stay in the project file and off the public directory: facilities still being checked, facilities marked coming soon, and facilities placed on hold. They do not appear in browse, in category counts, in the workspace report, or in the sitemap.
            </p>
            <p>
              A facility that has closed, or that no longer hires space to external users, is not left up as an available listing. There is no public archive of removed businesses. If a live page is wrong, use{" "}
              <Link href="/report" className="font-semibold text-blue-700 hover:text-blue-800">
                Report incorrect information
              </Link>
              . That form does not currently send or store a report. It is the place a correction is meant to be flagged from the listing.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-navy">What the report is</h2>
          <p className="mt-4 leading-7 text-slate-700">
            The{" "}
            <Link href="/insights/uk-automotive-workspace-report" className="font-semibold text-blue-700 hover:text-blue-800">
              UK automotive workspace report
            </Link>{" "}
            counts the published dataset: facilities, region labels, categories, audience, prices, tool mentions, and lift mentions. This is a directory dataset, not a complete census of every automotive workspace in the UK. A short account of the same approach is on the{" "}
            <Link href="/about" className="font-semibold text-blue-700 hover:text-blue-800">
              about page
            </Link>
            .
          </p>
        </section>
      </article>
    </div>
  );
}

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Terms",
  description:
    "AutoWorkspace UK is an information directory. It does not take bookings, set prices, or certify the work you do in a hired bay.",
  path: "/terms",
  index: true,
});

export default function TermsPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Terms", path: "/terms" },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <article className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">Terms</h1>
        <div className="mt-6 space-y-4 leading-7 text-slate-700">
          <p>
            {siteConfig.name} publishes information about facilities where external customers may be able to hire automotive workspace or equipment. The pages are a directory and a set of guides. They are not a booking service, a repair business, or a quote.
          </p>
          <p>
            Confirm the price, the equipment, the vehicle limits, and whether you can book with the facility before you travel. A starting price can change after the date on the listing. A missing price means the rate was not recorded. It does not mean the bay is free.
          </p>
          <p>
            Guides explain how to choose a hire. They do not teach you to operate a lift, and they are not mechanical instructions. You are responsible for the work you do, for following the facility&apos;s rules, and for leaving the vehicle in a safe state. The facility is responsible for its premises and for the terms it sets.
          </p>
          <p>
            We can correct or remove a listing when the record is wrong, out of date, or no longer a hire. How listings are checked is described in the{" "}
            <Link href="/methodology" className="font-semibold text-blue-700 hover:text-blue-800">
              methodology
            </Link>
            . Flag a problem from{" "}
            <Link href="/report" className="font-semibold text-blue-700 hover:text-blue-800">
              Report incorrect information
            </Link>
            . Reports and listing suggestions are reviewed manually before anything is published.
          </p>
          <p>
            To the extent the law allows, {siteConfig.name} is not responsible for a booking you make, a repair you carry out, or an injury at a listed facility. Nothing on the site creates a contract between you and a listed business.
          </p>
        </div>
      </article>
    </div>
  );
}

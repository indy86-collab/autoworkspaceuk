import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "AutoWorkspace UK lists facilities where external customers can hire automotive workspace or equipment, and shows when each listing was last checked.",
  path: "/about",
  index: true,
});

export default function AboutPage() {
  return (
    <div className="site-wrap py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">About {siteConfig.name}</h1>
      <div className="mt-6 max-w-3xl space-y-4 leading-7 text-slate-700">
        <p>
          {siteConfig.name} helps people find UK facilities where they can hire automotive workspace. That includes rent-a-ramp bays, DIY and self-service garages, vehicle lifts, garage bays, workshops, spray booths, detailing bays, motorcycle space, and workspace for vans and light commercial vehicles.
        </p>
        <p>{siteConfig.tagline} The directory is for hiring space and equipment, not for booking a garage to repair the vehicle for you.</p>
        <p>
          Listings are read from a local data file in this project. There is no database and no account system in this version. A record appears in browse and on its own page only when its publishing status is live.
        </p>
      </div>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl font-semibold text-navy">How we verify listings</h2>
        <div className="mt-4 space-y-4 leading-7 text-slate-700">
          <p>We do not automatically list ordinary garages. A repair business that only works on customer cars is not, by itself, a workspace for hire.</p>
          <p>A business must have evidence showing external users can hire or access:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>automotive workspace</li>
            <li>a ramp or lift</li>
            <li>a workshop bay</li>
            <li>a spray booth</li>
            <li>specialist automotive working space</li>
          </ul>
          <p>
            AutoWorkspace UK only publishes facilities where we found current evidence that external customers can hire or use automotive workspace or equipment.
          </p>
          <p>
            Every published listing carries a last verified date. That is the date the evidence was last checked, and it is shown on the listing so you can judge how current the record is. The check uses published information. It is not a statement that AutoWorkspace UK has visited or physically inspected the premises. If the details look wrong, use Report incorrect information on the listing page. The{" "}
            <Link href="/methodology" className="font-semibold text-blue-700 hover:text-blue-800">
              methodology
            </Link>{" "}
            explains what qualifies and what stays unpublished.
          </p>
          <p>
            Records still in review, marked coming soon, or placed on hold stay in the data file and do not appear as available locations.
          </p>
        </div>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl font-semibold text-navy">What a listing page includes</h2>
        <p className="mt-4 leading-7 text-slate-700">
          Each page is built from the fields recorded for that facility: where it is, who it is aimed at, any prices that were actually found, the equipment list, and how to contact the site when those details exist. Prices are not estimated. If a rate was not recorded, the page says to contact the facility.
        </p>
        <p className="mt-4">
          <Link href="/browse" className="font-semibold text-blue-700 hover:text-blue-800">
            Browse published locations
          </Link>
        </p>
      </section>
    </div>
  );
}

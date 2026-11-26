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
        <p>
          We publish the directory and its guides. Each facility handles its own enquiries, bookings and payments.
        </p>
      </div>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl font-semibold text-navy">How to find a workspace</h2>
        <div className="mt-4 space-y-4 leading-7 text-slate-700">
          <p>
            Search by town or postcode, then narrow the results by workspace, equipment or who can hire it. If you are
            choosing between a floor bay and a lift, open both listings and compare what comes with the booking,
            the time you get and any restrictions on the work you plan to do.
          </p>
          <p>
            <Link href="/browse" className="font-semibold text-blue-700 hover:text-blue-800">
              Browse workspaces
            </Link>
          </p>
        </div>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl font-semibold text-navy">Where the details come from</h2>
        <p className="mt-4 leading-7 text-slate-700">
          We check published information for evidence that outside customers can hire the space. Each listing shows
          when we last checked it and gives a question to ask about that facility where we have one. Use the contact
          details on the listing to confirm availability and price with the operator.
        </p>
        <p className="mt-4 leading-7 text-slate-700">
          If a price, address or hire rule has changed, flag it using the correction link on the listing. Our{" "}
          <Link href="/methodology" className="font-semibold text-blue-700 hover:text-blue-800">
            verification methodology
          </Link>{" "}
          explains the sources we use.
        </p>
      </section>
    </div>
  );
}

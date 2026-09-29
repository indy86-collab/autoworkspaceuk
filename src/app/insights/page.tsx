import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { DatasetStatList } from "@/components/content/DatasetStatList";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Insights",
  description:
    "Research from the AutoWorkspace UK directory, starting with the UK automotive workspace and DIY garage report.",
  path: "/insights",
  index: true,
});

export default function InsightsPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">Insights</h1>
      <p className="mt-4 max-w-3xl leading-7 text-slate-700">
        Research drawn from the facilities published in this directory. The figures describe that dataset. They are not
        a census of UK automotive workspace.
      </p>
      <article className="card mt-8 max-w-3xl p-5 sm:p-6">
        <p className="text-sm font-semibold text-blue-800">Report</p>
        <h2 className="mt-2 text-2xl font-semibold text-navy">
          <Link href="/insights/uk-automotive-workspace-report" className="hover:text-blue-700">
            UK Automotive Workspace & DIY Garage Report
          </Link>
        </h2>
        <p className="mt-3 leading-7 text-slate-700">
          How many facilities are published, which workspace types they cover, who they are aimed at, and how many
          state a price or mention a lift.
        </p>
        <div className="mt-5">
          <DatasetStatList ids={["verifiedFacilities", "regions", "publishedPrices"]} />
        </div>
        <p className="mt-5">
          <Link
            href="/insights/uk-automotive-workspace-report"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Read the report
          </Link>
        </p>
      </article>
    </div>
  );
}

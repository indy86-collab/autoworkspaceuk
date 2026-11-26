import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WorkspaceReport } from "@/components/content/WorkspaceReport";
import { JsonLd } from "@/components/JsonLd";
import { getWorkspaceReport } from "@/lib/dataset-insights";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

const title = "UK Automotive Workspace & DIY Garage Report";
const description =
  "Figures from the published AutoWorkspace UK dataset: facilities, regions, workspace types, prices, tools and lift mentions, with the method behind them.";
const path = "/insights/uk-automotive-workspace-report";

export function generateMetadata(): Metadata {
  const report = getWorkspaceReport();
  const metadata = buildMetadata({
    title,
    description,
    path,
    index: true,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: `${report.latestVerified}T00:00:00.000Z`,
      modifiedTime: `${report.latestVerified}T00:00:00.000Z`,
    },
  };
}

export default function WorkspaceReportPage() {
  const report = getWorkspaceReport();
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: "UK workspace report", path },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={articleJsonLd({
          headline: title,
          description,
          path,
          published: report.latestVerified,
          updated: report.latestVerified,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: "UK workspace report" },
        ]}
      />
      <div className="mt-6">
        <WorkspaceReport />
      </div>
    </div>
  );
}

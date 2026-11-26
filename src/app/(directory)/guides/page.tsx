import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideCardLink } from "@/components/content/GuideArticle";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getPublishedGuides } from "@/lib/guides";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Guides",
  description:
    "Practical UK guides on rent-a-ramp bays, DIY garages, lift choice, recorded ramp prices, and workshop hire for trade users.",
  path: "/guides",
  index: true,
});

export default function GuidesPage() {
  const guides = getPublishedGuides();
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">Guides</h1>
      <p className="mt-4 max-w-3xl leading-7 text-slate-700">
        Practical notes for hiring a ramp, a DIY bay, or a workshop. They explain the booking and, where the directory
        has recorded prices, what those prices do and do not say. They are not a repair manual.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <GuideCardLink guide={guide} />
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/browse" className="font-semibold text-blue-700 hover:text-blue-800">
          Browse published workspace
        </Link>
      </p>
    </div>
  );
}

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideArticle } from "@/components/content/GuideArticle";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { getGuide, publishedGuideParams } from "@/lib/guides";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedGuideParams();
}

export async function generateMetadata(props: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) {
    return { title: "Guide not found", robots: { index: false, follow: false } };
  }

  const metadata = buildMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    index: true,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: `${guide.published}T00:00:00.000Z`,
      modifiedTime: `${guide.updated}T00:00:00.000Z`,
    },
  };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) {
    notFound();
  }

  const path = `/guides/${guide.slug}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={articleJsonLd({
          headline: guide.title,
          description: guide.description,
          path,
          published: guide.published,
          updated: guide.updated,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]}
      />
      <div className="mt-6">
        <GuideArticle guide={guide} />
      </div>
    </div>
  );
}

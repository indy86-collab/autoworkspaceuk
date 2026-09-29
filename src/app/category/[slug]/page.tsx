import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryIcon } from "@/components/CategoryIcon";
import { JsonLd } from "@/components/JsonLd";
import { ListingGrid } from "@/components/ListingGrid";
import { getCategoryEditorial } from "@/content/category-editorial";
import { getCategory } from "@/lib/categories";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/json-ld";
import { getGuide } from "@/lib/guides";
import { getListingsByCategory, populatedCategoryParams, publishedCountLabel } from "@/lib/listings";
import { buildMetadata, isIndexableCategory } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return populatedCategoryParams();
}

export async function generateMetadata(props: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategory(slug);
  const listings = getListingsByCategory(slug);
  if (!category || listings.length === 0) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: category.seoTitle,
    description: category.metaDescription,
    path: `/category/${category.slug}`,
    index: isIndexableCategory(category.slug),
  });
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const category = getCategory(slug);
  const listings = category ? getListingsByCategory(category.slug) : [];

  if (!category || listings.length === 0) {
    notFound();
  }

  const editorial = getCategoryEditorial(category.slug);
  const relatedCategories = (editorial?.relatedCategorySlugs ?? []).flatMap((slug) => {
    const related = getCategory(slug);
    return related && getListingsByCategory(slug).length > 0 ? [related] : [];
  });
  const relatedGuides = (editorial?.relatedGuideSlugs ?? []).flatMap((slug) => {
    const guide = getGuide(slug);
    return guide ? [guide] : [];
  });
  const faqs = [...category.faqs, ...(editorial?.extraFaqs ?? [])];

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: category.name, path: `/category/${category.slug}` },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />
      <div className="mt-6 flex items-start gap-4">
        <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-blue-700">
          <CategoryIcon name={category.icon} />
        </span>
        <div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-navy sm:text-4xl">{category.name}</h1>
          <p className="mt-3 text-sm font-semibold text-navy">{publishedCountLabel(listings)}</p>
        </div>
      </div>
      <section className="mt-4 max-w-3xl">
        <h2 className="text-xl font-semibold text-navy">What this workspace type is</h2>
        <div className="mt-3 space-y-4 leading-7 text-slate-700">
          {category.introduction.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <p className="mt-4">
        <Link href={`/browse?category=${category.slug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          Open these listings in browse
        </Link>
      </p>
      <div className="mt-8">
        <ListingGrid listings={listings} />
      </div>
      {editorial ? (
        <div className="mt-12 max-w-3xl space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-navy">Typical uses</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-700">
              {editorial.typicalUses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-navy">What facilities may include</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-700">
              {editorial.mayInclude.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-navy">What to check before booking</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-700">
              {editorial.beforeBooking.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          {relatedCategories.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold text-navy">Related categories</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {relatedCategories.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/category/${related.slug}`}
                      className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-navy hover:border-blue-200 hover:bg-blue-50"
                    >
                      {related.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {relatedGuides.length > 0 ? (
            <section>
              <h2 className="text-xl font-semibold text-navy">Guides</h2>
              <ul className="mt-3 space-y-2">
                {relatedGuides.map((guide) => (
                  <li key={guide.slug}>
                    <Link href={`/guides/${guide.slug}`} className="font-semibold text-blue-700 hover:text-blue-800">
                      {guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold text-navy">Questions about {category.name}</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {faqs.map((faq) => (
            <details key={faq.question} className="px-5 py-4">
              <summary className="cursor-pointer font-medium text-navy">{faq.question}</summary>
              <p className="mt-2 text-sm leading-6 text-slate-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

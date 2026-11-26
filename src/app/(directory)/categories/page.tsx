import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryCard } from "@/components/CategoryCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getListingsByCategory, getPopulatedCategories, publishedCountLabel } from "@/lib/listings";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "DIY Garages, Ramp Hire, Car Lifts & Workshop Space",
  description:
    "Browse verified UK DIY garages, rent-a-ramp bays, car lift hire, automotive workshop space, spray booths and detailing bays.",
  path: "/categories",
  index: true,
});

export default function CategoriesPage() {
  const categories = getPopulatedCategories();
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Find the right automotive workspace</h1>
      <p className="mt-3 max-w-2xl text-slate-700">
        Compare DIY garages, ramp hire, car lifts, workshop bays and specialist spaces across the UK. Counts come from listings currently published in the directory.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.slug}>
            <CategoryCard category={category} countLabel={publishedCountLabel(getListingsByCategory(category.slug))} />
          </li>
        ))}
      </ul>
    </div>
  );
}

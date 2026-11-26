import { CategoryIcon } from "@/components/CategoryIcon";
import type { CategoryDefinition } from "@/lib/categories";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CategoryCard({
  category,
  countLabel,
}: {
  category: CategoryDefinition;
  countLabel: string;
}) {
  return (
    <article className="card h-full p-5">
      <Link href={`/category/${category.slug}`} className="flex h-full flex-col">
        <div className="category-tile-icon">
          <CategoryIcon name={category.icon} className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-navy">{category.name}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{category.explanation}</p>
        <p className="mt-4 text-sm font-semibold text-navy">{countLabel}</p>
        <span className="section-link mt-2">View category <ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
      </Link>
    </article>
  );
}

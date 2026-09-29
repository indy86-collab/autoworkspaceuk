import { getWorkspaceReport } from "@/lib/dataset-insights";
import Link from "next/link";

export function CategoryDistribution() {
  const report = getWorkspaceReport();
  const max = Math.max(...report.categories.map((category) => category.count), 1);

  return (
    <div>
      <ul className="space-y-3">
        {report.categories.map((category) => (
          <li key={category.slug} className="min-w-0">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <Link href={`/category/${category.slug}`} className="font-medium text-blue-700 hover:text-blue-800">
                {category.name}
              </Link>
              <span className="shrink-0 font-semibold text-navy">{category.count}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${(category.count / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        A facility can be filed under more than one workspace type, so these counts add up to more than {report.liveCount}{" "}
        published listings.
      </p>
    </div>
  );
}

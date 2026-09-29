import { getDirectoryStats } from "@/lib/listings";

export function DirectoryStats() {
  const stats = getDirectoryStats();
  const items = [
    { value: String(stats.locationCount), label: stats.locationLabel },
    { value: String(stats.regionCount), label: stats.regionLabel },
    { value: String(stats.categoryCount), label: stats.categoryLabel },
  ];

  return (
    <dl className="mt-6 grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <dd className="text-lg font-semibold text-navy">{item.value}</dd>
          <dt className="text-sm text-slate-600">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}

import { priceRows } from "@/lib/format";
import { cardPriceLabel, publicPriceSummary, visiblePriceSummary } from "@/lib/public-listing";
import type { ListingPricing } from "@/lib/types";

export function PriceDisplay({
  pricing,
  detailed = false,
}: {
  pricing: ListingPricing;
  detailed?: boolean;
}) {
  if (!detailed) {
    const price = cardPriceLabel(pricing);
    if (!price) {
      return <p className="text-sm text-slate-600">Contact for pricing</p>;
    }
    return <p className="line-clamp-2 text-sm font-semibold text-navy">{price}</p>;
  }

  const rows = priceRows(pricing);
  const summary = rows.length > 0 ? visiblePriceSummary(pricing) : publicPriceSummary(pricing.summary);
  const hasAmount = rows.length > 0 || Boolean(summary?.includes("£"));

  if (!hasAmount && !summary) {
    return <p className="text-slate-700">Contact the facility for current pricing.</p>;
  }

  return (
    <div className="space-y-4">
      {rows.length > 0 ? (
        <dl className={`grid gap-3 ${rows.length === 1 ? "max-w-xs" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {rows.map((row) => (
            <div key={row.label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-sm text-slate-600">{row.label}</dt>
              <dd className="mt-1 text-lg font-semibold text-navy">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {summary ? <p className="leading-7 text-slate-700">{summary}</p> : null}
      {!hasAmount ? <p className="text-slate-700">Contact the facility for current pricing.</p> : null}
      {hasAmount ? (
        <p className="text-sm text-slate-600">Confirm the current rate with the facility before you book.</p>
      ) : null}
    </div>
  );
}

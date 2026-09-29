import type { Audience, ListingPricing } from "@/lib/types";

export function formatGbp(amount: number): string {
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatPriceAmount(amount: number, vatExcluded = false): string {
  const money = formatGbp(amount);
  return vatExcluded ? `${money} + VAT` : money;
}

const verifiedDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatVerifiedDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return verifiedDate.format(date);
}

export function audienceLabel(audience: Audience): string {
  return audience === "consumer" ? "Consumer" : "Trade";
}

export interface PriceRow {
  label: string;
  value: string;
}

export function priceRows(pricing: ListingPricing): PriceRow[] {
  const rows: PriceRow[] = [];
  const vat = Boolean(pricing.vat_excluded);

  if (pricing.hourly_from_gbp != null) {
    rows.push({ label: "Hourly", value: `From ${formatPriceAmount(pricing.hourly_from_gbp, vat)}` });
  }
  if (pricing.half_day_from_gbp != null) {
    rows.push({ label: "Half day", value: `From ${formatPriceAmount(pricing.half_day_from_gbp, vat)}` });
  }
  if (pricing.day_from_gbp != null) {
    rows.push({ label: "Day", value: `From ${formatPriceAmount(pricing.day_from_gbp, vat)}` });
  }
  if (pricing.week_from_gbp != null) {
    rows.push({ label: "Week", value: `From ${formatPriceAmount(pricing.week_from_gbp, vat)}` });
  }
  if (pricing.monthly_from_gbp != null) {
    rows.push({ label: "Month", value: `From ${formatPriceAmount(pricing.monthly_from_gbp, vat)}` });
  }

  return rows;
}

export function hasNumericPrice(pricing: ListingPricing): boolean {
  return (
    pricing.hourly_from_gbp != null ||
    pricing.half_day_from_gbp != null ||
    pricing.day_from_gbp != null ||
    pricing.week_from_gbp != null ||
    pricing.monthly_from_gbp != null
  );
}

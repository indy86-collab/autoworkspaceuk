import { addressLines as formatAddressLines, formatPlace as formatPlaceLabel } from "@/lib/address";
import { publicCategoriesForListing, publicCategoryOf } from "@/lib/categories";
import { displayEquipmentList } from "@/lib/equipment";
import { formatGbp } from "@/lib/format";
import { AUDIENCES, type Audience, type Listing, type ListingPricing, type VerificationLevel } from "@/lib/types";
import { publicVerification, verificationSourceNote, VERIFIED_LISTING_HELP as VERIFIED_HELP } from "@/lib/verification";

export const VERIFIED_LISTING_HELP = VERIFIED_HELP;

const SOURCE_MARKERS =
  /\byell\b|\blinkedin\b|companies house|\bfixter\b|\bautoyas\b|\bcylex\b|\bfetchable\b|sources checked|publish with limited|display source|\bthis pass\b|opening hours|\d+\s+reviews?\b|before display|not reliably exposed|not publicly stated|marketplace|manual re-check|keep secondary|internal verification/i;

const PRICE_INTERNAL =
  /before display|not reliably exposed|not publicly stated|sources checked|verify current price|quote required|price by enquiry|confirm current price|pricing varies|current rate available|booking flow/i;

const SUMMARY_EXTRA =
  /\b(weekend|weekday|minimum|deposit|additional|between|varied|packages?|consumables?|underseal|tiers?|supervised|9am|5pm|first hour|multi-day|around|approved|discount|enquiry|20\d{2})\b/i;

function sentences(value: string): string[] {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function tidySentence(value: string): string {
  let text = value.trim();
  text = text.replace(/^Current site (?:shows|advertises)\s+/i, "");
  text = text.replace(/\s+across current site pages/gi, "");
  text = text.replace(/^Current\s+/i, "");
  text = text.replace(/\bfirst-party (?:gtg pages|hire page|booking page|site|page)\s+explicitly\s+/gi, "");
  text = text.replace(/\bfirst-party (?:gtg pages|hire page|booking page|site|page)\s+/gi, "");
  text = text.replace(/\bexplicitly\s+/gi, "");
  text = text.replace(/^(?:states|state)\s+that\s+/i, "");
  text = text.replace(/^(?:advertises|advertise)\s+/i, "");
  text = text.replace(/;\s*states\s+availability\s+to\s+/i, ", available to ");
  text = text.replace(/\s+/g, " ").trim();
  if (!text) {
    return "";
  }
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) {
    text += ".";
  }
  return text;
}

function factualFragment(sentence: string): string | null {
  const match = sentence.match(
    /explicitly (?:advertise|advertises|describe|describes|list|lists|offer|offers)\s+['"]?(.+?)['"]?(?:;|\.)/i,
  );
  if (!match?.[1] || SOURCE_MARKERS.test(match[1])) {
    return null;
  }
  return tidySentence(match[1]);
}

export function cleanResearchText(value: string): string {
  const kept: string[] = [];

  for (const sentence of sentences(value)) {
    if (SOURCE_MARKERS.test(sentence)) {
      const fragment = factualFragment(sentence);
      if (fragment) {
        kept.push(fragment);
      }
      continue;
    }
    const tidy = tidySentence(sentence);
    if (tidy && !SOURCE_MARKERS.test(tidy) && !/\bfirst-party\b/i.test(tidy)) {
      kept.push(tidy);
    }
  }

  return kept.join(" ");
}

function formatList(items: readonly string[]): string {
  if (items.length <= 1) {
    return items[0] ?? "";
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function publicOverview(listing: Listing): string {
  const parts: string[] = [];
  const notes = listing.notes ? cleanResearchText(listing.notes) : "";
  if (notes) {
    parts.push(notes);
  } else if (listing.equipment.length > 0) {
    parts.push(`Recorded equipment includes ${formatList(displayEquipmentList(listing.equipment).slice(0, 4))}.`);
  }

  if (listing.vehicle_capacity && !notes.toLowerCase().includes(listing.vehicle_capacity.toLowerCase())) {
    parts.push(`Recorded vehicle capacity: ${listing.vehicle_capacity}.`);
  }

  const extras = publicCategoriesForListing(listing).filter((category) => category.slug !== listing.primary_category);
  if (extras.length > 0) {
    parts.push(`Also recorded as ${formatList(extras.map((category) => category.name))}.`);
  }

  if (parts.length > 0) {
    return parts.join(" ");
  }

  const names = publicCategoriesForListing(listing).map((category) => category.name);
  return names.length > 0 ? `Listed as ${formatList(names)} in ${listing.address.city}.` : `Listed automotive workspace in ${listing.address.city}.`;
}

export function publicPriceSummary(summary: string | undefined): string | null {
  if (!summary?.trim()) {
    return null;
  }

  const kept = sentences(summary)
    .filter((sentence) => !PRICE_INTERNAL.test(sentence) && !SOURCE_MARKERS.test(sentence))
    .map((sentence) => tidySentence(sentence))
    .filter((sentence) => sentence.length > 0);
  if (kept.length === 0) {
    return null;
  }
  return kept.join(" ");
}

export function visiblePriceSummary(pricing: ListingPricing): string | null {
  const summary = publicPriceSummary(pricing.summary);
  if (!summary) {
    return null;
  }
  if (!hasAnyNumericPrice(pricing)) {
    return summary;
  }
  return SUMMARY_EXTRA.test(summary) ? summary : null;
}

export function hasAnyNumericPrice(pricing: ListingPricing): boolean {
  return (
    pricing.hourly_from_gbp != null ||
    pricing.half_day_from_gbp != null ||
    pricing.day_from_gbp != null ||
    pricing.week_from_gbp != null ||
    pricing.monthly_from_gbp != null
  );
}

export function cardPriceLabel(pricing: ListingPricing): string | null {
  const amount = startingPriceLabel(pricing);
  if (amount) {
    return amount;
  }
  const summary = publicPriceSummary(pricing.summary);
  if (summary?.includes("£")) {
    return summary;
  }
  return null;
}

export function startingPriceLabel(pricing: ListingPricing): string | null {
  const vat = pricing.vat_excluded ? " + VAT" : "";
  if (pricing.hourly_from_gbp != null) {
    return `From ${formatGbp(pricing.hourly_from_gbp)}/hr${vat}`;
  }
  if (pricing.half_day_from_gbp != null) {
    return `From ${formatGbp(pricing.half_day_from_gbp)}/half day${vat}`;
  }
  if (pricing.day_from_gbp != null) {
    return `From ${formatGbp(pricing.day_from_gbp)}/day${vat}`;
  }
  if (pricing.week_from_gbp != null) {
    return `From ${formatGbp(pricing.week_from_gbp)}/week${vat}`;
  }
  if (pricing.monthly_from_gbp != null) {
    return `From ${formatGbp(pricing.monthly_from_gbp)}/month${vat}`;
  }
  return null;
}

export function formatPlace(listing: Listing): string {
  return formatPlaceLabel(listing);
}

export function addressLines(listing: Listing): string[] {
  return formatAddressLines(listing);
}

export function orderedAudience(audience: readonly Audience[]): Audience[] {
  return AUDIENCES.filter((item) => audience.includes(item));
}

export function primaryCategoryName(listing: Listing): string {
  return publicCategoryOf(listing.primary_category)?.name ?? "Automotive workspace";
}

export function verificationNote(level: VerificationLevel): string {
  return verificationSourceNote(level);
}

export function publicVerificationState(listing: Listing) {
  return publicVerification(listing);
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function websiteLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Website";
  }
}

export function cardEquipment(equipment: readonly string[], limit = 3): string[] {
  return displayEquipmentList(equipment).slice(0, limit);
}

const LEAKED_TERMS =
  /first-party|first party|\bfirst_party\b|secondary_current|marketplace_current|\bconflicting\b|source_url|\byell\b|\bfixter\b|companies house|\bfetchable\b|\bthis pass\b/i;

export function containsInternalWording(value: string): boolean {
  return LEAKED_TERMS.test(value);
}

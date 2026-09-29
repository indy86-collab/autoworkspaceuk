import { getLiveListings } from "@/lib/listings";
import { formatPlace } from "@/lib/public-listing";
import { siteConfig } from "@/lib/site";

export function GET() {
  const listings = getLiveListings();
  const body = `# ${siteConfig.name} — live listing data\n\n${listings
    .map((listing) => {
      const price = listing.pricing.summary ?? "Contact facility for current pricing.";
      return `## ${listing.name}\nURL: ${siteConfig.url}/listing/${listing.slug}\nLocation: ${formatPlace(listing)}\nCategory: ${listing.primary_category}\nAudience: ${listing.audience.join(", ")}\nEquipment: ${listing.equipment.join(", ")}\nPricing: ${price}\nLast verified: ${listing.last_verified}\nSource: ${listing.source_url}`;
    })
    .join("\n\n")}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

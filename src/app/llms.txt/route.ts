import { getLiveListings, getPopulatedCategories } from "@/lib/listings";
import { siteConfig } from "@/lib/site";

export function GET() {
  const categories = getPopulatedCategories();
  const listings = getLiveListings();
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a UK directory of places where external customers can hire automotive workspace. Listings are manually researched and show a verification date. Ordinary repair garages are not added automatically.

## Key pages

- Homepage: ${siteConfig.url}/
- Browse listings: ${siteConfig.url}/browse
- Categories: ${siteConfig.url}/categories
- Guides: ${siteConfig.url}/guides
- Methodology: ${siteConfig.url}/methodology
- Insights: ${siteConfig.url}/insights

## Workspace categories

${categories.map((category) => `- [${category.name}](${siteConfig.url}/category/${category.slug}): ${category.explanation}`).join("\n")}

## Directory coverage

- ${listings.length} live listings
- UK locations and regions
- Recorded prices are starting prices and should be confirmed with the facility
- Verification is based on published evidence and is not a physical inspection or guarantee

For complete listing-level data, see ${siteConfig.url}/llms-full.txt.
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

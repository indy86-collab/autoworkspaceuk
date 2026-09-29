import fs from "node:fs";
import path from "node:path";
import { generateStaticParams as categoryParams } from "../src/app/category/[slug]/page";
import { generateStaticParams as listingParams } from "../src/app/listing/[slug]/page";
import sitemap from "../src/app/sitemap";
import { getCategoryEditorial } from "../src/content/category-editorial";
import { guidePlainText } from "../src/content/guides/blocks";
import { getCategory } from "../src/lib/categories";
import {
  getRampPriceResearch,
  getWorkspaceReport,
  isRampOrLiftListing,
  median,
} from "../src/lib/dataset-insights";
import { listingSimilarityTier } from "../src/lib/directory";
import { normaliseEquipmentLabel } from "../src/lib/equipment";
import { compactFeatures } from "../src/lib/features";
import { getGuide, getPublishedGuides, guideHrefs, guideWordCount } from "../src/lib/guides";
import { metadata as aboutMetadata } from "../src/app/about/page";
import { metadata as addListingMetadata } from "../src/app/add-listing/page";
import { metadata as browseMetadata } from "../src/app/browse/page";
import { metadata as categoriesMetadata } from "../src/app/categories/page";
import { metadata as claimMetadata } from "../src/app/claim-listing/page";
import { metadata as guidesMetadata } from "../src/app/guides/page";
import { metadata as insightsMetadata } from "../src/app/insights/page";
import { metadata as methodologyMetadata } from "../src/app/methodology/page";
import { metadata as homeMetadata } from "../src/app/page";
import { metadata as privacyMetadata } from "../src/app/privacy/page";
import { metadata as reportFormMetadata } from "../src/app/report/page";
import robotsTxt from "../src/app/robots";
import { metadata as termsMetadata } from "../src/app/terms/page";
import { publicContentIssues } from "../src/lib/content-quality";
import { articleJsonLd, breadcrumbJsonLd, localBusinessJsonLd, websiteJsonLd } from "../src/lib/json-ld";
import {
  validateArticleJsonLd,
  validateBreadcrumbJsonLd,
  validateLocalBusinessJsonLd,
  validateWebsiteJsonLd,
} from "../src/lib/json-ld-validate";
import { buildMetadata, listingDescription, listingMetaTitle } from "../src/lib/seo";
import type { Metadata } from "next";
import {
  getFeaturedListings,
  getListingBySlug,
  getListingsByCategory,
  getListingsByCity,
  getListingsByRegion,
  getLiveListings,
  getLocationSuggestionSources,
  getNearbyAlternatives,
  getPopulatedCategories,
  getRegions,
  getStoredListings,
  populatedCategoryParams,
} from "../src/lib/listings";
import { matchLocationSuggestions } from "../src/lib/location-suggestions";
import {
  addressLines,
  containsInternalWording,
  publicOverview,
  publicPriceSummary,
  startingPriceLabel,
  verificationNote,
} from "../src/lib/public-listing";
import { sortListings } from "../src/lib/ranking";
import { filterListings, parseDirectoryQuery } from "../src/lib/search";
import { PUBLISH_STATUSES, type Listing, type PublishStatus } from "../src/lib/types";

const hiddenStatuses: PublishStatus[] = ["review", "coming_soon", "hold"];
const allowedStatuses = new Set<string>(PUBLISH_STATUSES);
let failed = false;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    failed = true;
    console.error(`FAIL ${message}`);
  }
}

function ids(listings: readonly Listing[]): string[] {
  return listings.map((listing) => listing.id);
}

function assertMetadata(meta: Metadata, expected: { path: string; index: boolean; label: string }): void {
  const description = meta.description;
  assert(typeof description === "string" && description.length >= 40, `${expected.label} is missing a meta description`);
  const canonical = meta.alternates && typeof meta.alternates === "object" ? meta.alternates.canonical : undefined;
  assert(canonical === expected.path, `${expected.label} canonical is ${String(canonical)}`);
  const robots = meta.robots;
  if (robots && typeof robots === "object" && !Array.isArray(robots)) {
    assert(robots.index === expected.index, `${expected.label} robots.index expected ${expected.index}`);
  } else {
    assert(false, `${expected.label} is missing robots directives`);
  }
  assert(Boolean(meta.openGraph), `${expected.label} is missing Open Graph metadata`);
  assert(Boolean(meta.twitter), `${expected.label} is missing Twitter metadata`);
}

const rawPath = path.join(process.cwd(), "src/data/listings.json");
const rawText = fs.readFileSync(rawPath, "utf8");
const raw: unknown = JSON.parse(rawText);

assert(Array.isArray(raw), "listings.json must be an array");
assert(!rawText.includes("[Fixture]"), "Fixture label remains in listings.json");
assert(!rawText.includes('"is_fixture"'), "is_fixture remains in listings.json");

const stored = getStoredListings();
const live = getLiveListings();
const hidden = stored.filter((listing) => listing.publish_status !== "live");
const counts = {
  total: stored.length,
  live: stored.filter((listing) => listing.publish_status === "live").length,
  review: stored.filter((listing) => listing.publish_status === "review").length,
  coming_soon: stored.filter((listing) => listing.publish_status === "coming_soon").length,
  hold: stored.filter((listing) => listing.publish_status === "hold").length,
};

assert(stored.length > 0, "listings.json has no records");
assert(
  stored.every((listing) => allowedStatuses.has(listing.publish_status)),
  "Unsupported publish_status exists",
);
assert(
  live.every((listing) => listing.publish_status === "live"),
  "getLiveListings returned a record that is not live",
);
assert(live.length === counts.live, "getLiveListings() count does not match live records");
assert(
  hidden.every((listing) => !ids(live).includes(listing.id)),
  "A non-live record appeared in getLiveListings()",
);

const slugCounts = new Map<string, number>();
for (const listing of stored) {
  slugCounts.set(listing.slug, (slugCounts.get(listing.slug) ?? 0) + 1);
  assert(Boolean(listing.slug), `${listing.id} lacks a slug`);
  assert(Boolean(listing.name), `${listing.id} lacks a name`);
  assert(getCategory(listing.primary_category) !== undefined, `${listing.slug} has an unknown primary category`);
  for (const category of listing.categories) {
    assert(getCategory(category) !== undefined, `${listing.slug} has unknown category ${category}`);
  }
}
for (const [slug, count] of slugCounts) {
  assert(count === 1, `Duplicate slug ${slug}`);
}

for (const status of hiddenStatuses) {
  assert(
    hidden.filter((listing) => listing.publish_status === status).every((listing) => !ids(live).includes(listing.id)),
    `${status} records entered getLiveListings()`,
  );
}

for (const listing of hidden) {
  assert(getListingBySlug(listing.slug) === undefined, `${listing.slug} is ${listing.publish_status} but getListingBySlug returned it`);
  assert(
    !ids(getListingsByCategory(listing.primary_category)).includes(listing.id),
    `${listing.slug} appeared in getListingsByCategory()`,
  );
  assert(
    !ids(getListingsByCity(listing.address.city)).includes(listing.id),
    `${listing.slug} appeared in getListingsByCity(${listing.address.city})`,
  );
  if (listing.address.region) {
    assert(
      !ids(getListingsByRegion(listing.address.region)).includes(listing.id),
      `${listing.slug} appeared in getListingsByRegion(${listing.address.region})`,
    );
  }
  const searched = filterListings(stored, parseDirectoryQuery({ location: listing.name }));
  assert(!ids(searched).includes(listing.id), `${listing.slug} appeared in a name search of the full file`);
}

const generatedListings = listingParams();
const generatedSlugs = generatedListings.map((item) => item.slug);
assert(generatedSlugs.length === live.length, "Generated listing routes do not match the live count");
for (const listing of live) {
  assert(Boolean(listing.slug) && Boolean(listing.name), `Live listing ${listing.id} lacks a slug or name`);
  assert(generatedSlugs.includes(listing.slug), `Live listing ${listing.slug} was omitted from generated listing routes`);
  assert(getListingBySlug(listing.slug)?.id === listing.id, `Live listing ${listing.slug} was not returned by slug`);

  const overview = publicOverview(listing);
  const priceNote = publicPriceSummary(listing.pricing.summary) ?? "";
  const business = localBusinessJsonLd(listing);
  const publicText = [overview, priceNote, verificationNote(listing.verification_level), JSON.stringify(business ?? {})].join(
    "\n",
  );
  assert(!containsInternalWording(publicText), `${listing.slug} exposes internal wording`);
  assert(!overview.includes(listing.source_url) && !priceNote.includes(listing.source_url), `${listing.slug} overview exposes source_url`);
  if (business) {
    if (listing.website !== listing.source_url) {
      assert(!JSON.stringify(business).includes(listing.source_url), `${listing.slug} JSON-LD exposes a research source URL`);
    }
    for (const error of validateLocalBusinessJsonLd(business, listing)) {
      assert(false, `${listing.slug}: ${error}`);
    }
  }
  const listingMeta = buildMetadata({
    title: listingMetaTitle(listing),
    description: listingDescription(listing),
    path: `/listing/${listing.slug}`,
    index: true,
  });
  assertMetadata(listingMeta, { path: `/listing/${listing.slug}`, index: true, label: `listing ${listing.slug}` });

  const placeLines = addressLines(listing);
  assert(
    new Set(placeLines.map((line) => line.toLowerCase())).size === placeLines.length,
    `${listing.slug} repeats an address line`,
  );
  if (listing.address.city.toLowerCase() === (listing.address.region ?? "").toLowerCase()) {
    assert(
      placeLines.filter((line) => line.toLowerCase() === listing.address.city.toLowerCase()).length <= 1,
      `${listing.slug} repeats the same town and region`,
    );
  }
  if (!listing.address.line1 && !listing.address.postcode) {
    assert(
      placeLines.some((line) => line.startsWith("Location:")),
      `${listing.slug} should use a Location label when street and postcode are missing`,
    );
    assert(
      !placeLines.includes("United Kingdom"),
      `${listing.slug} should not add a UK postal block when only a town or region is known`,
    );
  }

  const nearby = getNearbyAlternatives(listing, 3);
  assert(nearby.length <= 3, `Similar results for ${listing.slug} exceeded 3`);
  assert(!ids(nearby).includes(listing.id), `Similar results for ${listing.slug} included itself`);
  assert(
    nearby.every((item) => item.publish_status === "live"),
    `Similar results for ${listing.slug} included a non-live listing`,
  );
  assert(
    nearby.every((item) => listingSimilarityTier(listing, item) < 9),
    `Similar results for ${listing.slug} included an unrelated listing`,
  );
  for (let index = 1; index < nearby.length; index += 1) {
    assert(
      listingSimilarityTier(listing, nearby[index]) >= listingSimilarityTier(listing, nearby[index - 1]),
      `Similar results for ${listing.slug} are out of preference order`,
    );
  }
}

const generatedCategories = categoryParams();
const populated = getPopulatedCategories();
assert(
  generatedCategories.length === populated.length,
  "Generated category routes do not match populated public categories",
);
for (const category of populated) {
  assert(getListingsByCategory(category.slug).length > 0, `Populated category ${category.slug} has no live listings`);
  assert(
    generatedCategories.some((item) => item.slug === category.slug),
    `Populated category ${category.slug} was omitted from category routes`,
  );
  assert(!category.groupedUnder, `Grouped category ${category.slug} has a public page`);
}
for (const params of populatedCategoryParams()) {
  assert(populated.some((category) => category.slug === params.slug), `Unexpected category route ${params.slug}`);
}

const featured = getFeaturedListings(6);
assert(featured.length === Math.min(6, live.length), "Featured selection has the wrong length");
assert(new Set(featured.map((listing) => listing.address.region)).size === featured.length, "Featured listings repeat a region");
assert(new Set(featured.map((listing) => listing.primary_category)).size >= 4, "Featured listings are not category-diverse");
assert(featured.every((listing) => listing.publish_status === "live"), "Featured listings include a non-live record");

function expectLocation(query: string, predicate: (listing: Listing) => boolean): void {
  const matches = filterListings(live, parseDirectoryQuery({ location: query }));
  assert(matches.length > 0, `No live matches for ${query}`);
  assert(matches.every(predicate), `${query} search returned an unrelated listing`);
  assert(matches.every((listing) => listing.publish_status === "live"), `${query} search returned a non-live listing`);
}

expectLocation("Liverpool", (listing) => /liverpool/i.test(`${listing.name} ${listing.address.city}`));
expectLocation("Cardiff", (listing) => /cardiff/i.test(`${listing.name} ${listing.address.city}`));
expectLocation("Edinburgh", (listing) => /edinburgh/i.test(`${listing.name} ${listing.address.city}`));
expectLocation("L9", (listing) => listing.address.postcode?.toUpperCase().startsWith("L9") === true);
expectLocation("NP19", (listing) => listing.address.postcode?.toUpperCase().replace(/\s+/g, "").startsWith("NP19") === true);
expectLocation("rent a ramp", (listing) => listing.categories.includes("rent-a-ramp") || /rent a ramp/i.test(listing.name));
expectLocation("spray booth", (listing) => listing.categories.includes("spray-booth-hire") || /spray booth/i.test(listing.name));

const suggestionSources = getLocationSuggestionSources();
const suggestionAddresses = live.map((listing) => listing.address);
const names = new Set(live.map((listing) => listing.name.toLowerCase()));
const livSuggestions = matchLocationSuggestions(suggestionSources, "Liv", suggestionAddresses);
assert(
  livSuggestions.some((item) => item.label === "Liverpool"),
  "Typing Liv did not suggest Liverpool",
);
assert(
  livSuggestions.some((item) => item.label === "L9 7ET"),
  "Typing Liv did not suggest L9 7ET",
);
const newSuggestions = matchLocationSuggestions(suggestionSources, "New", suggestionAddresses);
assert(
  newSuggestions.some((item) => item.label === "Newport"),
  "Typing New did not suggest Newport",
);
assert(
  [...livSuggestions, ...newSuggestions].every((item) => !names.has(item.label.toLowerCase())),
  "Location suggestions included a business name",
);

assert(normaliseEquipmentLabel("2-post lift") === "2-post lift", "Canonical 2-post lift was rewritten");
assert(normaliseEquipmentLabel("two post lift") === "2-post lift", "two post lift was not normalised");
assert(normaliseEquipmentLabel("2 post ramp") === "2-post lift", "2 post ramp was not normalised");
assert(normaliseEquipmentLabel("creeper") === "creeper", "creeper was rewritten as if it were other equipment");
assert(
  !compactFeatures(["creeper", "2-post lift", "diagnostics"], 3).includes("creeper"),
  "Listing cards still prefer creeper over higher-level features",
);

const paintShop = getListingBySlug("paint-shop-pros-buckinghamshire");
if (paintShop) {
  assert(
    addressLines(paintShop).join(" | ") === "Location: Buckinghamshire",
    "Buckinghamshire town/region was not deduplicated in presentation",
  );
}

const recommendedOrder = sortListings(live, "recommended").map((listing) => listing.id).join(",");
assert(
  recommendedOrder === sortListings(live, "recommended").map((listing) => listing.id).join(","),
  "Recommended sort is not deterministic",
);
const az = sortListings(live, "name");
assert(
  az.every((listing, index) => index === 0 || az[index - 1].name.localeCompare(listing.name, "en-GB") <= 0),
  "A–Z sort is not alphabetical",
);

const vatListing = live.find((listing) => listing.pricing.vat_excluded);
if (vatListing) {
  const label = startingPriceLabel(vatListing.pricing) ?? "";
  assert(label.includes("+ VAT"), `${vatListing.slug} does not show + VAT on the published price`);
}

const entries = sitemap();
const urls = entries.map((entry) => entry.url);
assert(urls.some((url) => url.endsWith("/")), "Sitemap is missing the homepage");
assert(urls.some((url) => url.endsWith("/categories")), "Sitemap is missing categories");
assert(urls.some((url) => url.endsWith("/about")), "Sitemap is missing about");
assert(urls.some((url) => url.endsWith("/guides")), "Sitemap is missing the guides index");
assert(urls.some((url) => url.endsWith("/insights")), "Sitemap is missing insights");
assert(urls.some((url) => url.endsWith("/insights/uk-automotive-workspace-report")), "Sitemap is missing the workspace report");
assert(urls.some((url) => url.endsWith("/methodology")), "Sitemap is missing methodology");
assert(urls.some((url) => url.endsWith("/privacy")), "Sitemap is missing privacy");
assert(urls.some((url) => url.endsWith("/terms")), "Sitemap is missing terms");
assert(!urls.some((url) => url.includes("/browse")), "Sitemap includes a browse URL");
assert(!urls.some((url) => /\/report\/?$/.test(url)), "Sitemap includes the report page");
assert(!urls.some((url) => url.includes("/add-listing")), "Sitemap includes add-listing");
assert(!urls.some((url) => url.includes("/claim-listing")), "Sitemap includes claim-listing");
assert(!urls.some((url) => url.includes("/api/")), "Sitemap includes an API route");
assert(!urls.some((url) => url.includes("/reports")), "Sitemap includes an internal reports path");

const robotsConfig = robotsTxt();
const robotsRule = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
const robotsDisallow = robotsRule?.disallow ?? [];
const disallowList = Array.isArray(robotsDisallow) ? robotsDisallow : [robotsDisallow];
assert(disallowList.includes("/api/"), "robots.txt does not disallow /api/");
assert(disallowList.includes("/add-listing"), "robots.txt does not disallow add-listing");
assert(disallowList.includes("/claim-listing"), "robots.txt does not disallow claim-listing");
assert(disallowList.includes("/report"), "robots.txt does not disallow the report form");

assertMetadata(homeMetadata, { path: "/", index: true, label: "homepage" });
assertMetadata(browseMetadata, { path: "/browse", index: false, label: "browse" });
assertMetadata(categoriesMetadata, { path: "/categories", index: true, label: "categories" });
assertMetadata(aboutMetadata, { path: "/about", index: true, label: "about" });
assertMetadata(guidesMetadata, { path: "/guides", index: true, label: "guides" });
assertMetadata(insightsMetadata, { path: "/insights", index: true, label: "insights" });
assertMetadata(methodologyMetadata, { path: "/methodology", index: true, label: "methodology" });
assertMetadata(privacyMetadata, { path: "/privacy", index: true, label: "privacy" });
assertMetadata(termsMetadata, { path: "/terms", index: true, label: "terms" });
assertMetadata(addListingMetadata, { path: "/add-listing", index: false, label: "add-listing" });
assertMetadata(reportFormMetadata, { path: "/report", index: false, label: "report form" });
assertMetadata(claimMetadata, { path: "/claim-listing", index: false, label: "claim-listing" });

for (const error of validateWebsiteJsonLd(websiteJsonLd())) {
  assert(false, error);
}
for (const error of validateBreadcrumbJsonLd(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]))) {
  assert(false, error);
}
const reportArticle = getWorkspaceReport();
for (const error of validateArticleJsonLd(
  articleJsonLd({
    headline: "UK Automotive Workspace & DIY Garage Report",
    description: "Figures from the published AutoWorkspace UK dataset.",
    path: "/insights/uk-automotive-workspace-report",
    published: reportArticle.latestVerified,
    updated: reportArticle.latestVerified,
  }),
)) {
  assert(false, error);
}

for (const issue of publicContentIssues(stored)) {
  assert(false, issue);
}

const publishedGuides = getPublishedGuides();
assert(publishedGuides.length === 6, "Expected six published guides");
const guideSlugs = new Set<string>();
const knownPaths = new Set([
  "/",
  "/browse",
  "/categories",
  "/about",
  "/guides",
  "/insights",
  "/insights/uk-automotive-workspace-report",
  "/methodology",
  "/privacy",
  "/terms",
  "/add-listing",
  "/report",
  "/claim-listing",
]);
const bannedGuideClaims =
  /national average|average uk|uk average|we inspected|we visited|physically inspected|comprehensive coverage|testimonial/i;

for (const guide of publishedGuides) {
  assert(!guideSlugs.has(guide.slug), `Duplicate guide slug ${guide.slug}`);
  guideSlugs.add(guide.slug);
  assert(getGuide(guide.slug)?.slug === guide.slug, `Published guide ${guide.slug} was not returned by slug`);
  const words = guideWordCount(guide);
  assert(words >= 1000 && words <= 2000, `${guide.slug} is ${words} words`);
  assert(!bannedGuideClaims.test(guidePlainText(guide)), `${guide.slug} contains an unsupported claim`);
  assert(
    urls.some((url) => url.endsWith(`/guides/${guide.slug}`)),
    `Sitemap omits guide ${guide.slug}`,
  );
  assertMetadata(
    buildMetadata({
      title: guide.title,
      description: guide.description,
      path: `/guides/${guide.slug}`,
      index: true,
    }),
    { path: `/guides/${guide.slug}`, index: true, label: `guide ${guide.slug}` },
  );
  for (const href of guideHrefs(guide)) {
    if (href.startsWith("/guides/")) {
      assert(guideSlugs.has(href.slice("/guides/".length)) || publishedGuides.some((item) => item.slug === href.slice("/guides/".length)), `${guide.slug} links to unknown guide ${href}`);
    } else if (href.startsWith("/category/")) {
      const slug = href.slice("/category/".length);
      assert(populated.some((category) => category.slug === slug), `${guide.slug} links to category without listings: ${href}`);
    } else if (href.startsWith("/listing/")) {
      const slug = href.slice("/listing/".length);
      assert(live.some((listing) => listing.slug === slug), `${guide.slug} links to unpublished listing ${href}`);
    } else {
      assert(knownPaths.has(href), `${guide.slug} has an unexpected link ${href}`);
    }
  }
}

for (const category of populated) {
  const copy = getCategoryEditorial(category.slug);
  assert(copy !== undefined, `Populated category ${category.slug} has no editorial`);
  if (!copy) {
    continue;
  }
  assert(category.faqs.length + copy.extraFaqs.length >= 4, `${category.slug} has fewer than 4 FAQs`);
  assert(copy.typicalUses.length >= 3, `${category.slug} typical uses are thin`);
  assert(copy.relatedGuideSlugs.length >= 2, `${category.slug} needs related guides`);
  for (const slug of copy.relatedGuideSlugs) {
    assert(getGuide(slug) !== undefined, `${category.slug} links to unknown guide ${slug}`);
  }
}

const research = getRampPriceResearch();
const rampHourly = live
  .filter((listing) => isRampOrLiftListing(listing) && listing.pricing.hourly_from_gbp != null)
  .map((listing) => listing.pricing.hourly_from_gbp as number)
  .sort((a, b) => a - b);
assert(research.hourly.length === rampHourly.length, "Ramp hourly count drifted from the dataset");
assert(research.lowestHourly === (rampHourly[0] ?? null), "Lowest hourly price drifted from the dataset");
assert(research.highestHourly === (rampHourly.at(-1) ?? null), "Highest hourly price drifted from the dataset");
assert(research.medianHourly === median(rampHourly), "Median hourly price drifted from the dataset");
assert(!/average uk|national average/i.test(JSON.stringify(research)), "Ramp price research describes a national average");

const report = getWorkspaceReport();
assert(report.liveCount === live.length, "Workspace report facility count drifted");
assert(report.regionCount === getRegions().length, "Workspace report region count drifted");
assert(report.populatedCategoryCount === populated.length, "Workspace report category count drifted");
assert(report.categories.every((category) => category.count === getListingsByCategory(category.slug).length), "Category distribution drifted");
for (const listing of live) {
  assert(
    urls.some((url) => url.endsWith(`/listing/${listing.slug}`)),
    `Sitemap omits live listing ${listing.slug}`,
  );
}
for (const listing of hidden) {
  assert(
    !urls.some((url) => url.includes(`/listing/${listing.slug}`)),
    `Sitemap includes ${listing.publish_status} listing ${listing.slug}`,
  );
}
for (const category of populated) {
  assert(
    urls.some((url) => url.endsWith(`/category/${category.slug}`)),
    `Sitemap omits category ${category.slug}`,
  );
  assertMetadata(
    buildMetadata({
      title: category.seoTitle,
      description: category.metaDescription,
      path: `/category/${category.slug}`,
      index: true,
    }),
    { path: `/category/${category.slug}`, index: true, label: `category ${category.slug}` },
  );
}

const warnings: string[] = [];
for (const listing of live) {
  if (listing.address.city.toLowerCase() === (listing.address.region ?? "").toLowerCase()) {
    warnings.push(`${listing.slug}: town and region are both "${listing.address.city}"`);
  }
  if (!listing.address.postcode) {
    warnings.push(`${listing.slug}: no postcode`);
  }
  if (!listing.address.line1) {
    warnings.push(`${listing.slug}: no street address`);
  }
  if (!listing.website) {
    warnings.push(`${listing.slug}: no website`);
  }
  if (listing.verification_level !== "first_party") {
    warnings.push(`${listing.slug}: verification_level is ${listing.verification_level}`);
  }
  const summary = listing.pricing.summary ?? "";
  const numeric =
    listing.pricing.hourly_from_gbp != null ||
    listing.pricing.half_day_from_gbp != null ||
    listing.pricing.day_from_gbp != null ||
    listing.pricing.week_from_gbp != null ||
    listing.pricing.monthly_from_gbp != null;
  if (!numeric && summary.includes("£")) {
    warnings.push(`${listing.slug}: price is only in the summary text`);
  }
  if (listing.equipment.some((item) => /confirm|specification/i.test(item))) {
    warnings.push(`${listing.slug}: equipment still needs confirmation (${listing.equipment.filter((item) => /confirm|specification/i.test(item)).join("; ")})`);
  }
}

const statusLabel = (status: PublishStatus) => stored.filter((listing) => listing.publish_status === status).length;

console.log(`Total records: ${stored.length}`);
console.log(`Live: ${statusLabel("live")}`);
console.log(`Review: ${statusLabel("review")}`);
console.log(`Coming soon: ${statusLabel("coming_soon")}`);
console.log(`Hold: ${statusLabel("hold")}`);
console.log(`Public listing pages: ${generatedSlugs.length}`);
console.log(`Public category pages: ${populated.length}`);
console.log(`Regions represented: ${getRegions().length}`);
console.log(`Sitemap URLs: ${urls.length}`);
for (const guide of publishedGuides) {
  console.log(`Guide words (${guide.slug}): ${guideWordCount(guide)}`);
}
if (warnings.length > 0) {
  console.log("Manual checks:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log("Publishing checks passed.");

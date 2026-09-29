import fs from "node:fs";
import path from "node:path";
import { buildDataAudit, type DuplicateGroup, type NamedRecord } from "../src/lib/data-quality";
import { parseListings } from "../src/lib/validate-listings";

function printGroup(title: string, records: readonly NamedRecord[]): void {
  console.log(`${title}: ${records.length}`);
  for (const record of records) {
    const extra = record.detail ? ` (${record.detail})` : "";
    console.log(`  - ${record.slug} — ${record.name}${extra}`);
  }
}

function printDuplicates(title: string, groups: readonly DuplicateGroup[]): void {
  console.log(`${title}: ${groups.length}`);
  for (const group of groups) {
    console.log(`  - ${group.value}: ${group.listings.map((item) => item.slug).join(", ")}`);
  }
}

const rawPath = path.join(process.cwd(), "src/data/listings.json");

let listings;
try {
  listings = parseListings(JSON.parse(fs.readFileSync(rawPath, "utf8")));
} catch (error) {
  console.error("Integrity failure: listings.json did not pass schema checks.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const report = buildDataAudit(listings);

if (report.unknownCategories.length > 0) {
  console.error("Integrity failure: unknown categories", report.unknownCategories.join(", "));
  process.exit(1);
}

console.log("AutoWorkspace UK data audit");
console.log("===========================");
console.log(`Total records: ${report.totalRecords}`);
console.log(`Live records: ${report.liveRecords}`);
printGroup("Live listings missing postcode", report.liveMissingPostcode);
printGroup("Live listings missing street address", report.liveMissingStreet);
printGroup("Live listings missing website", report.liveMissingWebsite);
printGroup("Live listings missing phone", report.liveMissingPhone);
printGroup("Live listings missing pricing", report.liveMissingPricing);
printGroup("Secondary-verification live listings", report.liveSecondaryVerification);
printDuplicates("Duplicate phone numbers", report.duplicatePhones);
printDuplicates("Duplicate websites", report.duplicateWebsites);
printDuplicates("Duplicate postcodes", report.duplicatePostcodes);
printGroup("Suspicious duplicate city/region values", report.suspiciousCityRegion);
console.log(`Unknown categories: ${report.unknownCategories.length === 0 ? "none" : report.unknownCategories.join(", ")}`);
console.log(`Inconsistent equipment labels: ${report.inconsistentEquipment.length}`);
for (const item of report.inconsistentEquipment) {
  console.log(`  - "${item.raw}" → "${item.normalised}" [${item.listings.join(", ")}]`);
}
printGroup("Records where pricing exists only in pricing.summary", report.pricingSummaryOnly);
console.log("Integrity: passed");
console.log("Missing optional fields are reported above and do not fail this audit.");

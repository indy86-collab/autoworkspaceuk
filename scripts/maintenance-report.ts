import fs from "node:fs";
import path from "node:path";
import { buildMaintenanceReport, type NamedRecord } from "../src/lib/data-quality";
import { STALE_AFTER_DAYS } from "../src/lib/verification";
import { parseListings } from "../src/lib/validate-listings";

function printGroup(title: string, records: readonly NamedRecord[]): void {
  console.log(`${title}: ${records.length}`);
  for (const record of records) {
    const extra = record.detail ? ` (${record.detail})` : "";
    console.log(`  - ${record.slug} — ${record.name}${extra}`);
  }
}

const rawPath = path.join(process.cwd(), "src/data/listings.json");
const listings = parseListings(JSON.parse(fs.readFileSync(rawPath, "utf8")));
const report = buildMaintenanceReport(listings);

console.log("AutoWorkspace UK maintenance report (internal)");
console.log("==============================================");
console.log("This output is for local review. It is not a public route.");
printGroup("Listings needing address completion", report.addressCompletion);
printGroup("Listings needing first-party verification", report.firstPartyVerification);
printGroup("Listings missing pricing", report.missingPricing);
printGroup(`Listings not checked recently (>${STALE_AFTER_DAYS} days)`, report.notCheckedRecently);
printGroup("Review records potentially ready for promotion", report.reviewReadyForPromotion);

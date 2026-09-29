import fs from "node:fs";
import path from "node:path";
import { buildPrelaunchDataReview, prelaunchDataReviewMarkdown } from "../src/lib/prelaunch-review";
import { parseListings } from "../src/lib/validate-listings";

const listings = parseListings(JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/listings.json"), "utf8")));
const report = buildPrelaunchDataReview(listings);
const outDir = path.join(process.cwd(), "reports");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "prelaunch-data-review.json"), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "prelaunch-data-review.md"), prelaunchDataReviewMarkdown(report));
console.log(`Wrote reports/prelaunch-data-review.json and reports/prelaunch-data-review.md`);
console.log(`Live address gaps: ${report.addressCompletion.length}`);
console.log(`Secondary-verified live records: ${report.secondaryVerification.length}`);
console.log(`Pricing summary-only live records: ${report.pricingReview.length}`);
console.log(`Review candidates: ${report.reviewCandidates.map((item) => item.name).join(", ")}`);

import { hasAnyNumericPrice } from "@/lib/public-listing";
import { verificationSourceSummary } from "@/lib/verification";
import type { Listing, ListingAddress } from "@/lib/types";

export interface AddressCompletionIssue {
  listingId: string;
  name: string;
  currentKnownAddress: ListingAddress;
  currentKnownAddressLabel: string;
  sourceUrl: string;
  missingFields: string[];
}

export interface SecondaryVerificationIssue {
  listingId: string;
  name: string;
  sourceUrl: string;
  lastVerified: string;
  verificationLevel: Listing["verification_level"];
  evidence: string;
  suggestedAction: "re-check first-party site / contact operator";
}

export interface PricingReviewIssue {
  listingId: string;
  name: string;
  pricingSummary: string;
  structuredHourlyAbsent: boolean;
  structuredHalfDayAbsent: boolean;
  structuredDayAbsent: boolean;
  structuredValuesAbsent: boolean;
}

export interface ReviewCandidate {
  listingId: string;
  slug: string;
  name: string;
  publishStatus: Listing["publish_status"];
  verificationLevel: Listing["verification_level"];
  sourceUrl: string;
  website: string | null;
  lastVerified: string;
  whyFlagged: string;
  remainingEvidence: string[];
  suggestedAction: string;
}

export interface PrelaunchDataReview {
  generatedAt: string;
  note: string;
  counts: {
    total: number;
    live: number;
    review: number;
    comingSoon: number;
    hold: number;
  };
  addressCompletion: AddressCompletionIssue[];
  secondaryVerification: SecondaryVerificationIssue[];
  pricingReview: PricingReviewIssue[];
  reviewCandidates: ReviewCandidate[];
}

function knownAddressLabel(address: ListingAddress): string {
  const parts = [address.line1, address.city, address.region, address.postcode].filter(
    (part): part is string => Boolean(part?.trim()),
  );
  return parts.length > 0 ? parts.join(", ") : "No address parts recorded";
}

function missingAddressFields(address: ListingAddress): string[] {
  const missing: string[] = [];
  if (!address.postcode?.trim()) {
    missing.push("postcode");
  }
  if (!address.line1?.trim()) {
    missing.push("street address");
  }
  if (!address.city.trim()) {
    missing.push("town");
  }
  if (!address.region?.trim()) {
    missing.push("region");
  }
  return missing;
}

function secondaryEvidence(listing: Listing): string {
  const parts = [
    `Internal verification level is ${listing.verification_level} (${verificationSourceSummary(listing.verification_level)}).`,
    listing.notes?.trim() || "No research note is recorded for this listing.",
    listing.website ? `A website URL is recorded: ${listing.website}.` : "No first-party website URL is recorded.",
  ];
  return parts.join(" ");
}

const NAMED_REVIEW_CANDIDATES = new Set(["bold-hydrographics-alcester", "diy-garage-stretford"]);

function reviewCandidateWhy(listing: Listing): { whyFlagged: string; remainingEvidence: string[] } {
  if (listing.id === "bold-hydrographics-alcester") {
    return {
      whyFlagged:
        "Has a recorded website, street, town, region, and postcode. Secondary directories associate the business with spray/hydrographics facilities, but current evidence describes operator-provided dipping/painting services rather than confirmed external booth or tank hire.",
      remainingEvidence: [
        "Confirm on the first-party site (or by contacting the operator) that external customers can currently hire the spray booth or hydrographics tank.",
        "Do not parse or invent pricing; current summary is “Not confirmed.”",
        "Do not promote from directory wording alone.",
      ],
    };
  }
  if (listing.id === "diy-garage-stretford") {
    return {
      whyFlagged:
        "Has a recorded website and a street, town, region, and postcode. Secondary UK profiles describe a workshop for hire, but the recorded website currently resolves to a different (US) DIY garage brand rather than current UK hire terms.",
      remainingEvidence: [
        "Obtain current first-party UK evidence (or operator confirmation) that external customers can still hire the Stretford workspace.",
        "Confirm that the Stretford Motorway Estate address is still the operating site.",
        "Do not promote from Hotfrog/TouchManchester wording alone; current public rates were not verified.",
      ],
    };
  }

  const place = listing.address.line1 || listing.address.postcode;
  return {
    whyFlagged: [
      listing.website ? "A website URL is recorded." : "No website URL is recorded.",
      place ? "A street or postcode is recorded." : "Street and postcode are both missing.",
      `Verification is ${listing.verification_level}.`,
    ].join(" "),
    remainingEvidence: ["Obtain current first-party evidence before any promotion.", "Do not change publish_status automatically."],
  };
}

export function buildPrelaunchDataReview(listings: readonly Listing[], now: Date = new Date()): PrelaunchDataReview {
  const live = listings.filter((listing) => listing.publish_status === "live");
  const review = listings.filter((listing) => listing.publish_status === "review");

  const autoCandidates = review.filter((listing) => {
    if (listing.verification_level === "conflicting") {
      return false;
    }
    const hasPlace = Boolean(listing.address.line1 || listing.address.postcode);
    return Boolean(listing.website) && hasPlace;
  });

  const named = review.filter((listing) => NAMED_REVIEW_CANDIDATES.has(listing.id));
  const merged = [...named, ...autoCandidates.filter((listing) => !NAMED_REVIEW_CANDIDATES.has(listing.id))];

  return {
    generatedAt: now.toISOString().slice(0, 10),
    note: "Internal launch review only. Missing fields were not invented. No listing was promoted or edited.",
    counts: {
      total: listings.length,
      live: live.length,
      review: review.length,
      comingSoon: listings.filter((listing) => listing.publish_status === "coming_soon").length,
      hold: listings.filter((listing) => listing.publish_status === "hold").length,
    },
    addressCompletion: live
      .map((listing) => {
        const missingFields = missingAddressFields(listing.address);
        if (missingFields.length === 0) {
          return null;
        }
        return {
          listingId: listing.id,
          name: listing.name,
          currentKnownAddress: listing.address,
          currentKnownAddressLabel: knownAddressLabel(listing.address),
          sourceUrl: listing.source_url,
          missingFields,
        };
      })
      .filter((item): item is AddressCompletionIssue => item !== null),
    secondaryVerification: live
      .filter((listing) => listing.verification_level !== "first_party")
      .map((listing) => ({
        listingId: listing.id,
        name: listing.name,
        sourceUrl: listing.source_url,
        lastVerified: listing.last_verified,
        verificationLevel: listing.verification_level,
        evidence: secondaryEvidence(listing),
        suggestedAction: "re-check first-party site / contact operator",
      })),
    pricingReview: live
      .filter((listing) => !hasAnyNumericPrice(listing.pricing) && Boolean(listing.pricing.summary?.trim()))
      .map((listing) => ({
        listingId: listing.id,
        name: listing.name,
        pricingSummary: listing.pricing.summary ?? "",
        structuredHourlyAbsent: listing.pricing.hourly_from_gbp == null,
        structuredHalfDayAbsent: listing.pricing.half_day_from_gbp == null,
        structuredDayAbsent: listing.pricing.day_from_gbp == null,
        structuredValuesAbsent: true,
      })),
    reviewCandidates: merged.map((listing) => {
      const copy = reviewCandidateWhy(listing);
      return {
        listingId: listing.id,
        slug: listing.slug,
        name: listing.name,
        publishStatus: listing.publish_status,
        verificationLevel: listing.verification_level,
        sourceUrl: listing.source_url,
        website: listing.website,
        lastVerified: listing.last_verified,
        whyFlagged: copy.whyFlagged,
        remainingEvidence: copy.remainingEvidence,
        suggestedAction: "Manual review only. Do not promote automatically.",
      };
    }),
  };
}

export function prelaunchDataReviewMarkdown(report: PrelaunchDataReview): string {
  const lines: string[] = [
    "# Prelaunch data review",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    report.note,
    "",
    "## Counts",
    "",
    `- Total records: ${report.counts.total}`,
    `- Live: ${report.counts.live}`,
    `- Review: ${report.counts.review}`,
    `- Coming soon: ${report.counts.comingSoon}`,
    `- Hold: ${report.counts.hold}`,
    "",
    "## Address completion",
    "",
    "Live records missing at least one of postcode, street address, town, or region. Known parts are shown as recorded. Missing values were not invented.",
    "",
  ];

  if (report.addressCompletion.length === 0) {
    lines.push("None.");
  } else {
    for (const item of report.addressCompletion) {
      lines.push(`### ${item.name}`);
      lines.push("");
      lines.push(`- Listing ID: \`${item.listingId}\``);
      lines.push(`- Current known address: ${item.currentKnownAddressLabel}`);
      lines.push(`- Source URL: ${item.sourceUrl}`);
      lines.push(`- Missing fields: ${item.missingFields.join(", ")}`);
      lines.push("");
    }
  }

  lines.push("## Secondary verification", "");
  lines.push("Live records whose verification is not first-party.", "");

  if (report.secondaryVerification.length === 0) {
    lines.push("None.");
  } else {
    for (const item of report.secondaryVerification) {
      lines.push(`### ${item.name}`);
      lines.push("");
      lines.push(`- Listing ID: \`${item.listingId}\``);
      lines.push(`- Source URL: ${item.sourceUrl}`);
      lines.push(`- Last verified: ${item.lastVerified}`);
      lines.push(`- Evidence currently supporting publication: ${item.evidence}`);
      lines.push(`- Suggested action: ${item.suggestedAction}`);
      lines.push("");
    }
  }

  lines.push("## Pricing review", "");
  lines.push(
    "Live records where price information exists only inside `pricing.summary`. Free text was not parsed into structured hourly, half-day, or day values.",
    "",
  );

  if (report.pricingReview.length === 0) {
    lines.push("None.");
  } else {
    for (const item of report.pricingReview) {
      lines.push(`### ${item.name}`);
      lines.push("");
      lines.push(`- Listing ID: \`${item.listingId}\``);
      lines.push(`- Pricing summary: ${item.pricingSummary}`);
      lines.push(
        `- Structured hourly / half-day / day values absent: ${item.structuredValuesAbsent ? "yes" : "no"} (hourly ${item.structuredHourlyAbsent ? "absent" : "present"}, half-day ${item.structuredHalfDayAbsent ? "absent" : "present"}, day ${item.structuredDayAbsent ? "absent" : "present"})`,
      );
      lines.push("");
    }
  }

  lines.push("## Review candidates", "");
  lines.push("These records may be ready for a person to re-check. Nothing was promoted.", "");

  if (report.reviewCandidates.length === 0) {
    lines.push("None.");
  } else {
    for (const item of report.reviewCandidates) {
      lines.push(`### ${item.name}`);
      lines.push("");
      lines.push(`- Listing ID: \`${item.listingId}\``);
      lines.push(`- Status: ${item.publishStatus} / ${item.verificationLevel}`);
      lines.push(`- Current source: ${item.sourceUrl}`);
      if (item.website) {
        lines.push(`- Recorded website: ${item.website}`);
      }
      lines.push(`- Last verified: ${item.lastVerified}`);
      lines.push(`- Why flagged: ${item.whyFlagged}`);
      lines.push("- Final evidence still required:");
      for (const evidence of item.remainingEvidence) {
        lines.push(`  - ${evidence}`);
      }
      lines.push(`- ${item.suggestedAction}`);
      lines.push("");
    }
  }

  return `${lines.join("\n").trim()}\n`;
}

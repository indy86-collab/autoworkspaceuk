import type { Listing, VerificationLevel } from "@/lib/types";

export const VERIFIED_LISTING_LABEL = "Verified listing";
export const DETAILS_TO_CHECK_LABEL = "Details to check";

export const VERIFIED_LISTING_HELP =
  "We found current published evidence that external customers can hire or use this automotive workspace.";

/** Days after last_verified before a record is treated as potentially stale internally. */
export const STALE_AFTER_DAYS = 180;

export type VerificationFreshness = "checked_recently" | "potentially_stale";

export interface VerificationAge {
  days: number;
  freshness: VerificationFreshness;
}

export interface PublicVerification {
  label: typeof VERIFIED_LISTING_LABEL | typeof DETAILS_TO_CHECK_LABEL;
  help: string;
  note: string;
}

/**
 * Maps internal verification_level to public wording.
 * Raw codes such as first_party or marketplace_current are never returned.
 */
export function publicVerification(listing: Pick<Listing, "verification_level">): PublicVerification {
  const conflicting = listing.verification_level === "conflicting";
  const note = verificationSourceNote(listing.verification_level);
  return {
    label: conflicting ? DETAILS_TO_CHECK_LABEL : VERIFIED_LISTING_LABEL,
    help: conflicting ? note : VERIFIED_LISTING_HELP,
    note,
  };
}

/**
 * Internal helper for ranking, insights, and maintenance. The returned prose
 * still avoids raw verification codes.
 */
export function verificationSourceNote(level: VerificationLevel): string {
  switch (level) {
    case "first_party":
      return "Checked against information published by the facility.";
    case "secondary":
      return "Checked against another current published source, not the facility's own website.";
    case "marketplace_current":
      return "A current marketplace listing described this workspace as available to hire.";
    case "conflicting":
      return "The sources checked do not agree, so treat the price and contact details as unresolved.";
  }
}

/** Dataset-report wording for how evidence was checked. Not a public badge. */
export function verificationSourceSummary(level: VerificationLevel): string {
  switch (level) {
    case "first_party":
      return "Facility's own published information";
    case "secondary":
      return "Another current published source";
    case "marketplace_current":
      return "A current marketplace listing";
    case "conflicting":
      return "Published sources that do not agree";
  }
}

/**
 * Age of the last_verified date. Used for internal maintenance only.
 * Does not unpublish records and must not drive public stale warnings yet.
 */
export function getVerificationAge(lastVerified: string, now: Date = new Date()): VerificationAge {
  const date = new Date(`${lastVerified}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return { days: Number.POSITIVE_INFINITY, freshness: "potentially_stale" };
  }

  const days = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86_400_000));
  return {
    days,
    freshness: days > STALE_AFTER_DAYS ? "potentially_stale" : "checked_recently",
  };
}

export const PUBLISH_STATUSES = ["live", "review", "coming_soon", "hold"] as const;

export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export const VERIFICATION_LEVELS = [
  "first_party",
  "secondary",
  "marketplace_current",
  "conflicting",
] as const;

export type VerificationLevel = (typeof VERIFICATION_LEVELS)[number];

export const AUDIENCES = ["consumer", "trade"] as const;

export type Audience = (typeof AUDIENCES)[number];

export interface ListingAddress {
  line1: string | null;
  city: string;
  region: string | null;
  postcode: string | null;
  country: "GB";
}

export interface ListingPricing {
  hourly_from_gbp?: number;
  half_day_from_gbp?: number;
  day_from_gbp?: number;
  week_from_gbp?: number;
  /**
   * Monthly starting price. Older files may say `month_from_gbp`; the parser
   * stores that value here when `monthly_from_gbp` is absent.
   */
  monthly_from_gbp?: number;
  /** True only when the source says the recorded rates exclude VAT. */
  vat_excluded?: boolean;
  summary?: string;
}

export interface Listing {
  id: string;
  slug: string;
  name: string;
  publish_status: PublishStatus;
  verification_level: VerificationLevel;
  primary_category: string;
  categories: string[];
  audience: Audience[];
  address: ListingAddress;
  phone: string | null;
  email: string | null;
  website: string | null;
  pricing: ListingPricing;
  equipment: string[];
  /**
   * Research notes. Public pages use a cleaned overview, not this text verbatim.
   */
  notes?: string;
  /** Evidence URL kept for verification. Not shown on the public listing page. */
  source_url: string;
  last_verified: string;
  /** Limits recorded for the facility, such as vehicle type or prohibited work. */
  restrictions?: string[];
  /** Vehicle capacity when the source states one. Not inferred. */
  vehicle_capacity?: string;
}

export const DIRECTORY_REQUEST_KINDS = ["listing_suggestion", "listing_report", "listing_claim"] as const;

export type DirectoryRequestKind = (typeof DIRECTORY_REQUEST_KINDS)[number];

export const REPORT_ISSUES = [
  "closed",
  "address",
  "pricing",
  "contact",
  "no_longer_hire",
  "other",
] as const;

export type ReportIssue = (typeof REPORT_ISSUES)[number];

export const AUDIENCE_CHOICES = ["consumer", "trade", "both"] as const;

export type AudienceChoice = (typeof AUDIENCE_CHOICES)[number];

export interface ListingSuggestionRequest {
  kind: "listing_suggestion";
  businessName: string;
  website: string;
  address: string;
  city: string;
  postcode: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  categories: string[];
  audience: AudienceChoice;
  description: string;
  pricing: string;
  equipment: string;
  evidenceUrl: string;
  notes: string;
  hireConfirmation: boolean;
}

export interface ListingReportRequest {
  kind: "listing_report";
  listingId: string;
  listingName: string;
  listingUrl: string;
  issue: ReportIssue;
  details: string;
  sourceUrl: string;
  reporterEmail: string;
}

export interface ListingClaimRequest {
  kind: "listing_claim";
  listingId: string;
  listingName: string;
  listingUrl: string;
  name: string;
  role: string;
  businessEmail: string;
  businessPhone: string;
  requestedChanges: string;
  ownershipEvidence: string;
}

export type DirectoryRequest = ListingSuggestionRequest | ListingReportRequest | ListingClaimRequest;

/** @deprecated Use ListingSuggestionRequest. Kept so older imports still type-check. */
export type ListingSubmission = Omit<ListingSuggestionRequest, "kind" | "city" | "contactEmail" | "audience" | "evidenceUrl" | "notes" | "hireConfirmation"> & {
  email: string;
  evidence: string;
};


import { getPublicCategories } from "@/lib/categories";
import { sanitizeEmailSubject } from "@/lib/email-sanitize";
import {
  AUDIENCE_CHOICES,
  DIRECTORY_REQUEST_KINDS,
  REPORT_ISSUES,
  type AudienceChoice,
  type DirectoryRequest,
  type DirectoryRequestKind,
  type ReportIssue,
} from "@/lib/types";

export const FIELD_LIMITS = {
  businessName: 200,
  website: 500,
  address: 300,
  city: 120,
  postcode: 16,
  contactName: 120,
  contactEmail: 254,
  phone: 40,
  description: 4000,
  pricing: 2000,
  equipment: 2000,
  evidenceUrl: 500,
  notes: 2000,
  listingId: 80,
  listingName: 200,
  listingUrl: 500,
  details: 4000,
  sourceUrl: 500,
  reporterEmail: 254,
  name: 120,
  role: 120,
  businessEmail: 254,
  businessPhone: 40,
  requestedChanges: 4000,
  ownershipEvidence: 4000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/\S+$/i;
const RETURN_PATHS = new Set(["/add-listing", "/report", "/claim-listing"]);

export const REPORT_ISSUE_LABELS: Record<ReportIssue, string> = {
  closed: "Business has closed",
  address: "Address is wrong",
  pricing: "Pricing is wrong",
  contact: "Contact information is wrong",
  no_longer_hire: "Facility no longer offers workspace hire",
  other: "Other",
};

export interface DirectoryRequestParseResult {
  ok: true;
  request: DirectoryRequest;
}

export interface DirectoryRequestParseError {
  ok: false;
  errors: string[];
}

export type ParsedDirectoryRequest = DirectoryRequestParseResult | DirectoryRequestParseError;

function readString(input: Record<string, unknown>, key: string): string {
  const value = input[key];
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\r\n/g, "\n").trim();
}

function readLimited(input: Record<string, unknown>, key: keyof typeof FIELD_LIMITS, required: boolean, errors: string[], label: string): string {
  const value = readString(input, key);
  if (required && !value) {
    errors.push(`${label} is required.`);
    return "";
  }
  if (value.length > FIELD_LIMITS[key]) {
    errors.push(`${label} is too long.`);
  }
  return value;
}

function readEmail(input: Record<string, unknown>, key: keyof typeof FIELD_LIMITS, required: boolean, errors: string[], label: string): string {
  const value = readLimited(input, key, required, errors, label);
  if (value && !EMAIL_PATTERN.test(value)) {
    errors.push(`${label} must be a valid email address.`);
  }
  return value;
}

function readUrl(input: Record<string, unknown>, key: keyof typeof FIELD_LIMITS, required: boolean, errors: string[], label: string): string {
  const value = readLimited(input, key, required, errors, label);
  if (value && !URL_PATTERN.test(value)) {
    errors.push(`${label} must be an http(s) URL.`);
  }
  return value;
}

function readOptionalUrl(input: Record<string, unknown>, key: keyof typeof FIELD_LIMITS, errors: string[], label: string): string {
  const value = readLimited(input, key, false, errors, label);
  if (value && !URL_PATTERN.test(value)) {
    errors.push(`${label} must be an http(s) URL.`);
  }
  return value;
}

function readCategories(input: Record<string, unknown>, errors: string[]): string[] {
  const raw = input.categories;
  const values = Array.isArray(raw) ? raw : typeof raw === "string" && raw ? [raw] : [];
  const allowed = new Set(getPublicCategories().map((category) => category.slug));
  const categories: string[] = [];

  for (const value of values) {
    if (typeof value !== "string" || !value.trim()) {
      continue;
    }
    if (!allowed.has(value)) {
      errors.push("Choose a recognised workspace type.");
      continue;
    }
    if (!categories.includes(value)) {
      categories.push(value);
    }
  }

  if (categories.length === 0) {
    errors.push("Select at least one workspace type.");
  }
  if (categories.length > 12) {
    errors.push("Select fewer workspace types.");
  }

  return categories;
}

function isChecked(input: Record<string, unknown>, key: string): boolean {
  const value = input[key];
  if (value === true || value === "true" || value === "on" || value === "yes") {
    return true;
  }
  return false;
}

export function parseDirectoryRequest(kind: string, input: Record<string, unknown>): ParsedDirectoryRequest {
  if (!DIRECTORY_REQUEST_KINDS.includes(kind as DirectoryRequestKind)) {
    return { ok: false, errors: ["Unknown submission type."] };
  }

  const errors: string[] = [];

  if (kind === "listing_suggestion") {
    const businessName = readLimited(input, "businessName", true, errors, "Business name");
    const website = readOptionalUrl(input, "website", errors, "Website");
    const address = readLimited(input, "address", false, errors, "Address");
    const city = readLimited(input, "city", true, errors, "Town / city");
    const postcode = readLimited(input, "postcode", false, errors, "Postcode");
    const contactName = readLimited(input, "contactName", true, errors, "Contact name");
    const contactEmail = readEmail(input, "contactEmail", true, errors, "Contact email");
    const phone = readLimited(input, "phone", false, errors, "Phone");
    const categories = readCategories(input, errors);
    const audienceRaw = readString(input, "audience");
    if (!AUDIENCE_CHOICES.includes(audienceRaw as AudienceChoice)) {
      errors.push("Choose who can use the workspace.");
    }
    const description = readLimited(input, "description", true, errors, "Description of workspace");
    const pricing = readLimited(input, "pricing", false, errors, "Pricing information");
    const equipment = readLimited(input, "equipment", false, errors, "Equipment/facilities");
    const evidenceUrl = readUrl(input, "evidenceUrl", true, errors, "Evidence URL");
    const notes = readLimited(input, "notes", false, errors, "Notes");
    const hireConfirmation = isChecked(input, "hireConfirmation");
    if (!hireConfirmation) {
      errors.push("Confirm that this business allows external customers or businesses to hire or use automotive workspace or equipment.");
    }

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    return {
      ok: true,
      request: {
        kind,
        businessName,
        website,
        address,
        city,
        postcode,
        contactName,
        contactEmail,
        phone,
        categories,
        audience: audienceRaw as AudienceChoice,
        description,
        pricing,
        equipment,
        evidenceUrl,
        notes,
        hireConfirmation,
      },
    };
  }

  if (kind === "listing_report") {
    const listingId = readLimited(input, "listingId", false, errors, "Listing ID");
    const listingName = readLimited(input, "listingName", false, errors, "Listing name");
    const listingUrl = readOptionalUrl(input, "listingUrl", errors, "Listing URL");
    const issueRaw = readString(input, "issue");
    if (!REPORT_ISSUES.includes(issueRaw as ReportIssue)) {
      errors.push("Choose what is incorrect.");
    }
    const details = readLimited(input, "details", true, errors, "Correction / details");
    const sourceUrl = readOptionalUrl(input, "sourceUrl", errors, "Source URL");
    const reporterEmail = readEmail(input, "reporterEmail", false, errors, "Your email");

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    return {
      ok: true,
      request: {
        kind,
        listingId,
        listingName,
        listingUrl,
        issue: issueRaw as ReportIssue,
        details,
        sourceUrl,
        reporterEmail,
      },
    };
  }

  const listingId = readLimited(input, "listingId", false, errors, "Listing ID");
  const listingName = readLimited(input, "listingName", false, errors, "Listing name");
  const listingUrl = readOptionalUrl(input, "listingUrl", errors, "Listing URL");
  const name = readLimited(input, "name", true, errors, "Name");
  const role = readLimited(input, "role", true, errors, "Role at business");
  const businessEmail = readEmail(input, "businessEmail", true, errors, "Business email");
  const businessPhone = readLimited(input, "businessPhone", false, errors, "Business phone");
  const requestedChanges = readLimited(input, "requestedChanges", true, errors, "Requested changes");
  const ownershipEvidence = readLimited(input, "ownershipEvidence", true, errors, "Evidence of ownership or association");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    request: {
      kind: "listing_claim",
      listingId,
      listingName,
      listingUrl,
      name,
      role,
      businessEmail,
      businessPhone,
      requestedChanges,
      ownershipEvidence,
    },
  };
}

export function safeReturnPath(value: string | null | undefined, fallback: string): string {
  const raw = value?.trim() || fallback;
  try {
    const url = new URL(raw, "https://www.autoworkspace.uk");
    if (!RETURN_PATHS.has(url.pathname)) {
      return fallback;
    }
    const listing = url.searchParams.get("listing");
    if (listing && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(listing)) {
      return `${url.pathname}?listing=${listing}`;
    }
    return url.pathname;
  } catch {
    return fallback;
  }
}

export function formRecordFromFormData(formData: FormData): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  const categories: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") {
      continue;
    }
    if (key === "categories") {
      categories.push(value);
      continue;
    }
    record[key] = value;
  }

  if (categories.length > 0) {
    record.categories = categories;
  }

  return record;
}

export function requestEmailSubject(request: DirectoryRequest): string {
  const subject = (() => {
    switch (request.kind) {
      case "listing_suggestion":
        return `[AutoWorkspace UK] Listing suggestion: ${request.businessName}`;
      case "listing_report":
        return `[AutoWorkspace UK] Report: ${REPORT_ISSUE_LABELS[request.issue]}${request.listingName ? ` — ${request.listingName}` : ""}`;
      case "listing_claim":
        return `[AutoWorkspace UK] Claim or update: ${request.listingName || request.name}`;
    }
  })();
  return sanitizeEmailSubject(subject);
}

export function requestEmailText(request: DirectoryRequest): string {
  const lines = ["Manual review required. Do not publish automatically.", ""];

  switch (request.kind) {
    case "listing_suggestion":
      lines.push(
        "Type: listing suggestion",
        `Business name: ${request.businessName}`,
        `Website: ${request.website || "—"}`,
        `Address: ${request.address || "—"}`,
        `Town / city: ${request.city}`,
        `Postcode: ${request.postcode || "—"}`,
        `Contact name: ${request.contactName}`,
        `Contact email: ${request.contactEmail}`,
        `Phone: ${request.phone || "—"}`,
        `Workspace types: ${request.categories.join(", ")}`,
        `Who can use it: ${request.audience}`,
        "",
        "Description:",
        request.description,
        "",
        "Pricing:",
        request.pricing || "—",
        "",
        "Equipment/facilities:",
        request.equipment || "—",
        "",
        `Evidence URL: ${request.evidenceUrl}`,
        "",
        "Notes:",
        request.notes || "—",
        "",
        "Hire confirmation: yes",
      );
      break;
    case "listing_report":
      lines.push(
        "Type: listing report",
        `Listing ID: ${request.listingId || "—"}`,
        `Listing name: ${request.listingName || "—"}`,
        `Listing URL: ${request.listingUrl || "—"}`,
        `Issue: ${REPORT_ISSUE_LABELS[request.issue]}`,
        "",
        "Correction / details:",
        request.details,
        "",
        `Source URL: ${request.sourceUrl || "—"}`,
        `Reporter email: ${request.reporterEmail || "—"}`,
      );
      break;
    case "listing_claim":
      lines.push(
        "Type: claim or update listing",
        `Listing ID: ${request.listingId || "—"}`,
        `Listing name: ${request.listingName || "—"}`,
        `Listing URL: ${request.listingUrl || "—"}`,
        `Name: ${request.name}`,
        `Role at business: ${request.role}`,
        `Business email: ${request.businessEmail}`,
        `Business phone: ${request.businessPhone || "—"}`,
        "",
        "Requested changes:",
        request.requestedChanges,
        "",
        "Evidence of ownership/association:",
        request.ownershipEvidence,
      );
      break;
  }

  return lines.join("\n");
}

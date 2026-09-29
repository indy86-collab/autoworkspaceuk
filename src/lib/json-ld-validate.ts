import type { Listing } from "@/lib/types";

const FORBIDDEN_LOCAL_BUSINESS_KEYS = [
  "aggregateRating",
  "review",
  "reviews",
  "geo",
  "latitude",
  "longitude",
  "openingHours",
  "openingHoursSpecification",
  "priceRange",
  "image",
  "images",
] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function requireType(data: Record<string, unknown>, expected: string, errors: string[]): void {
  if (data["@context"] !== "https://schema.org") {
    errors.push(`${expected} JSON-LD is missing schema.org context`);
  }
  if (data["@type"] !== expected) {
    errors.push(`JSON-LD type is ${String(data["@type"])}, expected ${expected}`);
  }
}

export function validateWebsiteJsonLd(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  requireType(data, "WebSite", errors);
  if (typeof data.name !== "string" || !data.name.trim()) {
    errors.push("WebSite JSON-LD is missing name");
  }
  if (typeof data.url !== "string" || !data.url.trim()) {
    errors.push("WebSite JSON-LD is missing url");
  }
  return errors;
}

export function validateBreadcrumbJsonLd(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  requireType(data, "BreadcrumbList", errors);
  const items = data.itemListElement;
  if (!Array.isArray(items) || items.length === 0) {
    errors.push("BreadcrumbList JSON-LD has no items");
    return errors;
  }
  items.forEach((item, index) => {
    const record = asRecord(item);
    if (!record) {
      errors.push(`Breadcrumb item ${index + 1} is not an object`);
      return;
    }
    if (record["@type"] !== "ListItem") {
      errors.push(`Breadcrumb item ${index + 1} is not a ListItem`);
    }
    if (record.position !== index + 1) {
      errors.push(`Breadcrumb item ${index + 1} has the wrong position`);
    }
    if (typeof record.name !== "string" || !record.name.trim()) {
      errors.push(`Breadcrumb item ${index + 1} is missing a name`);
    }
    if (typeof record.item !== "string" || !record.item.trim()) {
      errors.push(`Breadcrumb item ${index + 1} is missing an item URL`);
    }
  });
  return errors;
}

export function validateArticleJsonLd(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  requireType(data, "Article", errors);
  for (const key of ["headline", "description", "datePublished", "dateModified", "mainEntityOfPage"] as const) {
    if (typeof data[key] !== "string" || !String(data[key]).trim()) {
      errors.push(`Article JSON-LD is missing ${key}`);
    }
  }
  return errors;
}

export function validateLocalBusinessJsonLd(data: Record<string, unknown>, listing: Listing): string[] {
  const errors: string[] = [];
  requireType(data, "LocalBusiness", errors);

  for (const key of FORBIDDEN_LOCAL_BUSINESS_KEYS) {
    if (key in data) {
      errors.push(`LocalBusiness JSON-LD includes unsupported field ${key}`);
    }
  }

  if (typeof data.name !== "string" || data.name !== listing.name) {
    errors.push("LocalBusiness JSON-LD name does not match the listing");
  }

  if ("telephone" in data) {
    if (!listing.phone) {
      errors.push("LocalBusiness JSON-LD includes telephone without a recorded phone");
    } else if (data.telephone !== listing.phone) {
      errors.push("LocalBusiness JSON-LD telephone does not match the listing");
    }
  }

  if ("email" in data) {
    if (!listing.email) {
      errors.push("LocalBusiness JSON-LD includes email without a recorded email");
    } else if (data.email !== listing.email) {
      errors.push("LocalBusiness JSON-LD email does not match the listing");
    }
  }

  const address = asRecord(data.address);
  if (!address) {
    errors.push("LocalBusiness JSON-LD is missing address");
    return errors;
  }
  if (address["@type"] !== "PostalAddress") {
    errors.push("LocalBusiness address is not a PostalAddress");
  }
  if (address.addressCountry !== "GB") {
    errors.push("LocalBusiness addressCountry must be GB");
  }
  if (address.addressLocality !== listing.address.city) {
    errors.push("LocalBusiness addressLocality does not match the recorded town");
  }
  if ("streetAddress" in address) {
    if (!listing.address.line1) {
      errors.push("LocalBusiness JSON-LD includes streetAddress without a recorded street");
    } else if (address.streetAddress !== listing.address.line1) {
      errors.push("LocalBusiness streetAddress does not match the listing");
    }
  }
  if ("postalCode" in address) {
    if (!listing.address.postcode) {
      errors.push("LocalBusiness JSON-LD includes postalCode without a recorded postcode");
    } else if (address.postalCode !== listing.address.postcode) {
      errors.push("LocalBusiness postalCode does not match the listing");
    }
  }
  if ("addressRegion" in address && !listing.address.region) {
    errors.push("LocalBusiness JSON-LD includes addressRegion without a recorded region");
  }

  return errors;
}

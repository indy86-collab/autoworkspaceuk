import { publicOverview } from "@/lib/public-listing";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Listing } from "@/lib/types";

export interface BreadcrumbJsonItem {
  name: string;
  path: string;
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/browse?location={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(article: {
  headline: string;
  description: string;
  path: string;
  published: string;
  updated: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    inLanguage: "en-GB",
    datePublished: article.published,
    dateModified: article.updated,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: absoluteUrl(article.path),
  };
}

export function breadcrumbJsonLd(items: readonly BreadcrumbJsonItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: readonly { question: string; answer: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * LocalBusiness is emitted when the record has a name, a town, and at least
 * one of a street, postcode, phone, or website. Ratings, reviews, opening
 * hours, price ranges, and coordinates are never added.
 */
export function localBusinessJsonLd(listing: Listing): Record<string, unknown> | null {
  const hasAnchor = Boolean(listing.address.line1 || listing.address.postcode || listing.phone || listing.website);
  if (!listing.name || !listing.address.city || !hasAnchor) {
    return null;
  }

  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressLocality: listing.address.city,
    addressCountry: "GB",
  };

  if (listing.address.line1) {
    address.streetAddress = listing.address.line1;
  }
  if (listing.address.region && listing.address.region.toLowerCase() !== listing.address.city.toLowerCase()) {
    address.addressRegion = listing.address.region;
  }
  if (listing.address.postcode) {
    address.postalCode = listing.address.postcode;
  }

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    address,
    url: listing.website ?? absoluteUrl(`/listing/${listing.slug}`),
    mainEntityOfPage: absoluteUrl(`/listing/${listing.slug}`),
    areaServed: { "@type": "City", name: listing.address.city },
  };

  if (listing.phone) {
    data.telephone = listing.phone;
  }
  if (listing.email) {
    data.email = listing.email;
  }
  const description = publicOverview(listing);
  if (description) {
    data.description = description;
  }

  const prices = [listing.pricing.hourly_from_gbp, listing.pricing.half_day_from_gbp, listing.pricing.day_from_gbp].filter(
    (value): value is number => typeof value === "number",
  );
  if (prices.length > 0) {
    data.makesOffer = {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: Math.min(...prices),
      url: listing.website ?? absoluteUrl(`/listing/${listing.slug}`),
      availability: "https://schema.org/InStock",
    };
  }

  return data;
}

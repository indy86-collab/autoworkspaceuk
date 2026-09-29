import { getPublishedGuides } from "@/lib/guides";
import { getLiveListings, getPopulatedCategories } from "@/lib/listings";
import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticPages = [
    "/",
    "/categories",
    "/about",
    "/guides",
    "/insights",
    "/insights/uk-automotive-workspace-report",
    "/methodology",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified,
  }));
  const guidePages = getPublishedGuides().map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: new Date(`${guide.updated}T00:00:00Z`),
  }));
  const categoryPages = getPopulatedCategories().map((category) => ({
    url: absoluteUrl(`/category/${category.slug}`),
    lastModified,
  }));
  const listingPages = getLiveListings().map((listing) => ({
    url: absoluteUrl(`/listing/${listing.slug}`),
    lastModified: new Date(`${listing.last_verified}T00:00:00Z`),
  }));

  return [...staticPages, ...guidePages, ...categoryPages, ...listingPages];
}

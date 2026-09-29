import { getPublishedGuides, guideHrefs } from "@/lib/guides";
import { getLiveListings, getPopulatedCategories } from "@/lib/listings";

export const STATIC_PUBLIC_PATHS = new Set([
  "/",
  "/browse",
  "/categories",
  "/about",
  "/guides",
  "/insights",
  "/insights/uk-automotive-workspace-report",
  "/methodology",
  "/privacy",
  "/terms",
  "/add-listing",
  "/report",
  "/claim-listing",
]);

const FORM_ACTIONS = new Set(["/api/directory-request"]);

export interface InternalLinkHit {
  href: string;
  source: string;
}

export interface LinkAuditResult {
  broken: InternalLinkHit[];
  checked: number;
}

function stripQueryAndHash(href: string): { pathname: string; raw: string } {
  const [withoutHash] = href.split("#");
  const pathname = (withoutHash.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  return { pathname, raw: href };
}

export function isAllowedInternalPath(href: string): boolean {
  if (!href.startsWith("/")) {
    return true;
  }
  if (href.startsWith("//")) {
    return false;
  }

  const { pathname } = stripQueryAndHash(href);
  if (STATIC_PUBLIC_PATHS.has(pathname) || FORM_ACTIONS.has(pathname)) {
    return true;
  }

  const liveSlugs = new Set(getLiveListings().map((listing) => listing.slug));
  const categorySlugs = new Set(getPopulatedCategories().map((category) => category.slug));
  const guideSlugs = new Set(getPublishedGuides().map((guide) => guide.slug));

  if (pathname.startsWith("/listing/")) {
    return liveSlugs.has(pathname.slice("/listing/".length));
  }
  if (pathname.startsWith("/category/")) {
    return categorySlugs.has(pathname.slice("/category/".length));
  }
  if (pathname.startsWith("/guides/")) {
    return guideSlugs.has(pathname.slice("/guides/".length));
  }

  return false;
}

export function collectGuideInternalLinks(): InternalLinkHit[] {
  const hits: InternalLinkHit[] = [];
  for (const guide of getPublishedGuides()) {
    for (const href of guideHrefs(guide)) {
      if (href.startsWith("/")) {
        hits.push({ href, source: `guide:${guide.slug}` });
      }
    }
  }
  return hits;
}

export function auditInternalHref(href: string, source: string): InternalLinkHit | null {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return null;
  }
  if (href.includes("${")) {
    return null;
  }
  if (isAllowedInternalPath(href)) {
    return null;
  }
  return { href, source };
}

export function auditInternalLinks(hits: readonly InternalLinkHit[]): LinkAuditResult {
  const broken: InternalLinkHit[] = [];
  for (const hit of hits) {
    const found = auditInternalHref(hit.href, hit.source);
    if (found) {
      broken.push(found);
    }
  }
  return { broken, checked: hits.length };
}

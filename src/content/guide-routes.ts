/** Stable guide routes. Content files and category pages share these slugs. */
export const guideSlug = {
  rentARamp: "how-rent-a-ramp-garages-work",
  pricing: "cost-to-rent-a-vehicle-ramp",
  checklist: "what-to-check-before-hiring-a-diy-garage",
  lifts: "two-post-vs-four-post-vehicle-lifts",
  ownCar: "rent-a-garage-to-work-on-your-own-car",
  trade: "workshop-hire-for-mobile-mechanics",
} as const;

export const HOME_GUIDE_SLUGS = [guideSlug.rentARamp, guideSlug.checklist, guideSlug.pricing] as const;

export const GUIDE_AUTHOR = "AutoWorkspace UK";

export const GUIDE_PUBLISHED = "2026-09-26";

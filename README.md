# AutoWorkspace UK

Find space. Fix more.

AutoWorkspace UK is a directory of UK facilities where external customers can hire automotive workspace. That includes rent-a-ramp bays, DIY and self-service garages, vehicle lifts, garage bays, workshops, spray booths, detailing bays, motorcycle workspace, and van or light commercial workspace.

Ordinary repair garages are not listed automatically. A location is published only when there is evidence that someone outside the business can hire or use the space or equipment.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Listing data in a local JSON file

There is no database, authentication, or payment system. Prisma, Supabase, Neon, and Firebase are not used.

## Folder structure

```text
src/app/                  Routes, sitemap, and robots.txt
src/components/           Header, search, listing cards, and other UI
src/data/listings.json    All directory records
src/lib/listings.ts       Public query helpers
src/lib/directory.ts      Query implementation, ready to back with a database later
src/lib/categories.ts     Category names, introductions, and FAQs
src/lib/search.ts         Browse filters
src/lib/publishing.ts     The live-only publishing rule
src/lib/location-pages.ts Future rule for indexable town pages
scripts/verify-publishing.ts
```

Pages read listings through the helpers in `src/lib/listings.ts`. UI code does not import the JSON file directly. `createDirectory()` in `src/lib/directory.ts` is the boundary to replace when a database is added later.

## Where to put the real listings

Replace the whole file at:

`src/data/listings.json`

Do not rename it. The app reads that path only.

Keep the JSON as an array of objects matching `Listing` in `src/lib/types.ts`. `src/lib/validate-listings.ts` checks every record when the app loads and when you run `npm run verify`. The build fails if a record is malformed, if a slug is duplicated, or if a category is missing from `src/lib/categories.ts`. Add a category there before using a new slug, and give it its own introduction rather than a renamed copy of another category.

`source_url`, verification notes, and research wording stay in the data file. Public pages do not print the source URL or internal labels such as `secondary_current`, `marketplace_current`, or `conflicting`.

## How to add or update a listing

1. Edit `src/data/listings.json`.
2. Use a unique `id` and `slug`. Slugs are lowercase and hyphenated, for example `mersey-ramp-workspace`.
3. Set `publish_status` using the rules below.
4. Set `country` to `"GB"`.
5. Leave unknown contact fields as `null`. Do not invent prices, phone numbers, or descriptions.
6. Put only equipment the source actually supports in `equipment`.
7. Set `last_verified` to the date the evidence was checked, as `YYYY-MM-DD`.
8. Put the evidence URL in `source_url`.
9. Run `npm run verify` and `npm run build`.

Live listings become `/listing/[slug]` at build time. A new live listing needs a rebuild before its page exists.

## Publishing-status rules

Only this status appears in public search, category pages, featured listings, and listing pages:

```text
publish_status === "live"
```

These statuses stay in the JSON file and must not appear as available locations:

- `review`
- `coming_soon`
- `hold`

`npm run verify` checks that withheld records cannot come back from `getLiveListings()`, `getListingBySlug()`, `getListingsByCategory()`, `getListingsByCity()`, `getListingsByRegion()`, or `getNearbyAlternatives()`.

Public helpers:

- `getLiveListings()`
- `getListingBySlug()`
- `getListingsByCategory()`
- `getListingsByCity()`
- `getListingsByRegion()`
- `getNearbyAlternatives()`

`getNearbyAlternatives()` prefers the same region and category, then the same region, then the same category. It is not a distance calculation. It does not pad results with unrelated listings.

`getStoredListings()` returns every record, including withheld ones. Do not use it on public pages.

## Location pages

Town and city pages are not generated. `src/lib/location-pages.ts` records the later rule: a location page is indexable only when it has at least three live listings and substantial unique content of its own. A town name is not enough.

## Indexing

Indexed:

- Homepage
- Categories
- About
- Guides index and published guides
- Insights and the UK workspace report
- Methodology
- Privacy
- Terms
- Populated category pages that contain a live listing
- Individual live listing pages

Not indexed:

- `/browse`, including filter and query URLs (`noindex, follow`)
- Add listing, claim listing, and report forms (`noindex`; also disallowed in robots.txt)
- Review, coming soon, and on-hold records
- Empty categories
- Town, city, and postcode pages (not generated)
- API routes

`/sitemap.xml` and `/robots.txt` are generated from the same rules. There are no ratings or reviews in the structured data.

Set `NEXT_PUBLIC_SITE_URL` before production. See `.env.example`. The default canonical host is `https://www.autoworkspace.uk`.

Form submissions use Resend from `POST /api/directory-request`. In production set `RESEND_API_KEY`, `DIRECTORY_INBOX_EMAIL`, and `DIRECTORY_FROM_EMAIL`. Local development validates the form, logs the payload, and returns a development-only success if those variables are unset. Production does not silently discard submissions.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run lint
npm run typecheck
npm run verify
npm run audit:data
npm run audit:links
npm run check:env
npm run build
npm start
```

`npm run build` runs the publishing checks, then creates the production build. It does not require Resend secrets during local development. `npm start` serves that build. `npm run audit:data` reports missing optional fields and does not fail the build for them. Schema problems still fail. `npm run audit:links` checks internal static hrefs. `npm run check:env` reports required production config, optional config, and missing values without printing secrets. Use `npm run check:env -- --production` on a production host. `npm run report:maintenance` is an internal summary for local review and is not a public page. `npm run report:prelaunch` regenerates `reports/prelaunch-data-review.json` and `.md`.

## Routes

```text
/
/browse
/listing/[slug]
/categories
/category/[slug]
/about
/guides
/insights
/insights/uk-automotive-workspace-report
/methodology
/privacy
/terms
/add-listing
/report
/claim-listing
```

`/browse` accepts shareable filters such as `/browse?category=rent-a-ramp` and `/browse?location=liverpool`. Filtering runs against the JSON file. Listing suggestions, reports, and claim requests are emailed for manual review. They do not write to `listings.json`.

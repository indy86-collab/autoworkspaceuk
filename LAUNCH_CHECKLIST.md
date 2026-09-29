# Launch checklist

Manual tasks only. None of these items are marked complete by the production-readiness pass.

## Data

- [x] Re-check every live listing whose verification is not first-party
- [x] Complete missing addresses where a published source actually states them (do not invent)
- [ ] Re-check live records whose prices exist only in `pricing.summary`
- [x] Review Bold Hydrographics (`bold-hydrographics-alcester`) against the first-party site / operator
- [x] Review DIY-Garage.net (`diy-garage-stretford`) against the first-party site / operator
- [ ] Confirm the current live count before launch (see `reports/prelaunch-data-review.md`)

## Domain

- [ ] Configure the production domain
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the chosen canonical origin
- [ ] Verify the www / non-www canonical choice matches DNS, redirects, and metadata
- [ ] Run `npm run check:env -- --production` on the production host or CI

## Email

- [ ] Verify the sending domain in Resend
- [ ] Set `RESEND_API_KEY`, `DIRECTORY_INBOX_EMAIL`, and `DIRECTORY_FROM_EMAIL`
- [ ] Confirm the inbox mailbox is monitored
- [ ] Test Add Listing, Report Incorrect Information, and Claim/Update Listing in production
- [ ] Confirm a missing or failing Resend config does **not** show the success message

## Search

- [ ] Add the property in Google Search Console
- [ ] Submit `https://<canonical-host>/sitemap.xml`
- [ ] Inspect `/robots.txt`
- [ ] Inspect canonical URLs on homepage, a category, a listing, and a guide

## Analytics

- [x] Add Vercel Web Analytics
- [ ] Enable Web Analytics for the production project in the Vercel dashboard
- [ ] Review cookies / consent before adding any analytics service that uses cookies

## Legal

- [ ] Review `/privacy`
- [ ] Review `/terms`
- [ ] Confirm public contact details (inbox address or other contact) are accurate

## Final browser testing

- [ ] iPhone-sized viewport
- [ ] Android-sized viewport
- [ ] Desktop Chrome
- [ ] Safari where available

Cover at least: homepage search, browse filters, a listing page, add/report/claim forms, 404, and a category page.

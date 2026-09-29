import { ClaimListingForm } from "@/components/ClaimListingForm";
import { SubmissionConfirmation, SubmissionError } from "@/components/forms/SubmissionConfirmation";
import { getListingBySlug } from "@/lib/listings";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Claim or update a listing",
  description:
    "Ask AutoWorkspace UK to review a listing you own or manage. Ownership is not verified automatically, and listings are not changed automatically.",
  path: "/claim-listing",
  index: false,
  follow: true,
});

export default async function ClaimListingPage(props: PageProps<"/claim-listing">) {
  const searchParams = await props.searchParams;
  const slug = typeof searchParams.listing === "string" ? searchParams.listing : "";
  const listing = slug ? getListingBySlug(slug) : undefined;
  const received = searchParams.received === "1";
  const developmentOnly = searchParams.dev === "1";
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  return (
    <div className="site-wrap py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Claim or update a listing</h1>
      <div className="mt-4 max-w-2xl space-y-4 leading-7 text-slate-700">
        <p>
          Use this form if you own or manage a listed business and want the record reviewed. We do not create accounts, and
          we do not automatically verify ownership or change published data.
        </p>
        {listing ? (
          <p>
            This request refers to{" "}
            <Link href={`/listing/${listing.slug}`} className="font-semibold text-blue-700 hover:text-blue-800">
              {listing.name}
            </Link>{" "}
            in {listing.address.city}.
          </p>
        ) : slug ? (
          <p>That listing reference is not among the published locations. Describe the business in the form below.</p>
        ) : (
          <p>
            Open a listing and choose Claim or update this listing so the request is attached to a specific page.
          </p>
        )}
      </div>
      <div className="mt-8 max-w-2xl space-y-4">
        {received ? (
          <SubmissionConfirmation kind="listing_claim" developmentOnly={developmentOnly} />
        ) : (
          <>
            <SubmissionError code={error} />
            <ClaimListingForm
              startedAt={new Date().toISOString()}
              listingId={listing?.id}
              listingName={listing?.name}
              listingUrl={listing ? absoluteUrl(`/listing/${listing.slug}`) : undefined}
              listingSlug={listing?.slug}
            />
          </>
        )}
      </div>
    </div>
  );
}

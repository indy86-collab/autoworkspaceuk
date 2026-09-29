import { ReportForm } from "@/components/ReportForm";
import { SubmissionConfirmation, SubmissionError } from "@/components/forms/SubmissionConfirmation";
import { getListingBySlug } from "@/lib/listings";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Report incorrect information",
  description: "Flag a listing that is closed, not available for hire, or factually wrong. Reports are reviewed manually.",
  path: "/report",
  index: false,
  follow: true,
});

export default async function ReportPage(props: PageProps<"/report">) {
  const searchParams = await props.searchParams;
  const slug = typeof searchParams.listing === "string" ? searchParams.listing : "";
  const listing = slug ? getListingBySlug(slug) : undefined;
  const received = searchParams.received === "1";
  const developmentOnly = searchParams.dev === "1";
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  return (
    <div className="site-wrap py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">Report incorrect information</h1>
      <div className="mt-4 max-w-2xl space-y-4 leading-7 text-slate-700">
        <p>
          Use this page to flag a listing that is closed, not available for external hire, or factually wrong. Reports are
          reviewed manually. The directory file is not changed automatically.
        </p>
        {listing ? (
          <p>
            This report refers to{" "}
            <Link href={`/listing/${listing.slug}`} className="font-semibold text-blue-700 hover:text-blue-800">
              {listing.name}
            </Link>{" "}
            in {listing.address.city}.
          </p>
        ) : slug ? (
          <p>That listing reference is not among the published locations. You can still describe the problem below.</p>
        ) : (
          <p>Open a listing and choose Report incorrect information to attach the report to a specific page.</p>
        )}
      </div>
      <div className="mt-8 max-w-2xl space-y-4">
        {received ? (
          <SubmissionConfirmation kind="listing_report" developmentOnly={developmentOnly} />
        ) : (
          <>
            <SubmissionError code={error} />
            <ReportForm
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

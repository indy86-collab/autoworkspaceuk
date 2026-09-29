import { AddListingForm } from "@/components/AddListingForm";
import { SubmissionConfirmation, SubmissionError } from "@/components/forms/SubmissionConfirmation";
import { getPublicCategories } from "@/lib/categories";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Add a listing",
  description:
    "Tell AutoWorkspace UK about a facility where external customers can hire automotive workspace or equipment. Submissions are reviewed manually.",
  path: "/add-listing",
  index: false,
  follow: true,
});

export default async function AddListingPage(props: PageProps<"/add-listing">) {
  const searchParams = await props.searchParams;
  const received = searchParams.received === "1";
  const developmentOnly = searchParams.dev === "1";
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;
  const categories = getPublicCategories().map((category) => ({
    slug: category.slug,
    name: category.name,
  }));

  return (
    <div className="site-wrap py-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-navy">Add a listing</h1>
        <p className="mt-4 leading-7 text-slate-700">
          Use this form for a UK facility where someone outside the business can hire a ramp, bay, booth, lift, or other automotive workspace. Include evidence that the hire is currently offered. Ordinary repair garages that do not hire space out should not be submitted.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Listings are reviewed manually and must show evidence that external customers can hire or use the workspace.
        </p>
      </div>
      <div className="mt-8 max-w-3xl space-y-4">
        {received ? (
          <SubmissionConfirmation kind="listing_suggestion" developmentOnly={developmentOnly} />
        ) : (
          <>
            <SubmissionError code={error} />
            <AddListingForm categories={categories} startedAt={new Date().toISOString()} />
          </>
        )}
      </div>
    </div>
  );
}

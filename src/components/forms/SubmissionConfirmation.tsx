import Link from "next/link";

export function SubmissionConfirmation({
  kind,
  developmentOnly = false,
}: {
  kind: "listing_suggestion" | "listing_report" | "listing_claim";
  developmentOnly?: boolean;
}) {
  const againHref = kind === "listing_suggestion" ? "/add-listing" : kind === "listing_report" ? "/report" : "/claim-listing";

  return (
    <div className="card space-y-4 p-5 sm:p-6" role="status">
      <h2 className="text-xl font-semibold text-navy">
        Thanks — we’ll review this information before it appears on AutoWorkspace UK.
      </h2>
      {kind === "listing_suggestion" ? (
        <p className="leading-7 text-slate-700">
          Listings are reviewed manually and must show evidence that external customers can hire or use the workspace.
        </p>
      ) : (
        <p className="leading-7 text-slate-700">
          This is a request for manual review. Published listings are not changed automatically.
        </p>
      )}
      {developmentOnly ? (
        <p className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-navy">
          Development only: this submission was validated and logged on the server. It was not emailed.
        </p>
      ) : null}
      <p>
        <Link href={againHref} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          Send another submission
        </Link>
      </p>
    </div>
  );
}

export function SubmissionError({ code }: { code: string | undefined }) {
  if (!code) {
    return null;
  }

  const message =
    code === "unavailable"
      ? "We could not send this just now. Please try again later, or contact AutoWorkspace UK if the problem continues."
      : "Please check the required fields and try again.";

  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-navy">
      {message}
    </p>
  );
}

import { HoneypotFields } from "@/components/forms/HoneypotFields";
import { FIELD_LIMITS, REPORT_ISSUE_LABELS } from "@/lib/directory-request";
import { REPORT_ISSUES } from "@/lib/types";

export function ReportForm({
  startedAt,
  listingId,
  listingName,
  listingUrl,
  listingSlug,
}: {
  startedAt: string;
  listingId?: string;
  listingName?: string;
  listingUrl?: string;
  listingSlug?: string;
}) {
  const returnTo = listingSlug ? `/report?listing=${listingSlug}` : "/report";

  return (
    <form method="post" action="/api/directory-request" className="card space-y-5 p-5 sm:p-6">
      <input type="hidden" name="kind" value="listing_report" />
      <input type="hidden" name="return_to" value={returnTo} />
      <input type="hidden" name="listingId" value={listingId ?? ""} />
      <input type="hidden" name="listingName" value={listingName ?? ""} />
      <input type="hidden" name="listingUrl" value={listingUrl ?? ""} />
      <HoneypotFields startedAt={startedAt} />

      <div>
        <label htmlFor="issue" className="text-sm font-medium text-navy">
          What is wrong
        </label>
        <select id="issue" name="issue" required className="field">
          <option value="">Select an issue</option>
          {REPORT_ISSUES.map((issue) => (
            <option key={issue} value={issue}>
              {REPORT_ISSUE_LABELS[issue]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="details" className="text-sm font-medium text-navy">
          Correction / details
        </label>
        <textarea id="details" name="details" required rows={5} maxLength={FIELD_LIMITS.details} className="field" />
      </div>
      <div>
        <label htmlFor="sourceUrl" className="text-sm font-medium text-navy">
          Optional source URL
        </label>
        <input id="sourceUrl" name="sourceUrl" type="url" maxLength={FIELD_LIMITS.sourceUrl} className="field" placeholder="https://" />
      </div>
      <div>
        <label htmlFor="reporterEmail" className="text-sm font-medium text-navy">
          Optional email
        </label>
        <input
          id="reporterEmail"
          name="reporterEmail"
          type="email"
          maxLength={FIELD_LIMITS.reporterEmail}
          className="field"
          autoComplete="email"
        />
        <p className="mt-1 text-xs text-slate-600">Used only if we need to follow up on this report. It is not published.</p>
      </div>
      <button type="submit" className="btn-primary">
        Send report
      </button>
      <p className="text-sm text-slate-600">
        Reports are reviewed manually. The listing is not changed automatically.
      </p>
    </form>
  );
}

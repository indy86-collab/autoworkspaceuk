import { submitDirectoryRequest } from "@/lib/submit-directory-request";
import type { ListingSubmission } from "@/lib/types";

/**
 * @deprecated Use submitDirectoryRequest(). Kept as a named export for older call sites.
 */
export async function submitListing(submission: ListingSubmission) {
  return submitDirectoryRequest({
    kind: "listing_suggestion",
    fields: {
      ...submission,
      city: "",
      contactEmail: submission.email,
      evidenceUrl: submission.evidence,
      audience: "both",
      hireConfirmation: true,
    },
    spam: { honeypot: "", startedAt: new Date(Date.now() - 5_000).toISOString() },
  });
}

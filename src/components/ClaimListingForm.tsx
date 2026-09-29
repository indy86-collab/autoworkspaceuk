import { HoneypotFields } from "@/components/forms/HoneypotFields";
import { FIELD_LIMITS } from "@/lib/directory-request";

export function ClaimListingForm({
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
  const returnTo = listingSlug ? `/claim-listing?listing=${listingSlug}` : "/claim-listing";

  return (
    <form method="post" action="/api/directory-request" className="card space-y-5 p-5 sm:p-6">
      <input type="hidden" name="kind" value="listing_claim" />
      <input type="hidden" name="return_to" value={returnTo} />
      <input type="hidden" name="listingId" value={listingId ?? ""} />
      <input type="hidden" name="listingName" value={listingName ?? ""} />
      <input type="hidden" name="listingUrl" value={listingUrl ?? ""} />
      <HoneypotFields startedAt={startedAt} />

      <div>
        <label htmlFor="name" className="text-sm font-medium text-navy">
          Name
        </label>
        <input id="name" name="name" required maxLength={FIELD_LIMITS.name} className="field" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="role" className="text-sm font-medium text-navy">
          Role at business
        </label>
        <input id="role" name="role" required maxLength={FIELD_LIMITS.role} className="field" placeholder="Owner, manager, or other role" />
      </div>
      <div>
        <label htmlFor="businessEmail" className="text-sm font-medium text-navy">
          Business email
        </label>
        <input
          id="businessEmail"
          name="businessEmail"
          type="email"
          required
          maxLength={FIELD_LIMITS.businessEmail}
          className="field"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="businessPhone" className="text-sm font-medium text-navy">
          Business phone
        </label>
        <input
          id="businessPhone"
          name="businessPhone"
          type="tel"
          maxLength={FIELD_LIMITS.businessPhone}
          className="field"
          autoComplete="tel"
        />
      </div>
      <div>
        <label htmlFor="requestedChanges" className="text-sm font-medium text-navy">
          Requested changes
        </label>
        <textarea
          id="requestedChanges"
          name="requestedChanges"
          required
          rows={5}
          maxLength={FIELD_LIMITS.requestedChanges}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="ownershipEvidence" className="text-sm font-medium text-navy">
          Evidence of ownership or association
        </label>
        <textarea
          id="ownershipEvidence"
          name="ownershipEvidence"
          required
          rows={4}
          maxLength={FIELD_LIMITS.ownershipEvidence}
          className="field"
          placeholder="A company website, Companies House record, or other current source showing your connection to the business"
        />
      </div>
      <button type="submit" className="btn-primary">
        Request a review
      </button>
      <p className="text-sm text-slate-600">
        This sends a review request. We do not create accounts, and we do not automatically verify ownership or change the listing.
      </p>
    </form>
  );
}

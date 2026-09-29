import { HoneypotFields } from "@/components/forms/HoneypotFields";
import { FIELD_LIMITS } from "@/lib/directory-request";
import { getPublicCategories } from "@/lib/categories";

interface CategoryOption {
  slug: string;
  name: string;
}

export function AddListingForm({
  categories,
  startedAt,
}: {
  categories: readonly CategoryOption[];
  startedAt: string;
}) {
  const workspaceTypes = categories.length > 0 ? categories : getPublicCategories().map((category) => ({ slug: category.slug, name: category.name }));

  return (
    <form method="post" action="/api/directory-request" className="card space-y-5 p-5 sm:p-6">
      <input type="hidden" name="kind" value="listing_suggestion" />
      <input type="hidden" name="return_to" value="/add-listing" />
      <HoneypotFields startedAt={startedAt} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="businessName" className="text-sm font-medium text-navy">
            Business name
          </label>
          <input
            id="businessName"
            name="businessName"
            required
            maxLength={FIELD_LIMITS.businessName}
            className="field"
            autoComplete="organization"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="website" className="text-sm font-medium text-navy">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            maxLength={FIELD_LIMITS.website}
            className="field"
            placeholder="https://"
            autoComplete="url"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className="text-sm font-medium text-navy">
            Address
          </label>
          <input
            id="address"
            name="address"
            maxLength={FIELD_LIMITS.address}
            className="field"
            autoComplete="street-address"
            placeholder="Street address if published"
          />
        </div>
        <div>
          <label htmlFor="city" className="text-sm font-medium text-navy">
            Town / city
          </label>
          <input id="city" name="city" required maxLength={FIELD_LIMITS.city} className="field" autoComplete="address-level2" />
        </div>
        <div>
          <label htmlFor="postcode" className="text-sm font-medium text-navy">
            Postcode
          </label>
          <input id="postcode" name="postcode" maxLength={FIELD_LIMITS.postcode} className="field" autoComplete="postal-code" />
        </div>
        <div>
          <label htmlFor="contactName" className="text-sm font-medium text-navy">
            Contact name
          </label>
          <input
            id="contactName"
            name="contactName"
            required
            maxLength={FIELD_LIMITS.contactName}
            className="field"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="text-sm font-medium text-navy">
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            maxLength={FIELD_LIMITS.contactEmail}
            className="field"
            autoComplete="email"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="text-sm font-medium text-navy">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" maxLength={FIELD_LIMITS.phone} className="field" autoComplete="tel" />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-navy">Workspace types</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {workspaceTypes.map((category) => (
            <label key={category.slug} className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" name="categories" value={category.slug} className="mt-0.5 h-4 w-4 accent-blue-600" />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-navy">Who can use it</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="audience" value="consumer" required className="h-4 w-4 accent-blue-600" />
            Consumers
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="audience" value="trade" className="h-4 w-4 accent-blue-600" />
            Trade
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="audience" value="both" className="h-4 w-4 accent-blue-600" />
            Both
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-navy">
          Description of workspace
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          maxLength={FIELD_LIMITS.description}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="pricing" className="text-sm font-medium text-navy">
          Pricing information
        </label>
        <textarea
          id="pricing"
          name="pricing"
          rows={3}
          maxLength={FIELD_LIMITS.pricing}
          className="field"
          placeholder="Hourly, half-day, day, week, or month rates if you publish them"
        />
      </div>
      <div>
        <label htmlFor="equipment" className="text-sm font-medium text-navy">
          Equipment/facilities
        </label>
        <textarea
          id="equipment"
          name="equipment"
          rows={3}
          maxLength={FIELD_LIMITS.equipment}
          className="field"
          placeholder="Lift, tools, booth, or other equipment a hirer can use"
        />
      </div>
      <div>
        <label htmlFor="evidenceUrl" className="text-sm font-medium text-navy">
          Evidence URL showing that workspace hire is available
        </label>
        <input
          id="evidenceUrl"
          name="evidenceUrl"
          type="url"
          required
          maxLength={FIELD_LIMITS.evidenceUrl}
          className="field"
          placeholder="https://"
        />
      </div>
      <div>
        <label htmlFor="notes" className="text-sm font-medium text-navy">
          Optional notes
        </label>
        <textarea id="notes" name="notes" rows={3} maxLength={FIELD_LIMITS.notes} className="field" />
      </div>

      <label className="flex items-start gap-2 text-sm leading-6 text-slate-700">
        <input type="checkbox" name="hireConfirmation" value="yes" required className="mt-1 h-4 w-4 accent-blue-600" />
        <span>I confirm that this business allows external customers or businesses to hire or use automotive workspace or equipment.</span>
      </label>

      <button type="submit" className="btn-primary">
        Submit listing
      </button>
      <p className="text-sm text-slate-600">
        Submissions are reviewed manually. Nothing is published automatically, and submitted contact details are not added to the directory unless we verify them.
      </p>
    </form>
  );
}

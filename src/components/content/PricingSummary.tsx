import { MethodologyNote } from "@/components/content/MethodologyNote";
import {
  formatGbpAmount,
  formatHourEquivalent,
  getRampPriceResearch,
  type HourEquivalent,
  type PriceExample,
} from "@/lib/dataset-insights";
import Link from "next/link";

function vatNote(excluded: boolean): string {
  return excluded ? "Excludes VAT" : "VAT not stated";
}

function equivalentSummary(items: readonly HourEquivalent[], label: string): string | null {
  if (items.length === 0) {
    return null;
  }
  const sorted = [...items].sort((a, b) => a.hours - b.hours);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];
  const noun = items.length === 1 ? "listing" : "listings";
  if (lowest.hours === highest.hours) {
    return `On the ${items.length} ${noun} that publish both an hourly starting price and a ${label} starting price, the ${label} price is equivalent to ${formatHourEquivalent(lowest.hours)} at that same listing's hourly starting price.`;
  }
  return `On the ${items.length} ${noun} that publish both an hourly starting price and a ${label} starting price, the ${label} price is equivalent to between ${formatHourEquivalent(lowest.hours)} and ${formatHourEquivalent(highest.hours)} at that same listing's hourly starting price.`;
}

function PriceTable({
  caption,
  rows,
  period,
}: {
  caption: string;
  rows: readonly PriceExample[];
  period: string;
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-navy">{caption}</h3>
      <div className="mt-3 max-w-full overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th scope="col" className="py-2 pr-3 font-medium">
                Facility
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Place
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Listing type
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Starting price
              </th>
              <th scope="col" className="py-2 font-medium">
                VAT
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.slug}-${period}`} className="border-b border-slate-100 align-top">
                <td className="py-2 pr-3">
                  <Link href={`/listing/${row.slug}`} className="font-medium text-blue-700 hover:text-blue-800">
                    {row.name}
                  </Link>
                </td>
                <td className="py-2 pr-3 text-slate-700">{row.place}</td>
                <td className="py-2 pr-3">
                  <Link href={`/category/${row.categorySlug}`} className="text-blue-700 hover:text-blue-800">
                    {row.categoryName}
                  </Link>
                </td>
                <td className="py-2 pr-3 font-semibold whitespace-nowrap text-navy">
                  {formatGbpAmount(row.amount)}
                  <span className="font-medium text-slate-600"> / {period}</span>
                </td>
                <td className="py-2 whitespace-nowrap text-slate-700">{vatNote(row.vatExcluded)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PricingSummary() {
  const research = getRampPriceResearch();
  const daySentence = equivalentSummary(research.dayEquivalents, "day");
  const halfSentence = equivalentSummary(research.halfDayEquivalents, "half-day");
  const hourlyKnown = research.lowestHourly != null && research.highestHourly != null && research.medianHourly != null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6" aria-label="Recorded ramp prices">
      <h2 className="text-xl font-semibold text-navy">Recorded starting prices</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">
        Among facilities in our verified dataset that publish hourly prices and are filed under Rent a Ramp or Vehicle
        Lift Hire, these are the structured hourly starting prices. {research.hourly.length} of {research.rampOrLiftCount}{" "}
        live listings in those categories publish one. Listings with no hourly starting price are excluded from the
        lowest, median, and highest figures.
      </p>
      {hourlyKnown ? (
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-sm text-slate-600">Lowest hourly starting price</dt>
            <dd className="mt-1 text-2xl font-semibold text-navy">{formatGbpAmount(research.lowestHourly as number)}</dd>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-sm text-slate-600">Median hourly starting price</dt>
            <dd className="mt-1 text-2xl font-semibold text-navy">{formatGbpAmount(research.medianHourly as number)}</dd>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-sm text-slate-600">Highest hourly starting price</dt>
            <dd className="mt-1 text-2xl font-semibold text-navy">{formatGbpAmount(research.highestHourly as number)}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-700">
          No live Rent a Ramp or Vehicle Lift Hire listing currently has an hourly starting price recorded.
        </p>
      )}
      <p className="mt-4 text-sm leading-6 text-slate-700">
        {research.vatExcludedHourlyCount === 0
          ? "None of these hourly starting prices are recorded as excluding VAT."
          : `${research.vatExcludedHourlyCount} of these hourly starting prices are recorded as excluding VAT.`}{" "}
        A blank VAT note does not mean the price includes VAT. Ask the facility.
      </p>
      {research.latestVerifiedLabel ? (
        <p className="mt-4 text-sm font-semibold text-navy">Data last updated: {research.latestVerifiedLabel}</p>
      ) : null}
      {research.earliestVerifiedLabel && research.earliestVerified !== research.latestVerified ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Listings used for these figures were last checked between {research.earliestVerifiedLabel} and{" "}
          {research.latestVerifiedLabel}. Each listing page shows its own date. Rates can change after that check.
        </p>
      ) : research.latestVerifiedLabel ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Every listing used for these figures was last checked on {research.latestVerifiedLabel}. Rates can change
          after that check.
        </p>
      ) : null}
      <div className="mt-4">
        <MethodologyNote />
      </div>
      <PriceTable caption="Hourly starting prices" rows={research.hourly} period="hour" />
      <PriceTable caption="Half-day starting prices" rows={research.halfDay} period="half day" />
      <PriceTable caption="Day starting prices" rows={research.day} period="day" />
      {halfSentence ? <p className="mt-4 text-sm leading-6 text-slate-700">{halfSentence}</p> : null}
      {daySentence ? <p className="mt-3 text-sm leading-6 text-slate-700">{daySentence}</p> : null}
      {research.dayEquivalents.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
          {research.dayEquivalents.map((item) => (
            <li key={item.slug}>
              <Link href={`/listing/${item.slug}`} className="font-medium text-blue-700 hover:text-blue-800">
                {item.name}
              </Link>
              : day starting price equals {formatHourEquivalent(item.hours)} at its own hourly starting price.
            </li>
          ))}
        </ul>
      ) : null}
      {research.prosePrices.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-navy">Published prices that are not an hourly, half-day, or day rate</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            These listings state a pound amount, but not as an hourly, half-day, or day starting price. They are not
            included in the median. A block of hours has not been converted into an hourly figure.
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {research.prosePrices.map((item) => (
              <li key={item.slug}>
                <Link href={`/listing/${item.slug}`} className="font-medium text-blue-700 hover:text-blue-800">
                  {item.name}
                </Link>
                , {item.place}: {item.text}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {research.otherHourly.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-navy">Hourly prices left out of the ramp figures</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            These hourly starting prices are on live listings that are not filed under Rent a Ramp or Vehicle Lift Hire.
            They are a different kind of hire, so they are not part of the lowest, median, or highest ramp figures.
          </p>
          {research.otherHourly.map((group) => (
            <div key={group.slug} className="mt-4">
              <p className="text-sm font-medium text-navy">
                <Link href={`/category/${group.slug}`} className="text-blue-700 hover:text-blue-800">
                  {group.name}
                </Link>
                : {group.count} {group.count === 1 ? "listing" : "listings"}
                {group.count === 1
                  ? `, ${formatGbpAmount(group.lowest)} an hour`
                  : `, from ${formatGbpAmount(group.lowest)} to ${formatGbpAmount(group.highest)} an hour`}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {group.examples.map((example) => (
                  <li key={example.slug}>
                    <Link href={`/listing/${example.slug}`} className="font-medium text-blue-700 hover:text-blue-800">
                      {example.name}
                    </Link>
                    , {example.place}: {formatGbpAmount(example.amount)} an hour
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

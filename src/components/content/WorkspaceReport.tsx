import { CategoryDistribution } from "@/components/content/CategoryDistribution";
import { DatasetStatList } from "@/components/content/DatasetStatList";
import { MethodologyNote } from "@/components/content/MethodologyNote";
import { getWorkspaceReport } from "@/lib/dataset-insights";
import Link from "next/link";

export function WorkspaceReport() {
  const report = getWorkspaceReport();
  const checked =
    report.earliestVerified === report.latestVerified
      ? `Published listings were last checked on ${report.latestVerifiedLabel}.`
      : `Published listings were last checked between ${report.earliestVerifiedLabel} and ${report.latestVerifiedLabel}.`;

  return (
    <article className="min-w-0 max-w-3xl">
      <header>
        <p className="text-sm font-semibold text-blue-800">Directory research</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          UK Automotive Workspace & DIY Garage Report
        </h1>
        <p className="mt-4 leading-7 text-slate-700">
          A factual description of the facilities currently published on AutoWorkspace UK. {checked} Each listing page
          shows its own date.
        </p>
      </header>

      <div className="mt-6">
        <MethodologyNote />
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-navy">Published facilities</h2>
        <div className="mt-4">
          <DatasetStatList
            ids={["verifiedFacilities", "regions", "populatedCategories", "consumerAccess", "tradeAccess"]}
          />
        </div>
        <div className="mt-4 space-y-4 leading-7 text-slate-700">
          <p>
            {report.liveCount} facilities are published. They carry {report.regionCount} region labels:{" "}
            {report.regionNames.join(", ")}. Those labels mix counties, nations, and a few combined areas. They are not
            a complete map of the UK, and a missing label is a gap in this dataset.
          </p>
          <p>
            {report.audience.consumerAvailable} published listings are recorded as open to a private user, of which{" "}
            {report.audience.both} are also recorded as trade. {report.audience.tradeOnly}{" "}
            {report.audience.tradeOnly === 1 ? "is" : "are"} recorded as trade only. An audience label is how the
            facility was presented. It is not a guarantee that every visitor can book.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-navy">Workspace types</h2>
        <p className="mt-4 leading-7 text-slate-700">
          Counts below are published listings in each public category. They describe this directory. They do not
          describe how common each kind of hire is across the UK.
        </p>
        <div className="mt-4">
          <CategoryDistribution />
        </div>
        <p className="mt-4">
          <Link href="/categories" className="font-semibold text-blue-700 hover:text-blue-800">
            Browse the categories
          </Link>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-navy">Prices and equipment</h2>
        <div className="mt-4">
          <DatasetStatList ids={["publishedPrices", "hourlyPrices", "tools", "lifts"]} />
        </div>
        <div className="mt-4 space-y-4 leading-7 text-slate-700">
          <p>
            {report.publishedPriceCount} published listings state a price, either as a numeric starting rate or as a
            public price that includes a pound amount. {report.hourlyCount} have an hourly starting price stored as an
            hourly figure. A price for a block of hours is not turned into an hourly rate.
            {report.prosePriceCount > 0
              ? ` ${report.prosePriceCount} published ${report.prosePriceCount === 1 ? "listing states" : "listings state"} a pound amount without an hourly, half-day, day, week, or month starting rate.`
              : ""}
          </p>
          <p>
            {report.toolCount} listings mention tools in the equipment text, using the words tool, tools, toolset, or
            toolkit. That is not a count of fully equipped workshops. A bay can be useful with a bench and a vice and
            still fall outside this count.
          </p>
          <p>
            {report.liftMentionCount} listings either name a lift, ramp, or hoist, or are filed under Rent a Ramp or
            Vehicle Lift Hire. {report.twoPostCount} mention a two-post lift or ramp. {report.fourPostCount} mention a
            four-post lift or ramp. A listing can mention both. {report.liftWithoutNamedPostCount} are in that
            lift-or-ramp group without the equipment text naming two-post or four-post. Equipment words are not a
            specification of the bay you will be given.
          </p>
          <p>
            The ramp price guide separates hourly, half-day, and day starting prices for rent-a-ramp and vehicle-lift
            listings.{" "}
            <Link href="/guides/cost-to-rent-a-vehicle-ramp" className="font-semibold text-blue-700 hover:text-blue-800">
              Read the recorded prices
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-navy">How the published listings were checked</h2>
        <ul className="mt-4 space-y-2">
          {report.verification.map((item) => (
            <li key={item.label} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700">
              <span className="font-semibold text-navy">{item.count}</span> checked against {item.label.toLowerCase()}.
            </li>
          ))}
        </ul>
        <p className="mt-4 leading-7 text-slate-700">
          The check uses published information. It is not a visit, and it is not a physical inspection of the premises
          or the lift. Where sources would disagree, that listing would be treated with extra caution. The method is
          set out on the{" "}
          <Link href="/methodology" className="font-semibold text-blue-700 hover:text-blue-800">
            methodology page
          </Link>
          .
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-navy">Methodology</h2>
        <div className="mt-4 space-y-4 leading-7 text-slate-700">
          <p>
            A facility is included when there is current evidence that an external customer or business can hire or use
            automotive workspace, a vehicle ramp or lift, a workshop bay, a spray booth, a detailing bay, or another
            specialist automotive workspace.
          </p>
          <p>
            Ordinary repair garages are excluded when they only work on customer cars. So are MOT-only bookings, parts
            shops, general tool-hire shops, and storage that does not allow automotive work. Owning a ramp is not
            enough.
          </p>
          <p>
            Evidence can be the facility&apos;s own website or booking page, an official business profile, another
            current published source, or a current marketplace listing. Records still being checked, marked coming
            soon, or held back are not published and are not included in the figures on this page. A facility that is
            closed, or that no longer hires space out, is not left up as a live listing.
          </p>
          <p>
            {checked} Prices and equipment can change after that date. Corrections can be flagged from a listing. The
            report form does not currently send or store a message.
          </p>
        </div>
      </section>
    </article>
  );
}

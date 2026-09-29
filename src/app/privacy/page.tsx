import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Privacy",
  description:
    "What AutoWorkspace UK collects from listing, report, and claim forms, why it is collected, and that submitted contact details are not published automatically.",
  path: "/privacy",
  index: true,
});

export default function PrivacyPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Privacy", path: "/privacy" },
  ];

  return (
    <div className="site-wrap py-8">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <article className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">Privacy</h1>
        <div className="mt-6 space-y-4 leading-7 text-slate-700">
          <p>
            {siteConfig.name} is a public directory of automotive workspace for hire. This page describes the site as it is now. It does not describe a future analytics or advertising setup that has not been added.
          </p>
          <p>
            There is no account system. You do not sign in, and the site does not ask you to create a profile.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-navy">What you may submit</h2>
          <p>
            The{" "}
            <Link href="/add-listing" className="font-semibold text-blue-700 hover:text-blue-800">
              add a listing
            </Link>
            ,{" "}
            <Link href="/report" className="font-semibold text-blue-700 hover:text-blue-800">
              report incorrect information
            </Link>
            , and{" "}
            <Link href="/claim-listing" className="font-semibold text-blue-700 hover:text-blue-800">
              claim or update a listing
            </Link>{" "}
            forms may collect a name, email address, phone number, business details, a description of workspace or a requested correction, and a URL you provide as evidence.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-navy">Why we collect it</h2>
          <p>
            We collect that information only so we can review a suggested listing, a correction, or a claim. There is no database of user accounts. Submissions are sent for manual review, typically by email.
          </p>
          <p>
            Submissions are reviewed by a person before anything is published. Submitted contact information is not automatically added to a listing or shown on the public site. A listing is updated only if we can verify the change against published evidence.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-navy">How long we keep submissions</h2>
          <p>
            We keep a submission only for as long as it is needed to review it and, where relevant, to update or decline a listing. We do not claim a fixed retention period. After a review is finished, we aim to delete or archive the submission rather than keep personal contact details indefinitely.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-navy">Published directory information</h2>
          <p>
            Published listings contain business information researched from public sources: a business name, a place, contact details where they were found, prices, and equipment. They are not personal accounts. A phone number or email on a listing is the business contact that was recorded.
          </p>
          <p>
            This version of the site does not use analytics cookies and does not show third-party advertising. Links from a listing go to the facility&apos;s own website, or to a phone or email link on your device. Those sites and your email or phone provider have their own practices.
          </p>
          <p>
            This notice does not claim ISO, ICO, or other compliance certifications. If the site later uses analytics cookies that need a choice, this page will say so. A cookie banner is not shown while the site does not use those cookies.
          </p>
        </div>
      </article>
    </div>
  );
}

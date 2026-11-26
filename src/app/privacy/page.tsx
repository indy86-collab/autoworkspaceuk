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
            {siteConfig.name} is a public directory of automotive workspace for hire. This page describes the information the site currently collects and how it is used.
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
            We collect that information so we can review a suggested listing, a correction, or a claim. FormSubmit
            processes the submission and forwards it to our review inbox.{" "}
            <a className="font-semibold text-blue-700 hover:underline" href="https://formsubmit.co/privacy.pdf">
              FormSubmit privacy policy
            </a>
          </p>
          <p>
            Submissions are reviewed by a person before anything is published. Submitted contact information is not automatically added to a listing or shown on the public site. A listing is updated only if we can verify the change against published evidence.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-navy">How long we keep submissions</h2>
          <p>
            FormSubmit says it retains submissions for 30 days. In our inbox, we keep submissions for as long as
            needed to review them and, where relevant, to update or decline a listing.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-navy">Published directory information</h2>
          <p>
            Published listings contain business information researched from public sources: a business name, a place, contact details where they were found, prices, and equipment. They are not personal accounts. A phone number or email on a listing is the business contact that was recorded.
          </p>
          <p>
            We use Vercel Web Analytics to understand aggregated activity such as page views, browser and device type, country, and referring pages. Vercel states that Web Analytics stores anonymised data and does not use cookies. We do not send names, email addresses, phone numbers, or form contents to analytics.
          </p>
          <p>
            You can read more in Vercel&apos;s{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              className="font-semibold text-blue-700 hover:text-blue-800"
              target="_blank"
              rel="noreferrer"
            >
              Web Analytics privacy documentation
            </a>
            .
          </p>

          <h2 className="pt-4 text-xl font-semibold text-navy">Advertising and consent</h2>
          <p>
            Our directory and guide pages use Google AdSense. When the Google script loads, your browser sends
            Google information such as your IP address and the page you&apos;re visiting. Google and its advertising
            partners may use cookies or similar technologies for advertising and measurement, depending on your
            choices. Read more about{" "}
            <a className="font-semibold text-blue-700 hover:underline" href="https://policies.google.com/technologies/partner-sites?hl=en-GB">
              how Google uses information from partner sites
            </a>
            .
          </p>
          <p>
            Visitors in the UK, the European Economic Area and Switzerland can give or decline consent, or manage
            their choices in Google&apos;s consent message. To change or withdraw your consent, use Privacy and cookie
            settings at the bottom of a directory page where the message is available.
          </p>
          <p>
            Links from a listing go to the facility&apos;s website, or open a phone or email app on your device.
            Those sites and providers have their own privacy practices.
          </p>
        </div>
      </article>
    </div>
  );
}

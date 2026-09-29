import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

const exploreLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/categories", label: "Categories" },
  { href: "/guides", label: "Guides" },
  { href: "/insights", label: "Insights" },
];

const businessLinks = [
  { href: "/add-listing", label: "Add a Listing" },
  { href: "/report", label: "Report incorrect information" },
];

const aboutLinks = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="site-wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandMark />
          <p className="mt-4 text-sm font-medium text-slate-600">{siteConfig.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
            A UK directory of places where external customers can hire automotive workspace. Ordinary repair garages
            are not added automatically.
          </p>
        </div>
        <FooterGroup title="Explore" links={exploreLinks} />
        <FooterGroup title="For businesses" links={businessLinks} />
        <FooterGroup title="About" links={aboutLinks} />
      </div>
      <div className="border-t border-slate-200">
        <p className="site-wrap py-4 text-sm text-slate-500">
          © {year} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title}>
      <p className="text-sm font-semibold text-navy">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-slate-700 hover:text-blue-700">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

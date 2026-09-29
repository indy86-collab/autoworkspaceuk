import { BrandMark } from "@/components/BrandMark";
import { MobileNav, type NavLink } from "@/components/MobileNav";
import Link from "next/link";

const links: readonly NavLink[] = [
  { href: "/browse", label: "Browse" },
  { href: "/categories", label: "Categories" },
  { href: "/guides", label: "Guides" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dedbd4] bg-paper/95 backdrop-blur">
      <div className="site-wrap flex h-16 items-center justify-between gap-3">
        <BrandMark />
        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink/70 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/add-listing" className="btn-primary hidden lg:inline-flex">
            Add a Listing
          </Link>
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}

import { CarFront } from "lucide-react";
import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-lg">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
        <CarFront aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block font-display text-base font-bold tracking-tight text-ink">AutoWorkspace <span className="text-accent">UK</span></span>
      </span>
    </Link>
  );
}

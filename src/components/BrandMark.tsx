import { CarFront } from "lucide-react";
import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-lg">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-[#f7a46f] shadow-sm">
        <CarFront aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-display text-[15px] font-bold tracking-tight text-ink">AutoWorkspace</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">UK / FIND YOUR BAY</span>
      </span>
    </Link>
  );
}

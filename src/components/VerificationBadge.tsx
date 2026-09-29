import { publicVerification } from "@/lib/verification";
import type { Listing } from "@/lib/types";
import { BadgeCheck } from "lucide-react";

export function VerificationBadge({ listing }: { listing: Listing }) {
  const presentation = publicVerification(listing);
  const conflicting = presentation.label !== "Verified listing";

  return (
    <span
      title={presentation.help}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        conflicting ? "bg-orange-50 text-orange-900 ring-orange-200" : "bg-blue-50 text-blue-800 ring-blue-200"
      }`}
    >
      {conflicting ? null : <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />}
      {presentation.label}
      <span className="sr-only">. {presentation.help}</span>
    </span>
  );
}

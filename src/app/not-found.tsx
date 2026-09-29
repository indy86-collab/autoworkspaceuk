import { ErrorRecoveryLinks } from "@/components/ErrorRecoveryLinks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="site-wrap py-16">
      <h1 className="text-3xl font-semibold text-navy">Page not found</h1>
      <p className="mt-3 max-w-xl leading-7 text-slate-700">
        That address is not in AutoWorkspace UK. Listing and category pages only exist for published
        workspaces. Unpublished records, empty categories, and unknown slugs do not have their own URLs.
      </p>
      <ErrorRecoveryLinks />
    </div>
  );
}

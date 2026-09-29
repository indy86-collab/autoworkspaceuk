"use client";

import { ErrorRecoveryLinks } from "@/components/ErrorRecoveryLinks";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.digest ?? "no-digest");
  }, [error]);

  return (
    <div className="site-wrap py-16">
      <h1 className="text-3xl font-semibold text-navy">Something went wrong</h1>
      <p className="mt-3 max-w-xl leading-7 text-slate-700">
        AutoWorkspace UK could not load this page. Try again, or go back to browse published workspace.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={() => retry()}>
          Try again
        </button>
      </div>
      <ErrorRecoveryLinks />
    </div>
  );
}

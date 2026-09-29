"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error.digest ?? "no-digest");
  }, [error]);

  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif",
          background: "#ffffff",
          color: "#172554",
        }}
      >
        <title>Something went wrong | AutoWorkspace UK</title>
        <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "4rem 1.25rem" }}>
          <p style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem", color: "#1d4ed8" }}>
            AUTOWORKSPACE UK
          </p>
          <h1 style={{ fontSize: "1.875rem", margin: "1rem 0 0" }}>Something went wrong</h1>
          <p style={{ lineHeight: 1.7, color: "#334155" }}>
            AutoWorkspace UK could not load this page. Try again, or go back to a published directory page.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                minHeight: "2.75rem",
                border: 0,
                borderRadius: "0.625rem",
                padding: "0.625rem 1.1rem",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                minHeight: "2.75rem",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "0.625rem",
                padding: "0.625rem 1.1rem",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Homepage
            </Link>
            <Link
              href="/browse"
              style={{
                minHeight: "2.75rem",
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid #cbd5e1",
                borderRadius: "0.625rem",
                padding: "0.625rem 1.1rem",
                color: "#172554",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Browse
            </Link>
            <Link
              href="/categories"
              style={{
                minHeight: "2.75rem",
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid #cbd5e1",
                borderRadius: "0.625rem",
                padding: "0.625rem 1.1rem",
                color: "#172554",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Categories
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

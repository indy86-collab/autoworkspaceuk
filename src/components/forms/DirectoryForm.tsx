"use client";

import type { SubmitDirectoryRequestResult } from "@/lib/submit-directory-request";
import { useState, type FormEvent, type ReactNode } from "react";

const DELIVERY_ERROR = "We could not confirm delivery. Your details are still here. Please try again.";

export function DirectoryForm({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const fields = new FormData(event.currentTarget);
    setPending(true);
    setError("");

    try {
      const validated = await fetch("/api/directory-request", {
        method: "POST",
        headers: { Accept: "application/json", "X-Directory-Delivery": "browser" },
        body: fields,
        signal: AbortSignal.timeout(15_000),
      });
      const result = (await validated.json()) as SubmitDirectoryRequestResult;
      if (!validated.ok || !result.ok) {
        setError(result.status === "invalid" ? result.message : DELIVERY_ERROR);
        return;
      }

      if (result.status === "forward" && result.delivery) {
        const sent = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(result.delivery.id)}`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            _url: window.location.origin,
            _subject: result.delivery.subject,
            message: result.delivery.message,
          }),
          signal: AbortSignal.timeout(15_000),
        });
        const receipt = (await sent.json()) as { success?: unknown } | null;
        if (!sent.ok || (receipt?.success !== true && receipt?.success !== "true")) {
          setError(DELIVERY_ERROR);
          return;
        }
      } else if (result.status !== "received" && result.status !== "spam") {
        setError(DELIVERY_ERROR);
        return;
      }

      const next = new URL(window.location.href);
      next.searchParams.delete("error");
      next.searchParams.delete("dev");
      next.searchParams.set("received", "1");
      if (result.developmentOnly) next.searchParams.set("dev", "1");
      window.location.assign(next);
    } catch {
      setError(DELIVERY_ERROR);
    } finally {
      setPending(false);
    }
  }

  return (
    <form method="post" action="/api/directory-request" className="card p-5 sm:p-6" aria-busy={pending} onSubmit={onSubmit}>
      <fieldset className="min-w-0 space-y-5" disabled={pending}>
        {children}
      </fieldset>
      {pending ? <p className="mt-3 text-sm text-slate-600" role="status">Sending your submission…</p> : null}
      {error ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-navy" role="alert">{error}</p>
      ) : null}
    </form>
  );
}

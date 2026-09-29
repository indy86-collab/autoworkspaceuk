"use client";

import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/spam-protection";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: { render: (element: HTMLElement, options: { sitekey: string; size: "flexible" }) => void };
  }
}

export function HoneypotFields({ startedAt }: { startedAt: string }) {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return;
    const render = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, { sitekey: siteKey, size: "flexible" });
      }
    };
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
    if (existing) {
      render();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [siteKey]);

  return (
    <>
    <div className="hp-field" aria-hidden="true">
      <label htmlFor={HONEYPOT_FIELD}>Fax number</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
      <input type="hidden" name={STARTED_AT_FIELD} value={startedAt} suppressHydrationWarning />
    </div>
    {siteKey ? <div ref={turnstileRef} className="mt-3" aria-label="Spam protection" /> : null}
    </>
  );
}

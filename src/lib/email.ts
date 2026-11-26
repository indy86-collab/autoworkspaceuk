import { sanitizeEmailSubject, sanitizeEmailText } from "@/lib/email-sanitize";
import { siteConfig } from "@/lib/site";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/";

export function browserEmailDelivery(input: { subject: string; text: string }) {
  const id = process.env.DIRECTORY_FORMSUBMIT_ID?.trim();
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return undefined;
  }

  return {
    id,
    subject: sanitizeEmailSubject(input.subject),
    message: sanitizeEmailText(input.text),
  };
}

export function isEmailDeliveryConfigured(): boolean {
  return Boolean(process.env.DIRECTORY_INBOX_EMAIL?.trim());
}

export function allowDevelopmentSubmissionFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}

/** Forward a validated directory request to the server-configured inbox. */
export async function sendDirectoryEmail(input: { subject: string; text: string }): Promise<void> {
  const inbox = process.env.DIRECTORY_INBOX_EMAIL?.trim();
  if (!inbox) {
    throw new Error("Directory inbox is not configured.");
  }

  const origin = new URL(siteConfig.url).origin;
  const response = await fetch(new URL(encodeURIComponent(inbox), FORMSUBMIT_ENDPOINT), {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: origin,
      Referer: `${origin}/`,
    },
    body: JSON.stringify({
      _url: origin,
      _subject: sanitizeEmailSubject(input.subject),
      _captcha: "false",
      message: sanitizeEmailText(input.text),
    }),
  });

  if (!response.ok) {
    throw new Error(`FormSubmit rejected the request (HTTP ${response.status}).`);
  }
  const result = (await response.json()) as { success?: unknown } | null;
  // A first submission can return HTTP 200 with success=false pending activation.
  if (result?.success !== true && result?.success !== "true") {
    throw new Error("FormSubmit did not confirm delivery. Check that the form has been activated.");
  }
}

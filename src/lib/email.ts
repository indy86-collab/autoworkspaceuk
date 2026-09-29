import { sanitizeEmailSubject, sanitizeEmailText } from "@/lib/email-sanitize";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isEmailDeliveryConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.DIRECTORY_INBOX_EMAIL?.trim() &&
      process.env.DIRECTORY_FROM_EMAIL?.trim(),
  );
}

export function allowDevelopmentSubmissionFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}

/**
 * Send a plain-text directory email.
 * Recipient and From are always environment-controlled. User input cannot
 * set to/cc/bcc/from or arbitrary headers, and is never sent as HTML.
 */
export async function sendDirectoryEmail(input: { subject: string; text: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.DIRECTORY_INBOX_EMAIL?.trim();
  const from = process.env.DIRECTORY_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) {
    throw new Error("Email delivery is not configured.");
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: sanitizeEmailSubject(input.subject),
      text: sanitizeEmailText(input.text),
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    throw new Error(`Email delivery failed (${response.status}): ${detail}`);
  }
}

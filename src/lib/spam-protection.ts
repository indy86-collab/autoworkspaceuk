export const HONEYPOT_FIELD = "fax_number";
export const STARTED_AT_FIELD = "form_started_at";
export const TURNSTILE_TOKEN_FIELD = "cf-turnstile-response";

export const MIN_FORM_FILL_MS = 1_200;

export type SpamVerdict = "ok" | "honeypot" | "too_fast" | "turnstile_failed";

export interface SpamProtectionInput {
  honeypot: string;
  startedAt: string;
  turnstileToken?: string;
  now?: number;
}

/**
 * Basic spam checks. Cloudflare Turnstile is verified only when
 * TURNSTILE_SECRET_KEY is configured, so forms are not dependent on the widget yet.
 * Integration point: include cf-turnstile-response in the POST body once the widget is mounted.
 */
export async function evaluateSpamProtection(input: SpamProtectionInput): Promise<SpamVerdict> {
  if (input.honeypot.trim() !== "") {
    return "honeypot";
  }

  const started = Date.parse(input.startedAt);
  const now = input.now ?? Date.now();
  if (!Number.isFinite(started) || now - started < MIN_FORM_FILL_MS) {
    return "too_fast";
  }

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return "ok";
  }

  const token = input.turnstileToken?.trim() ?? "";
  if (!token) {
    return "turnstile_failed";
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!response.ok) {
      return "turnstile_failed";
    }
    const result = (await response.json()) as { success?: boolean };
    return result.success ? "ok" : "turnstile_failed";
  } catch {
    return "turnstile_failed";
  }
}

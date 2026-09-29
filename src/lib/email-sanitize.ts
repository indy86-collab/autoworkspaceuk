const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export const MAX_EMAIL_SUBJECT_LENGTH = 120;
export const MAX_EMAIL_TEXT_LENGTH = 20_000;

/**
 * Flatten a value that will be placed in an email header (Subject).
 * Newlines and other control characters cannot be used to inject headers.
 */
export function sanitizeEmailSubject(value: string, maxLength = MAX_EMAIL_SUBJECT_LENGTH): string {
  const flattened = value.replace(/[\r\n]+/g, " ").replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();
  if (flattened.length <= maxLength) {
    return flattened;
  }
  return `${flattened.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/** Plain-text body sanitisation. HTML is never returned. */
export function sanitizeEmailText(value: string, maxLength = MAX_EMAIL_TEXT_LENGTH): string {
  const text = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(CONTROL_CHARS, "");
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}\n[truncated]`;
}

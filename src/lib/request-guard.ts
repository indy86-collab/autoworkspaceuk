/**
 * Lightweight request checks for directory forms.
 *
 * Do not add an in-memory rate limiter here. Serverless instances do not share
 * memory, so a local counter would create a false sense of protection.
 * Cloudflare Turnstile / WAF should be added at the edge when needed.
 * The form honeypot and optional Turnstile verification live in spam-protection.ts.
 */

export const MAX_DIRECTORY_REQUEST_BYTES = 48 * 1024;
export const MAX_JSON_KEYS = 40;

const ACCEPTED_CONTENT_TYPES = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "application/json",
]);

export type RequestGuardFailure = {
  status: 400 | 413 | 415;
  message: string;
};

export function contentTypeOf(request: Request): string {
  const raw = request.headers.get("content-type") ?? "";
  return raw.split(";")[0]?.trim().toLowerCase() ?? "";
}

export function acceptedDirectoryContentType(contentType: string): boolean {
  return ACCEPTED_CONTENT_TYPES.has(contentType);
}

export function declaredBodyTooLarge(request: Request, maxBytes = MAX_DIRECTORY_REQUEST_BYTES): boolean {
  const header = request.headers.get("content-length");
  if (!header) {
    return false;
  }
  const length = Number(header);
  return Number.isFinite(length) && length > maxBytes;
}

export function inspectDirectoryRequestHeaders(request: Request): RequestGuardFailure | null {
  const contentType = contentTypeOf(request);
  if (!contentType || !acceptedDirectoryContentType(contentType)) {
    return { status: 415, message: "Unsupported content type." };
  }
  if (declaredBodyTooLarge(request)) {
    return { status: 413, message: "Submission is too large." };
  }
  return null;
}

export function jsonObjectKeyCount(value: unknown): number {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return 0;
  }
  return Object.keys(value).length;
}

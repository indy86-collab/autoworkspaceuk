import { formRecordFromFormData, safeReturnPath } from "@/lib/directory-request";
import {
  contentTypeOf,
  inspectDirectoryRequestHeaders,
  jsonObjectKeyCount,
  MAX_DIRECTORY_REQUEST_BYTES,
  MAX_JSON_KEYS,
} from "@/lib/request-guard";
import { HONEYPOT_FIELD, STARTED_AT_FIELD, TURNSTILE_TOKEN_FIELD } from "@/lib/spam-protection";
import { submitDirectoryRequest } from "@/lib/submit-directory-request";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function wantsJson(request: Request): boolean {
  const accept = request.headers.get("accept") ?? "";
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return true;
  }
  return accept.includes("application/json") && !accept.includes("text/html");
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }
  return origin === new URL(request.url).origin;
}

function redirectTo(request: Request, path: string, params: Record<string, string>): NextResponse {
  const url = new URL(path, request.url);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url, 303);
}

async function readPayload(request: Request): Promise<{ kind: string; fields: Record<string, unknown>; returnTo: string }> {
  const raw = await request.arrayBuffer();
  if (raw.byteLength > MAX_DIRECTORY_REQUEST_BYTES) {
    throw Object.assign(new Error("payload_too_large"), { status: 413 as const });
  }

  const contentType = contentTypeOf(request);
  if (contentType === "application/json") {
    let body: unknown;
    try {
      body = JSON.parse(new TextDecoder().decode(raw)) as unknown;
    } catch {
      throw Object.assign(new Error("invalid_json"), { status: 400 as const });
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw Object.assign(new Error("invalid_json"), { status: 400 as const });
    }
    if (jsonObjectKeyCount(body) > MAX_JSON_KEYS) {
      throw Object.assign(new Error("too_many_fields"), { status: 400 as const });
    }
    const record = body as Record<string, unknown>;
    const kind = typeof record.kind === "string" ? record.kind : "";
    const returnTo = safeReturnPath(typeof record.return_to === "string" ? record.return_to : null, "/add-listing");
    return { kind, fields: record, returnTo };
  }

  const formData = await new Response(raw, {
    headers: { "content-type": request.headers.get("content-type") ?? contentType },
  }).formData();
  const fields = formRecordFromFormData(formData);
  const kind = typeof fields.kind === "string" ? fields.kind : "";
  const returnTo = safeReturnPath(typeof fields.return_to === "string" ? fields.return_to : null, "/add-listing");
  return { kind, fields, returnTo };
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, status: "invalid", message: "Invalid origin." }, { status: 403 });
  }

  const guard = inspectDirectoryRequestHeaders(request);
  if (guard) {
    if (wantsJson(request)) {
      return NextResponse.json({ ok: false, status: "invalid", message: guard.message }, { status: guard.status });
    }
    return redirectTo(request, "/add-listing", { error: "invalid" });
  }

  let payload: { kind: string; fields: Record<string, unknown>; returnTo: string };
  try {
    payload = await readPayload(request);
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 400;
    if (wantsJson(request)) {
      return NextResponse.json(
        { ok: false, status: "invalid", message: status === 413 ? "Submission is too large." : "The submission could not be read." },
        { status: status === 413 ? 413 : 400 },
      );
    }
    return redirectTo(request, "/add-listing", { error: "invalid" });
  }

  const honeypot = typeof payload.fields[HONEYPOT_FIELD] === "string" ? payload.fields[HONEYPOT_FIELD] : "";
  const startedAt = typeof payload.fields[STARTED_AT_FIELD] === "string" ? payload.fields[STARTED_AT_FIELD] : "";
  const turnstileToken =
    typeof payload.fields[TURNSTILE_TOKEN_FIELD] === "string" ? payload.fields[TURNSTILE_TOKEN_FIELD] : "";

  const result = await submitDirectoryRequest({
    kind: payload.kind,
    fields: payload.fields,
    spam: {
      honeypot,
      startedAt,
      turnstileToken,
    },
  });

  const json = wantsJson(request);
  if (json) {
    const status = result.status === "invalid" ? 400 : result.status === "unavailable" ? 503 : 200;
    return NextResponse.json(result, { status });
  }

  if (result.status === "received" || result.status === "spam") {
    const params: Record<string, string> = { received: "1" };
    if (result.developmentOnly) {
      params.dev = "1";
    }
    return redirectTo(request, payload.returnTo, params);
  }

  if (result.status === "unavailable") {
    return redirectTo(request, payload.returnTo, { error: "unavailable" });
  }

  return redirectTo(request, payload.returnTo, { error: "invalid" });
}

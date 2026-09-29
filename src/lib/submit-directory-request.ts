import { allowDevelopmentSubmissionFallback, isEmailDeliveryConfigured, sendDirectoryEmail } from "@/lib/email";
import { parseDirectoryRequest, requestEmailSubject, requestEmailText } from "@/lib/directory-request";
import { evaluateSpamProtection, type SpamProtectionInput } from "@/lib/spam-protection";
import type { DirectoryRequest } from "@/lib/types";

export type DirectoryRequestStatus = "received" | "invalid" | "spam" | "unavailable";

export interface SubmitDirectoryRequestResult {
  ok: boolean;
  status: DirectoryRequestStatus;
  developmentOnly?: boolean;
  errors?: string[];
  message: string;
}

const RECEIVED_MESSAGE =
  "Thanks — we’ll review this information before it appears on AutoWorkspace UK.";

export const UNAVAILABLE_PUBLIC_MESSAGE =
  "We could not send this just now. Please try again later, or contact AutoWorkspace UK if the problem continues.";

/**
 * Validate a directory form payload and send it for manual review.
 * Nothing is written to listings.json or a database.
 */
export async function submitDirectoryRequest(input: {
  kind: string;
  fields: Record<string, unknown>;
  spam: SpamProtectionInput;
}): Promise<SubmitDirectoryRequestResult> {
  const parsed = parseDirectoryRequest(input.kind, input.fields);
  if (!parsed.ok) {
    return {
      ok: false,
      status: "invalid",
      errors: parsed.errors,
      message: parsed.errors[0] ?? "Please check the form and try again.",
    };
  }

  const spam = await evaluateSpamProtection(input.spam);
  if (spam !== "ok") {
    return {
      ok: true,
      status: "spam",
      message: RECEIVED_MESSAGE,
    };
  }

  if (!isEmailDeliveryConfigured()) {
    if (allowDevelopmentSubmissionFallback()) {
      logDevelopmentSubmission(parsed.request);
      return {
        ok: true,
        status: "received",
        developmentOnly: true,
        message: RECEIVED_MESSAGE,
      };
    }

    console.error("[directory-request] email delivery unavailable", {
      kind: parsed.request.kind,
      reason: "not_configured",
    });
    return {
      ok: false,
      status: "unavailable",
      message: UNAVAILABLE_PUBLIC_MESSAGE,
    };
  }

  try {
    await sendDirectoryEmail({
      subject: requestEmailSubject(parsed.request),
      text: requestEmailText(parsed.request),
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown email error";
    console.error("[directory-request] email delivery failed", {
      kind: parsed.request.kind,
      reason: "provider_error",
      detail: detail.slice(0, 240),
    });
    return {
      ok: false,
      status: "unavailable",
      message: UNAVAILABLE_PUBLIC_MESSAGE,
    };
  }

  return {
    ok: true,
    status: "received",
    message: RECEIVED_MESSAGE,
  };
}

function logDevelopmentSubmission(request: DirectoryRequest): void {
  console.info(
    "[directory-request:development-only]",
    JSON.stringify(
      {
        developmentOnly: true,
        receivedAt: new Date().toISOString(),
        kind: request.kind,
        request,
      },
      null,
      2,
    ),
  );
}

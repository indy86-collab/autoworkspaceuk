/**
 * Conservative production headers.
 *
 * A full Content-Security-Policy that covers Next.js scripts, inline JSON-LD,
 * future Resend/Turnstile/analytics, and normal navigation needs a dedicated
 * pass with report-only monitoring. Until then, only frame-ancestors is set
 * as CSP. See reports/csp.md.
 *
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
 */
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

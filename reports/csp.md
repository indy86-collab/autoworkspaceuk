# Content-Security-Policy

AutoWorkspace UK sets a conservative production CSP of:

```http
Content-Security-Policy: frame-ancestors 'none'
```

This is frame protection only. It is paired with `X-Frame-Options: DENY`.

A full CSP (`default-src`, `script-src`, `style-src`, `connect-src`, `img-src`) is not enabled yet. A stricter policy would need a dedicated pass so it does not break:

- Next.js App Router hydration and bundled scripts
- inline JSON-LD (`application/ld+json`)
- the directory forms posting to `/api/directory-request`
- a later Cloudflare Turnstile widget
- a later GA4 or similar analytics snippet
- normal same-origin navigation and Open Graph images

When a full policy is added, start in Content-Security-Policy-Report-Only, include the real production origin from `NEXT_PUBLIC_SITE_URL`, and only promote to enforcing after the report log is clean.

Until then, do not invent a broad CSP for launch.

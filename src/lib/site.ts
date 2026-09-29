const DEFAULT_SITE_URL = "https://www.autoworkspace.uk";

function resolveSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const url = new URL(value);
  return url.href.replace(/\/$/, "");
}

export const siteConfig = {
  name: "AutoWorkspace UK",
  tagline: "Find space. Fix more.",
  description:
    "Find verified UK DIY garages, rent-a-ramp facilities, workshop bays, spray booths and automotive workspace.",
  url: resolveSiteUrl(),
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.url}/`).href;
}

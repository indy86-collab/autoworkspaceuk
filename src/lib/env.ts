export type EnvPresence = "set" | "missing";

export interface EnvVariableDefinition {
  name: string;
  requiredInProduction: boolean;
  requiredInDevelopment: boolean;
  description: string;
}

export const PRODUCTION_REQUIRED_ENV = [
  "NEXT_PUBLIC_SITE_URL",
  "DIRECTORY_INBOX_EMAIL",
] as const;

export const OPTIONAL_ENV = ["TURNSTILE_SECRET_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY"] as const;

export const ENV_VARIABLES: readonly EnvVariableDefinition[] = [
  {
    name: "NEXT_PUBLIC_SITE_URL",
    requiredInProduction: true,
    requiredInDevelopment: false,
    description: "Canonical public origin used for metadata, Open Graph, sitemap, and robots.",
  },
  {
    name: "DIRECTORY_INBOX_EMAIL",
    requiredInProduction: true,
    requiredInDevelopment: false,
    description: "Server-only recipient for FormSubmit delivery of listing, report, and claim emails.",
  },
  {
    name: "TURNSTILE_SECRET_KEY",
    requiredInProduction: false,
    requiredInDevelopment: false,
    description: "Optional Cloudflare Turnstile secret used to protect public forms.",
  },
  {
    name: "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    requiredInProduction: false,
    requiredInDevelopment: false,
    description: "Optional Cloudflare Turnstile site key rendered on public forms.",
  },
];

export function envPresence(name: string, env: NodeJS.ProcessEnv = process.env): EnvPresence {
  const value = env[name];
  return typeof value === "string" && value.trim() !== "" ? "set" : "missing";
}

export function isProductionEnvCheck(argv: readonly string[] = process.argv, env: NodeJS.ProcessEnv = process.env): boolean {
  return argv.includes("--production") || env.CHECK_PRODUCTION_ENV === "1";
}

export interface EnvCheckResult {
  productionMode: boolean;
  requiredProduction: Array<{ name: string; presence: EnvPresence; description: string }>;
  optional: Array<{ name: string; presence: EnvPresence; description: string }>;
  missingRequiredProduction: string[];
  turnstilePartial: boolean;
  ok: boolean;
}

/**
 * Inspect environment presence only. Never returns secret values.
 */
export function inspectEnvironment(
  env: NodeJS.ProcessEnv = process.env,
  productionMode = false,
): EnvCheckResult {
  const requiredProduction = ENV_VARIABLES.filter((item) => item.requiredInProduction).map((item) => ({
    name: item.name,
    presence: envPresence(item.name, env),
    description: item.description,
  }));
  const optional = ENV_VARIABLES.filter((item) => !item.requiredInProduction).map((item) => ({
    name: item.name,
    presence: envPresence(item.name, env),
    description: item.description,
  }));
  const missingRequiredProduction = requiredProduction.filter((item) => item.presence === "missing").map((item) => item.name);
  const turnstileValues = optional.filter((item) => item.name.includes("TURNSTILE")).map((item) => item.presence);
  const turnstilePartial = turnstileValues.includes("set") && turnstileValues.includes("missing");

  return {
    productionMode,
    requiredProduction,
    optional,
    missingRequiredProduction,
    turnstilePartial,
    ok: !productionMode || missingRequiredProduction.length === 0,
  };
}

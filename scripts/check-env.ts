import { loadEnvConfig } from "@next/env";
import { inspectEnvironment, isProductionEnvCheck } from "../src/lib/env";

loadEnvConfig(process.cwd());

const productionMode = isProductionEnvCheck();
const report = inspectEnvironment(process.env, productionMode);

function pad(label: string): string {
  return label.padEnd(32, " ");
}

console.log("AutoWorkspace UK environment check");
console.log("==================================");
console.log(productionMode ? "Mode: production (required variables must be set)" : "Mode: local/development (Resend variables are optional)");
console.log("");
console.log("Required production config");
for (const item of report.requiredProduction) {
  console.log(`  ${pad(item.name)}${item.presence}`);
}
console.log("");
console.log("Optional config");
for (const item of report.optional) {
  console.log(`  ${pad(item.name)}${item.presence}`);
}
console.log("");
console.log("Secret values are never printed. Presence is reported as set or missing.");

if (report.turnstilePartial) {
  console.log("Note: Turnstile is only active when both TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY are set.");
}

if (!report.ok) {
  console.error("");
  console.error("Missing required production variables:");
  for (const name of report.missingRequiredProduction) {
    console.error(`  - ${name}`);
  }
  console.error("Production should not ship until these are configured.");
  process.exit(1);
}

if (!productionMode && report.missingRequiredProduction.length > 0) {
  console.log("");
  console.log("Local development may continue without Resend. Directory forms will not email until production config is set.");
}

console.log("");
console.log("Environment check passed.");

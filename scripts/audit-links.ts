import fs from "node:fs";
import path from "node:path";
import { collectGuideInternalLinks, auditInternalHref, type InternalLinkHit } from "../src/lib/link-audit";

const ROOT = path.join(process.cwd(), "src");
const FILE_PATTERN = /\.(?:ts|tsx|md)$/;
const HREF_PATTERN = /(?:href|action)=["'`](\/[^"'`]*?)["'`]/g;
const TEMPLATE_HREF_PATTERN = /(?:href|action)=\{`(\/[^`]*?)`\}/g;

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
      continue;
    }
    if (FILE_PATTERN.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const hits: InternalLinkHit[] = [...collectGuideInternalLinks()];

for (const file of walk(ROOT)) {
  const source = path.relative(process.cwd(), file);
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of [HREF_PATTERN, TEMPLATE_HREF_PATTERN]) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
      hits.push({ href: match[1], source });
    }
  }
}

const broken: InternalLinkHit[] = [];
const seen = new Set<string>();
for (const hit of hits) {
  const found = auditInternalHref(hit.href, hit.source);
  if (!found) {
    continue;
  }
  const key = `${found.href}::${found.source}`;
  if (seen.has(key)) {
    continue;
  }
  seen.add(key);
  broken.push(found);
}

console.log("AutoWorkspace UK internal link audit");
console.log("====================================");
console.log(`Checked ${hits.length} internal hrefs from app, components, and published guides.`);

if (broken.length > 0) {
  console.error(`Broken internal links: ${broken.length}`);
  for (const item of broken) {
    console.error(`  - ${item.href} (${item.source})`);
  }
  process.exit(1);
}

console.log("Broken internal links: none");

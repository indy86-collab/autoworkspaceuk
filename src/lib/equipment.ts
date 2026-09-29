/**
 * Presentation-layer equipment wording. Raw JSON is left unchanged.
 * Only recorded strings are rewritten; nothing is invented.
 */

export const CANONICAL_EQUIPMENT_LABELS = [
  "2-post lift",
  "4-post lift",
  "vehicle lift",
  "engine hoist",
  "gearbox jack",
  "transmission jack",
  "hydraulic press",
  "diagnostics",
  "compressor",
  "air tools",
  "welding equipment",
  "oil disposal",
  "hand tools",
  "spray booth",
  "workbench",
] as const;

export type CanonicalEquipmentLabel = (typeof CANONICAL_EQUIPMENT_LABELS)[number];

const INTERNAL_EQUIPMENT_NOTE =
  /\s*[-–:;(]\s*(?:specification not confirmed|specification to confirm|directory category only\b.*|rental terms not yet independently confirmed.*|reported)\s*\)?$/i;

const LOW_VALUE =
  /^(creeper|lighting|ppe|cctv|wi-?fi|on-site parking|secure onsite parking|water supply|240v outlets|gloves and overalls|byot setup|key-code access|automated access planned|ventilation|floor space|led work light|stands)$/i;

const PROTECTED_PHRASES: [RegExp, string][] = [[/\bspring compressors?\b/gi, "spring compressor"]];

const PHRASE_REPLACEMENTS: [RegExp, string][] = [
  [
    /\b(?:two[\s-]?post|2[\s-]?post)(?:\s+[\d.,]+(?:kg|[\s-]?ton(?:ne)?s?)?)?\s+(?:vehicle\s+)?(?:lifts?|ramps?|hoists?)\b/gi,
    "2-post lift",
  ],
  [
    /\b(?:four[\s-]?post|4[\s-]?post)(?:\s+[\d.,]+(?:kg|[\s-]?ton(?:ne)?s?)?)?\s+(?:vehicle\s+)?(?:lifts?|ramps?|hoists?)\b/gi,
    "4-post lift",
  ],
  [/\bfull-height 2-post lift\b/gi, "2-post lift"],
  [/\bengine\s+(?:hoists?|cranes?|lifts?)\b/gi, "engine hoist"],
  [/\bgearbox\s+(?:jacks?|lifts?)\b/gi, "gearbox jack"],
  [/\btransmission\s+jacks?\b/gi, "transmission jack"],
  [/\b(?:\d+(?:[.,]\d+)?[\s-]?ton(?:ne)?s?\s+)?(?:hydraulic\s+)?(?:bench\s+|bearing\s+)?(?<!drill\s)press(?:es)?\b/gi, "hydraulic press"],
  [/\bbrake-testing diagnostic equipment\b/gi, "diagnostics"],
  [/\bdiagnostic(?:s)?\s+(?:equipment|tools?|readers?)\b/gi, "diagnostics"],
  [/\bdiagnostic reader\b/gi, "diagnostics"],
  [/\bautodata(?:\s+access)?\b/gi, "diagnostics"],
  [/\bdiagnostics\b/gi, "diagnostics"],
  [/\bair[\s-]?compressors?\b/gi, "compressor"],
  [/(?<!spring\s)\bcompressors?\b/gi, "compressor"],
  [/\bair tools\b/gi, "air tools"],
  [/\bimpact (?:guns?|wrenches?|tools?(?:\s+optional)?)\b/gi, "air tools"],
  [/\bwelding\s+(?:equipment|kit)\b/gi, "welding equipment"],
  [/\bwelders?(?:\s+optional)?\b/gi, "welding equipment"],
  [/\bwaste[\s-]?oil\s+(?:disposal|drain(?:\s+tank)?)\b/gi, "oil disposal"],
  [/\boil[\s-]?disposal(?:\s+facility(?:\s+reported)?)?\b/gi, "oil disposal"],
  [/\boil(?:\s+and\s+coolant)?\s+drainers?\b/gi, "oil disposal"],
  [/\boil[\s-/]+fluid drain\b/gi, "oil disposal"],
  [/\boil drain\b/gi, "oil disposal"],
  [/\bwaste-fluid disposal\b/gi, "oil disposal"],
  [/\b(?:basic\s+)?hand tools(?:\s+available)?\b/gi, "hand tools"],
  [/\bbasic hand and air tools\b/gi, "hand tools"],
  [/\bbasic tools\b/gi, "hand tools"],
  [/\bstandard tools\b/gi, "hand tools"],
  [/^(?:basic |standard )?tools available$/i, "hand tools"],
  [/\b(?:automotive\s+|heated downdraft\s+|low-bake\s+|managed professional\s+|fully equipped\s+|haltech airstream heated\s+|spraybake\s+)?paint booths?\b/gi, "spray booth"],
  [/\bspray[\s-]?and[\s-]?bake booths?\b/gi, "spray booth"],
  [/\bspray booths?\b/gi, "spray booth"],
  [/\bwork\s*benches?(?:\s+and\s+vices?)?\b/gi, "workbench"],
  [/\bworkbench(?:es)?(?:\s+and\s+vice)?\b/gi, "workbench"],
  [/(?<!-)\bvehicle\s+(?:lifts?|ramps?|hoists?)\b/gi, "vehicle lift"],
  [/\bcar\s+lifts?\b/gi, "vehicle lift"],
  [/\b(?:mobile|light-vehicle|drive-up|wheel-alignment|mot)[\s-]+ramps?\b/gi, "vehicle lift"],
  [/\b\d+(?:[\s.-]ton(?:ne)?s?|[\s-]?ton(?:ne)?s?)\s+(?:mobile\s+)?ramps?\b/gi, "vehicle lift"],
  [/\b\d+\s+ramps?\b/gi, "vehicle lift"],
  [/\bscissor lifts?\b/gi, "vehicle lift"],
  [/\bhydraulic lifts?\b/gi, "vehicle lift"],
];

function tidySpaces(value: string): string {
  return value.replace(/\s+/g, " ").replace(/\s+([,./])/g, "$1").trim();
}

function stripInternalNote(value: string): string {
  return value.replace(INTERNAL_EQUIPMENT_NOTE, "").trim();
}

function applyReplacements(value: string, rules: readonly [RegExp, string][]): string {
  let result = value;
  for (const [pattern, replacement] of rules) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function formatLeadingCount(value: string): string {
  return value
    .replace(/^(\d+)\s*[x×]\s+/i, "$1 × ")
    .replace(
      /^(\d+)\s+(?=(?:2-post lift|4-post lift|vehicle lift|engine hoist|gearbox jack|transmission jack|hydraulic press|spray booth|workbench|diagnostics|compressor|oil disposal|hand tools|air tools|welding equipment)\b)/i,
      "$1 × ",
    );
}

function titleCanonicalFragments(value: string): string {
  let result = value;
  for (const label of CANONICAL_EQUIPMENT_LABELS) {
    const pattern = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(pattern, label);
  }
  return result;
}

function extractCapacity(value: string): string | null {
  const kg = value.match(/(\d{1,2}(?:,\d{3})?|\d+)\s*kg\b/i);
  if (kg) {
    return `${kg[1]}kg`;
  }
  const tons = value.match(/(\d+(?:\.\d+)?)[\s-]*ton(?:ne)?s?\b/i);
  if (tons) {
    return `${tons[1]}-ton`;
  }
  return null;
}

function extractCount(value: string): string | null {
  const prefixed = value.match(/^(\d+)\s*[x×]\s+/i);
  if (prefixed) {
    return prefixed[1];
  }
  const leading = value.match(
    /^(\d+)\s+(?=two-post|2-post|four-post|4-post|vehicle|engine|gearbox|hydraulic|spray|car\s+lifts?|ramps?|oil)/i,
  );
  return leading?.[1] ?? null;
}

function withCountAndCapacity(label: string, count: string | null, capacity: string | null): string {
  let result = label;
  if (capacity && !result.toLowerCase().includes(capacity.toLowerCase())) {
    result = `${result} (${capacity})`;
  }
  if (count && !result.startsWith(`${count} × `) && !result.startsWith(`${count} `)) {
    result = `${count} × ${result}`;
  }
  return result;
}

/**
 * Rewrite a recorded equipment string for display. The original dataset is not
 * modified, and unmatched wording is returned as recorded.
 */
export function normaliseEquipmentLabel(raw: string): string {
  const trimmed = stripInternalNote(raw.trim());
  if (!trimmed) {
    return raw.trim();
  }

  const capacity = extractCapacity(trimmed);
  const count = extractCount(trimmed);
  const protectedText = applyReplacements(trimmed, PROTECTED_PHRASES);
  const replaced = applyReplacements(protectedText, PHRASE_REPLACEMENTS);
  const counted = formatLeadingCount(tidySpaces(replaced));
  const labelled = titleCanonicalFragments(counted);
  const collapsed = tidySpaces(
    labelled.replace(/\b(2-post lift|4-post lift|vehicle lift|spray booth|engine hoist)s\b/gi, "$1"),
  );
  const base = collapsed || trimmed;
  const canonical = CANONICAL_EQUIPMENT_LABELS.find((label) => base.toLowerCase() === label.toLowerCase());
  if (canonical) {
    return withCountAndCapacity(canonical, count, capacity);
  }

  return base;
}

export function displayEquipmentList(equipment: readonly string[]): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const item of equipment) {
    const label = normaliseEquipmentLabel(item);
    if (!label) {
      continue;
    }
    const key = label.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    labels.push(label);
  }

  return labels;
}

export function equipmentLabelNeedsNormalisation(raw: string): boolean {
  return normaliseEquipmentLabel(raw) !== raw.trim();
}

export function isLowValueEquipment(label: string): boolean {
  return LOW_VALUE.test(label.trim());
}

export function canonicalEquipmentHit(label: string): CanonicalEquipmentLabel | null {
  const normalised = normaliseEquipmentLabel(label).toLowerCase();
  for (const canonical of CANONICAL_EQUIPMENT_LABELS) {
    if (normalised.includes(canonical.toLowerCase())) {
      return canonical;
    }
  }
  return null;
}

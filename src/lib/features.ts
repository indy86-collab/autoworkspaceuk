import { canonicalEquipmentHit, isLowValueEquipment, normaliseEquipmentLabel } from "@/lib/equipment";

/**
 * Compact facility chips for listing cards. Labels are derived from recorded
 * equipment strings, not invented kit.
 */
export function compactFeatures(equipment: readonly string[], limit = 3): string[] {
  const ranked: { label: string; rank: number }[] = [];
  const seen = new Set<string>();

  function add(label: string, rank: number): void {
    const key = label.toLowerCase();
    if (!label || seen.has(key) || isLowValueEquipment(label)) {
      return;
    }
    seen.add(key);
    ranked.push({ label, rank });
  }

  for (const raw of equipment) {
    const item = raw.toLowerCase();
    const normalised = normaliseEquipmentLabel(raw);
    const tons = parseTonnage(item);
    const canonical = canonicalEquipmentHit(normalised);
    const isLift = canonical === "2-post lift" || canonical === "4-post lift" || canonical === "vehicle lift";

    if (tons && isLift) {
      const kind =
        canonical === "2-post lift" ? "2-post lift" : canonical === "4-post lift" ? "4-post lift" : "vehicle lift";
      add(`${tons}T ${kind}`, 1);
      seen.add(kind);
      seen.add(normalised.toLowerCase());
      continue;
    }

    switch (canonical) {
      case "2-post lift":
        add("2-post lift", 2);
        seen.add("2-post lift");
        continue;
      case "4-post lift":
        add("4-post lift", 3);
        continue;
      case "vehicle lift":
        add("vehicle lift", 4);
        continue;
      case "spray booth":
        add("spray booth", 5);
        continue;
      case "engine hoist":
        add("engine hoist", 6);
        continue;
      case "diagnostics":
        add("diagnostics", 7);
        continue;
      case "welding equipment":
        add("welding equipment", 8);
        continue;
      case "hydraulic press":
        add("hydraulic press", 9);
        continue;
      case "compressor":
        add("compressor", 10);
        continue;
      case "air tools":
        add("air tools", 11);
        continue;
      case "gearbox jack":
        add("gearbox jack", 12);
        continue;
      case "transmission jack":
        add("transmission jack", 13);
        continue;
      case "oil disposal":
        add("oil disposal", 14);
        continue;
      case "hand tools":
        add("hand tools", 15);
        continue;
      case "workbench":
        add("workbench", 16);
        continue;
      default:
        break;
    }
  }

  ranked.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label, "en-GB"));
  const labels = ranked.slice(0, limit).map((item) => item.label);
  if (labels.length >= limit) {
    return labels;
  }

  for (const item of equipment) {
    const label = normaliseEquipmentLabel(item);
    const canonical = canonicalEquipmentHit(label);
    if (
      seen.has(label.toLowerCase()) ||
      (canonical && seen.has(canonical)) ||
      isLowValueEquipment(label) ||
      labels.includes(label)
    ) {
      continue;
    }
    labels.push(label);
    seen.add(label.toLowerCase());
    if (canonical) {
      seen.add(canonical);
    }
    if (labels.length >= limit) {
      return labels;
    }
  }

  if (labels.length === 0) {
    for (const item of equipment) {
      const label = normaliseEquipmentLabel(item);
      if (!label || labels.includes(label)) {
        continue;
      }
      labels.push(label);
      if (labels.length >= limit) {
        break;
      }
    }
  }

  return labels;
}

function parseTonnage(item: string): string | null {
  const kg = item.match(/(\d[\d,]*(?:\.\d+)?)\s*kg/);
  if (kg) {
    return formatTons(Number.parseFloat(kg[1].replace(/,/g, "")) / 1000);
  }
  const tons = item.match(/(\d+(?:\.\d+)?)\s*-?\s*tons?\b/);
  if (tons) {
    return formatTons(Number.parseFloat(tons[1]));
  }
  return null;
}

function formatTons(value: number): string | null {
  if (!Number.isFinite(value) || value <= 0 || value > 40) {
    return null;
  }
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

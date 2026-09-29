export type InlinePart =
  | string
  | { type: "link"; href: string; label: string }
  | { type: "strong"; text: string };

export type GuideBlock =
  | { type: "p"; parts: readonly InlinePart[] }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "ul"; items: readonly (readonly InlinePart[])[] }
  | { type: "ol"; items: readonly (readonly InlinePart[])[] }
  | { type: "callout"; tone: "note" | "caution"; title: string; parts: readonly InlinePart[] }
  | { type: "table"; caption: string; headers: readonly string[]; rows: readonly (readonly (readonly InlinePart[])[])[] }
  | { type: "checklist"; items: readonly string[] }
  | { type: "embed"; id: "pricing-summary" | "methodology-note" | "lift-mentions" };

export interface GuideDocument {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  category: string;
  author: string;
  status: "published" | "draft";
  relatedCategorySlugs: readonly string[];
  relatedGuideSlugs: readonly string[];
  blocks: readonly GuideBlock[];
}

export function link(label: string, href: string): InlinePart {
  return { type: "link", href, label };
}

export function strong(text: string): InlinePart {
  return { type: "strong", text };
}

export function p(...parts: InlinePart[]): GuideBlock {
  return { type: "p", parts };
}

export function h2(id: string, text: string): GuideBlock {
  return { type: "h2", id, text };
}

export function h3(id: string, text: string): GuideBlock {
  return { type: "h3", id, text };
}

export function ul(items: readonly (readonly InlinePart[])[]): GuideBlock {
  return { type: "ul", items };
}

export function ol(items: readonly (readonly InlinePart[])[]): GuideBlock {
  return { type: "ol", items };
}

export function callout(tone: "note" | "caution", title: string, ...parts: InlinePart[]): GuideBlock {
  return { type: "callout", tone, title, parts };
}

export function textCell(value: string): readonly InlinePart[] {
  return [value];
}

export function table(
  caption: string,
  headers: readonly string[],
  rows: readonly (readonly (readonly InlinePart[])[])[],
): GuideBlock {
  return { type: "table", caption, headers, rows };
}

export function checklist(items: readonly string[]): GuideBlock {
  return { type: "checklist", items };
}

export function embed(id: "pricing-summary" | "methodology-note" | "lift-mentions"): GuideBlock {
  return { type: "embed", id };
}

export function inlineText(parts: readonly InlinePart[]): string {
  return parts
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }
      return part.type === "link" ? part.label : part.text;
    })
    .join("");
}

export function guidePlainText(guide: GuideDocument): string {
  const chunks: string[] = [guide.title, guide.description, guide.category, guide.author];

  for (const block of guide.blocks) {
    switch (block.type) {
      case "p":
      case "callout":
        chunks.push(block.type === "callout" ? block.title : "", inlineText(block.parts));
        break;
      case "h2":
      case "h3":
        chunks.push(block.text);
        break;
      case "ul":
      case "ol":
        for (const item of block.items) {
          chunks.push(inlineText(item));
        }
        break;
      case "table":
        chunks.push(block.caption, ...block.headers);
        for (const row of block.rows) {
          for (const cell of row) {
            chunks.push(inlineText(cell));
          }
        }
        break;
      case "checklist":
        chunks.push(...block.items);
        break;
      case "embed":
        break;
    }
  }

  return chunks.filter(Boolean).join(" ");
}

export function guideWordCount(guide: GuideDocument): number {
  return guidePlainText(guide)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function guideHeadings(guide: GuideDocument): { id: string; text: string }[] {
  return guide.blocks.flatMap((block) => (block.type === "h2" ? [{ id: block.id, text: block.text }] : []));
}

export function guideHrefs(guide: GuideDocument): string[] {
  const hrefs: string[] = [];

  function collect(parts: readonly InlinePart[]) {
    for (const part of parts) {
      if (typeof part !== "string" && part.type === "link") {
        hrefs.push(part.href);
      }
    }
  }

  for (const block of guide.blocks) {
    if (block.type === "p" || block.type === "callout") {
      collect(block.parts);
    }
    if (block.type === "ul" || block.type === "ol") {
      for (const item of block.items) {
        collect(item);
      }
    }
    if (block.type === "table") {
      for (const row of block.rows) {
        for (const cell of row) {
          collect(cell);
        }
      }
    }
  }

  for (const slug of guide.relatedCategorySlugs) {
    hrefs.push(`/category/${slug}`);
  }
  for (const slug of guide.relatedGuideSlugs) {
    hrefs.push(`/guides/${slug}`);
  }

  return hrefs;
}

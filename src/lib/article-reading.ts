/** Shared helpers for article reading UX (TOC, timing, ids). */

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Extract H2/H3 from markdown body (after frontmatter strip). */
export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const items: TocItem[] = [];
  const used = new Map<string, number>();
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (!m) continue;

    const level = m[1].length as 2 | 3;
    const text = m[2].replace(/#+\s*$/, "").trim();
    if (!text) continue;

    let id = slugifyHeading(text);
    if (!id) id = `section-${items.length + 1}`;
    const n = (used.get(id) ?? 0) + 1;
    used.set(id, n);
    if (n > 1) id = `${id}-${n}`;

    items.push({ id, text, level });
  }

  return items;
}

/** Rough reading time: ~220 wpm, min 1. */
export function estimateReadMinutes(markdown: string): number {
  const plain = markdown
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`|~\-\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = plain ? plain.split(" ").length : 0;
  return Math.max(1, Math.round(words / 220));
}

export function formatReadTime(minutes: number, lang: "EN" | "FR"): string {
  if (lang === "FR") return `${minutes} min`;
  return `${minutes} min`;
}

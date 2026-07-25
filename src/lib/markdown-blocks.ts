/**
 * Custom DailyOps fenced blocks (in addition to GitHub callouts):
 *
 * :::takeaways
 * - bullet
 * :::
 *
 * :::see-also
 * - [Label](/articles/slug): short reason
 * :::
 *
 * :::cta
 * title: Optional title
 * body: Short pitch
 * href: /path
 * label: Button label
 * :::
 */

import {
  splitMarkdownCallouts,
  type CalloutKind,
  type MarkdownSegment as CalloutSegment,
} from "./markdown-callouts";

export type { CalloutKind };

export interface SeeAlsoItem {
  label: string;
  href: string;
  reason?: string;
}

export interface CtaBlock {
  title?: string;
  body: string;
  href: string;
  label?: string;
}

export type ArticleSegment =
  | { type: "markdown"; content: string }
  | { type: "callout"; kind: CalloutKind; content: string }
  | { type: "takeaways"; items: string[] }
  | { type: "see-also"; items: SeeAlsoItem[] }
  | { type: "cta"; cta: CtaBlock };

const FENCE_OPEN = /^:::(takeaways|see-also|cta)\s*$/i;
const FENCE_CLOSE = /^:::\s*$/;

function parseTakeaways(body: string): string[] {
  return body
    .split("\n")
    .map((l) => l.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
}

function parseSeeAlso(body: string): SeeAlsoItem[] {
  const items: SeeAlsoItem[] = [];
  for (const line of body.split("\n")) {
    const trimmed = line.replace(/^[-*]\s+/, "").trim();
    if (!trimmed) continue;
    // [Label](/path): reason  OR  [Label](/path)
    const m = trimmed.match(/^\[([^\]]+)\]\(([^)]+)\)(?:\s*[:—–-]\s*(.+))?$/);
    if (m) {
      items.push({ label: m[1], href: m[2], reason: m[3]?.trim() });
      continue;
    }
    items.push({ label: trimmed, href: "#", reason: undefined });
  }
  return items;
}

function parseCta(body: string): CtaBlock {
  const fields: Record<string, string> = {};
  for (const line of body.split("\n")) {
    const m = line.match(/^(title|body|href|label)\s*:\s*(.+)$/i);
    if (m) fields[m[1].toLowerCase()] = m[2].trim();
  }
  return {
    title: fields.title,
    body: fields.body || body.trim(),
    href: fields.href || "/articles",
    label: fields.label,
  };
}

/** First pass: extract :::takeaways / :::see-also / :::cta fences. */
export function splitCustomFences(markdown: string): ArticleSegment[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const segments: ArticleSegment[] = [];
  let buffer: string[] = [];
  let i = 0;

  const flushMd = () => {
    const content = buffer.join("\n");
    if (content.trim()) segments.push({ type: "markdown", content });
    buffer = [];
  };

  while (i < lines.length) {
    const open = lines[i].match(FENCE_OPEN);
    if (!open) {
      buffer.push(lines[i]);
      i += 1;
      continue;
    }

    flushMd();
    const kind = open[1].toLowerCase();
    i += 1;
    const bodyLines: string[] = [];
    while (i < lines.length && !FENCE_CLOSE.test(lines[i])) {
      bodyLines.push(lines[i]);
      i += 1;
    }
    if (i < lines.length && FENCE_CLOSE.test(lines[i])) i += 1;

    const body = bodyLines.join("\n").trim();
    if (kind === "takeaways") {
      segments.push({ type: "takeaways", items: parseTakeaways(body) });
    } else if (kind === "see-also") {
      segments.push({ type: "see-also", items: parseSeeAlso(body) });
    } else if (kind === "cta") {
      segments.push({ type: "cta", cta: parseCta(body) });
    }
  }

  flushMd();
  return segments;
}

/**
 * Full pipeline: custom fences, then GitHub callouts inside markdown chunks.
 */
export function splitArticleContent(markdown: string): ArticleSegment[] {
  const outer = splitCustomFences(markdown);
  const result: ArticleSegment[] = [];

  for (const seg of outer) {
    if (seg.type !== "markdown") {
      result.push(seg);
      continue;
    }
    const inner: CalloutSegment[] = splitMarkdownCallouts(seg.content);
    for (const piece of inner) {
      if (piece.type === "markdown") {
        if (piece.content.trim()) result.push(piece);
      } else {
        result.push(piece);
      }
    }
  }

  return result;
}

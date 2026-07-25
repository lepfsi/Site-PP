/**
 * GitHub-style alerts (`> [!NOTE]`) are NOT part of CommonMark / GFM base.
 * We split them out of the markdown stream so the UI can render framed callouts
 * without leaking markers or duplicating labels.
 *
 * Supported: NOTE, TIP, IMPORTANT, WARNING, CAUTION, INFO
 */

export type CalloutKind = "note" | "tip" | "important" | "warning" | "caution" | "info";

const ALERT_RE = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO)\]\s*(.*)$/i;

const LABELS: Record<CalloutKind, { en: string; fr: string }> = {
  note: { en: "Note", fr: "Note" },
  tip: { en: "Tip", fr: "Astuce" },
  important: { en: "Important", fr: "Important" },
  warning: { en: "Warning", fr: "Attention" },
  caution: { en: "Caution", fr: "Prudence" },
  info: { en: "Info", fr: "Info" },
};

export type MarkdownSegment =
  | { type: "markdown"; content: string }
  | { type: "callout"; kind: CalloutKind; content: string };

function normalizeKind(raw: string): CalloutKind {
  const k = raw.toLowerCase();
  if (k === "note" || k === "tip" || k === "important" || k === "warning" || k === "caution" || k === "info") {
    return k;
  }
  return "note";
}

export function calloutLabel(kind: CalloutKind, lang: "EN" | "FR" = "EN"): string {
  const meta = LABELS[kind];
  return lang === "FR" ? meta.fr : meta.en;
}

/**
 * Split markdown into plain body chunks and callout chunks.
 * Callout body has no marker and no label line — the React layer adds the label once.
 */
export function splitMarkdownCallouts(markdown: string): MarkdownSegment[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const segments: MarkdownSegment[] = [];
  let buffer: string[] = [];
  let i = 0;

  const flushMarkdown = () => {
    const content = buffer.join("\n").trim();
    if (content) segments.push({ type: "markdown", content });
    buffer = [];
  };

  while (i < lines.length) {
    const match = lines[i].match(ALERT_RE);
    if (!match) {
      buffer.push(lines[i]);
      i += 1;
      continue;
    }

    flushMarkdown();

    const kind = normalizeKind(match[1]);
    const bodyLines: string[] = [];
    const sameLine = match[2]?.trim() ?? "";
    if (sameLine) bodyLines.push(sameLine);

    i += 1;
    while (i < lines.length && lines[i].startsWith(">")) {
      if (ALERT_RE.test(lines[i])) break;
      const body = lines[i].replace(/^>\s?/, "");
      bodyLines.push(body);
      i += 1;
    }

    const content = bodyLines.join("\n").replace(/^\n+|\n+$/g, "").trim();
    segments.push({ type: "callout", kind, content });
  }

  flushMarkdown();
  return segments;
}

/** Framed callout styles — left accent + soft fill + border, no emoji. */
export function calloutVisual(kind: CalloutKind): {
  border: string;
  bg: string;
  labelColor: string;
  ring: string;
} {
  switch (kind) {
    case "tip":
      return {
        border: "border-l-turquoise",
        bg: "bg-turquoise/[0.07]",
        labelColor: "text-turquoise",
        ring: "border-turquoise/25",
      };
    case "important":
      return {
        border: "border-l-rose-500",
        bg: "bg-rose-500/[0.07]",
        labelColor: "text-rose-400",
        ring: "border-rose-500/25",
      };
    case "warning":
      return {
        border: "border-l-amber-500",
        bg: "bg-amber-500/[0.08]",
        labelColor: "text-amber-400",
        ring: "border-amber-500/25",
      };
    case "caution":
      return {
        border: "border-l-orange-500",
        bg: "bg-orange-500/[0.08]",
        labelColor: "text-orange-400",
        ring: "border-orange-500/25",
      };
    case "info":
      return {
        border: "border-l-sky-500",
        bg: "bg-sky-500/[0.07]",
        labelColor: "text-sky-400",
        ring: "border-sky-500/25",
      };
    case "note":
    default:
      return {
        border: "border-l-text-secondary/50",
        bg: "bg-bg-secondary/50",
        labelColor: "text-text-secondary",
        ring: "border-border-main",
      };
  }
}

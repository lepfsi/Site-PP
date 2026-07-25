/**
 * GitHub-style alerts (`> [!NOTE]`) are NOT part of CommonMark / GFM base
 * and are ignored by react-markdown unless preprocessed.
 *
 * We convert them to standard blockquotes with a typed label line that
 * ArticleMarkdown can style as DailyOps callouts.
 *
 * Supported: NOTE, TIP, IMPORTANT, WARNING, CAUTION, INFO
 */

export type CalloutKind = "note" | "tip" | "important" | "warning" | "caution" | "info";

const ALERT_RE = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO)\]\s*(.*)$/i;

const LABELS: Record<CalloutKind, { emoji: string; en: string; fr: string }> = {
  note: { emoji: "ℹ️", en: "Note", fr: "Note" },
  tip: { emoji: "💡", en: "Tip", fr: "Astuce" },
  important: { emoji: "🔴", en: "Important", fr: "Important" },
  warning: { emoji: "⚠️", en: "Warning", fr: "Attention" },
  caution: { emoji: "⚠️", en: "Caution", fr: "Prudence" },
  info: { emoji: "ℹ️", en: "Info", fr: "Info" },
};

function normalizeKind(raw: string): CalloutKind {
  const k = raw.toLowerCase();
  if (k === "note" || k === "tip" || k === "important" || k === "warning" || k === "caution" || k === "info") {
    return k;
  }
  return "note";
}

/**
 * Transform GFM alert syntax into standard markdown blockquotes.
 */
export function preprocessMarkdownCallouts(markdown: string, lang: "EN" | "FR" = "EN"): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const match = lines[i].match(ALERT_RE);
    if (!match) {
      out.push(lines[i]);
      i += 1;
      continue;
    }

    const kind = normalizeKind(match[1]);
    const meta = LABELS[kind];
    const label = lang === "FR" ? meta.fr : meta.en;
    const sameLine = match[2]?.trim() ?? "";

    // Title line of the blockquote (detectable by the renderer)
    out.push(`> ${meta.emoji} **${label}**`);

    if (sameLine) {
      out.push(`> ${sameLine}`);
    }

    i += 1;

    // Consume following blockquote lines of this alert
    while (i < lines.length && lines[i].startsWith(">")) {
      // Nested / next alert starts a new block
      if (ALERT_RE.test(lines[i])) break;

      const body = lines[i].replace(/^>\s?/, "");
      // Skip empty quote-only lines at start after title
      if (body.trim() === "" && out[out.length - 1] === `> ${meta.emoji} **${label}**`) {
        i += 1;
        continue;
      }
      out.push(`> ${body}`);
      i += 1;
    }

    // Ensure a blank line after the callout for clean paragraph separation
    if (i < lines.length && lines[i].trim() !== "") {
      out.push("");
    }
  }

  return out.join("\n");
}

/** Detect callout kind from rendered blockquote text (first line / full text). */
export function detectCalloutKind(text: string): CalloutKind | null {
  const t = text.trim();
  if (!t) return null;

  // GFM leftover (if preprocess missed)
  const gfm = t.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO)\]/i);
  if (gfm) return normalizeKind(gfm[1]);

  // Emoji / label heuristics (EN + FR)
  if (/^(💡|tip|astuce)\b/i.test(t) || /\*\*(tip|astuce)\*\*/i.test(t.slice(0, 40))) return "tip";
  if (/^(🔴|important)\b/i.test(t) || /\*\*important\*\*/i.test(t.slice(0, 40))) return "important";
  if (/^(⚠️|warning|attention|caution|prudence)\b/i.test(t) || /\*\*(warning|attention|caution|prudence)\*\*/i.test(t.slice(0, 48))) {
    if (/caution|prudence/i.test(t.slice(0, 48))) return "caution";
    return "warning";
  }
  if (/^(ℹ️|info|note)\b/i.test(t) || /\*\*(note|info)\*\*/i.test(t.slice(0, 40))) {
    if (/^ℹ️?\s*\*?\*?info/i.test(t)) return "info";
    return "note";
  }

  // French editorial convention: "Note terrain"
  if (/note terrain/i.test(t.slice(0, 40))) return "note";

  return null;
}

export function calloutVisual(kind: CalloutKind): {
  border: string;
  bg: string;
  label: string;
} {
  switch (kind) {
    case "tip":
      return {
        border: "border-turquoise",
        bg: "bg-turquoise/8",
        label: "Tip",
      };
    case "important":
      return {
        border: "border-rose-500/70",
        bg: "bg-rose-500/8",
        label: "Important",
      };
    case "warning":
    case "caution":
      return {
        border: "border-amber-500/70",
        bg: "bg-amber-500/8",
        label: kind === "caution" ? "Caution" : "Warning",
      };
    case "info":
    case "note":
    default:
      return {
        border: "border-turquoise/60",
        bg: "bg-turquoise/6",
        label: kind === "info" ? "Info" : "Note",
      };
  }
}

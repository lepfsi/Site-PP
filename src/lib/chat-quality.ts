/**
 * Detect low-quality / toxic / corrupted model outputs (esp. free gateways).
 * Used to reject replies before they reach visitors.
 */

export type QualityFailReason =
  | "too_short"
  | "replacement_chars"
  | "high_repetition"
  | "script_mismatch"
  | "abuse_markers"
  | "garbled";

export interface QualityResult {
  ok: boolean;
  reason?: QualityFailReason;
}

/** Count CJK unified ideographs (common in Chinese spam dumps). */
function countCjk(text: string): number {
  const m = text.match(/[\u4e00-\u9fff]/g);
  return m ? m.length : 0;
}

function countLatinLetters(text: string): number {
  const m = text.match(/[A-Za-zÀ-ÿ]/g);
  return m ? m.length : 0;
}

/** Detect heavy n-gram repetition (same spam loop). */
function hasHighRepetition(text: string): boolean {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length < 40) return false;

  // Sliding 12-char windows
  const window = 12;
  const counts = new Map<string, number>();
  for (let i = 0; i <= cleaned.length - window; i += 1) {
    const slice = cleaned.slice(i, i + window);
    counts.set(slice, (counts.get(slice) ?? 0) + 1);
  }

  let max = 0;
  for (const n of counts.values()) max = Math.max(max, n);
  // Same 12-char chunk 6+ times → almost certainly a loop
  if (max >= 6) return true;

  // Whole-line spam
  const lines = cleaned.split(/[\n。.!？?]/).map((l) => l.trim()).filter((l) => l.length > 8);
  if (lines.length >= 4) {
    const freq = new Map<string, number>();
    for (const line of lines) freq.set(line, (freq.get(line) ?? 0) + 1);
    for (const n of freq.values()) {
      if (n >= 3) return true;
    }
  }

  return false;
}

/** Unicode replacement character or mojibake clusters */
function hasReplacementChars(text: string): boolean {
  if (text.includes("\uFFFD") || text.includes("�")) return true;
  // Dense �-like sequences sometimes arrive as question marks after encode issues
  if ((text.match(/\?{3,}/g) ?? []).length >= 2) return true;
  return false;
}

/**
 * Heuristic abuse / jailbreak dump markers seen on free endpoints.
 * Deliberately broad for CJK insults + "ollama" spam patterns.
 */
function hasAbuseMarkers(text: string): boolean {
  const lower = text.toLowerCase();
  if (lower.includes("ollama闹") || lower.includes("闹麻了")) return true;
  // Common Chinese insult patterns (substring checks, not full lexicon)
  if (/傻[逼比]|你妈|去死| ent死|fuck you|nigg/.test(text)) return true;
  return false;
}

/**
 * For FR/EN DailyOps UI: reject replies that are mostly CJK with almost no Latin.
 * Allows short mixed technical quotes.
 */
function scriptMismatchForSiteLang(text: string, siteLang: "FR" | "EN"): boolean {
  if (siteLang !== "FR" && siteLang !== "EN") return false;
  const cjk = countCjk(text);
  const latin = countLatinLetters(text);
  if (cjk < 8) return false;
  // Mostly Chinese, almost no Latin → not a valid DailyOps reply
  if (cjk > 20 && latin < 12) return true;
  if (cjk > latin * 3 && cjk > 15) return true;
  return false;
}

export function assessReplyQuality(text: string, siteLang: "FR" | "EN"): QualityResult {
  const trimmed = text.trim();
  if (trimmed.length < 2) return { ok: false, reason: "too_short" };
  if (hasReplacementChars(trimmed)) return { ok: false, reason: "replacement_chars" };
  if (hasAbuseMarkers(trimmed)) return { ok: false, reason: "abuse_markers" };
  if (hasHighRepetition(trimmed)) return { ok: false, reason: "high_repetition" };
  if (scriptMismatchForSiteLang(trimmed, siteLang)) return { ok: false, reason: "script_mismatch" };

  // Extreme garble: high symbol ratio
  const symbols = (trimmed.match(/[^\p{L}\p{N}\s.,;:!?'"()\-–—/\\]/gu) ?? []).length;
  if (trimmed.length > 30 && symbols / trimmed.length > 0.35) {
    return { ok: false, reason: "garbled" };
  }

  return { ok: true };
}

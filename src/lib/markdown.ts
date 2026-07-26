import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

/** Always strip YAML frontmatter, even if gray-matter fails (e.g. unquoted `:` in titles). */
export function stripFrontmatter(raw: string): string {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/);
  if (match) {
    return text.slice(match[0].length).replace(/^\n+/, "").trim();
  }
  return text.trim();
}

export function hasMarkdownContent(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, slug, "en.md"));
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface MarkdownMeta {
  updated?: string;
  title?: string;
  excerpt?: string;
  /** Optional FAQ for JSON-LD FAQPage (runbooks). */
  faq?: FaqItem[];
}

function parseFaq(raw: unknown): FaqItem[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const items: FaqItem[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const q = r.q != null ? String(r.q).trim() : r.question != null ? String(r.question).trim() : "";
    const a = r.a != null ? String(r.a).trim() : r.answer != null ? String(r.answer).trim() : "";
    if (q && a) items.push({ q, a });
  }
  return items.length > 0 ? items : undefined;
}

export function getMarkdownMeta(slug: string, lang: "EN" | "FR"): MarkdownMeta | null {
  const file = lang === "EN" ? "en.md" : "fr.md";
  const filePath = path.join(CONTENT_DIR, slug, file);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    const { data } = matter(raw);
    const updated = data.updated != null ? String(data.updated) : undefined;
    const title = data.title != null ? String(data.title) : undefined;
    const excerpt = data.excerpt != null ? String(data.excerpt) : undefined;
    const faq = parseFaq(data.faq);
    return { updated, title, excerpt, faq };
  } catch {
    return {};
  }
}

export function getMarkdownBody(slug: string, lang: "EN" | "FR"): string | null {
  const file = lang === "EN" ? "en.md" : "fr.md";
  const filePath = path.join(CONTENT_DIR, slug, file);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    const { content } = matter(raw);
    const body = content.trim();
    // gray-matter can leave frontmatter in content when YAML is invalid
    if (body.startsWith("---") || /^title:\s/m.test(body.slice(0, 80))) {
      return stripFrontmatter(raw);
    }
    return body;
  } catch {
    return stripFrontmatter(raw);
  }
}

export function getMarkdownBodies(slug: string): { EN: string | null; FR: string | null } | null {
  if (!hasMarkdownContent(slug)) return null;

  return {
    EN: getMarkdownBody(slug, "EN"),
    FR: getMarkdownBody(slug, "FR"),
  };
}

export function getMarkdownMetas(slug: string): {
  EN: MarkdownMeta | null;
  FR: MarkdownMeta | null;
} | null {
  if (!hasMarkdownContent(slug)) return null;
  return {
    EN: getMarkdownMeta(slug, "EN"),
    FR: getMarkdownMeta(slug, "FR"),
  };
}

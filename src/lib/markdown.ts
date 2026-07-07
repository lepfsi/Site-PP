import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

export function hasMarkdownContent(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, slug, "en.md"));
}

export function getMarkdownBody(slug: string, lang: "EN" | "FR"): string | null {
  const file = lang === "EN" ? "en.md" : "fr.md";
  const filePath = path.join(CONTENT_DIR, slug, file);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  return content.trim();
}

export function getMarkdownBodies(slug: string): { EN: string | null; FR: string | null } | null {
  if (!hasMarkdownContent(slug)) return null;

  return {
    EN: getMarkdownBody(slug, "EN"),
    FR: getMarkdownBody(slug, "FR"),
  };
}
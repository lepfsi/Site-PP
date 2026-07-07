import { ARTICLES } from "./articles";
import { CATEGORIES } from "./categories";

export type SearchResult = {
  id: string;
  type: "article" | "category";
  href: string;
  titleKey: string;
  subtitleKey?: string;
};

export const QUICK_LINKS = [
  { key: "search.link1", href: "/articles/bgp-communities-policy-routing" },
  { key: "search.link2", href: "/articles/zero-trust-freeipa-vault" },
  { key: "search.link3", href: "/articles/kubernetes-network-policies" },
] as const;

export function searchSite(query: string, t: (key: string) => string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const article of ARTICLES) {
    const title = t(article.titleKey).toLowerCase();
    const excerpt = t(article.excerptKey).toLowerCase();
    const category = t(article.categoryLabelKey).toLowerCase();
    if (title.includes(q) || excerpt.includes(q) || category.includes(q)) {
      results.push({
        id: `article-${article.slug}`,
        type: "article",
        href: `/articles/${article.slug}`,
        titleKey: article.titleKey,
        subtitleKey: article.categoryLabelKey,
      });
    }
  }

  for (const cat of CATEGORIES) {
    const name = t(cat.nameKey).toLowerCase();
    const desc = t(cat.descKey).toLowerCase();
    const tagMatch = cat.tags.some((tag) => tag.toLowerCase().includes(q));
    if (name.includes(q) || desc.includes(q) || tagMatch) {
      results.push({
        id: `category-${cat.slug}`,
        type: "category",
        href: `/category/${cat.slug}`,
        titleKey: cat.nameKey,
        subtitleKey: cat.shortDescKey,
      });
    }
  }

  return results.slice(0, 12);
}
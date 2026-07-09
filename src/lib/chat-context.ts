import { getAllArticles } from "./articles";
import { CATEGORIES } from "./categories";
import { translations, type Language } from "./translations";
import { SITE } from "./site";

export function buildChatSiteContext(lang: Language): string {
  const t = translations[lang];
  const articles = getAllArticles();

  const categories = CATEGORIES.map((c) => {
    const name = t[c.nameKey as keyof typeof t] as string;
    const desc = t[c.shortDescKey as keyof typeof t] as string;
    return `- ${name} (/category/${c.slug}): ${desc}`;
  }).join("\n");

  const articleList = articles
    .map((a) => {
      const title = t[a.titleKey as keyof typeof t] as string;
      const excerpt = t[a.excerptKey as keyof typeof t] as string;
      return `- ${title} (/articles/${a.slug}) — ${excerpt}`;
    })
    .join("\n");

  return `
Site: ${SITE.name} (${SITE.url})
Contact: ${SITE.contactEmail}
About: ${SITE.url}/about
Contact form: ${SITE.url}/about#contact

Categories:
${categories}

Published articles:
${articleList}

Resources: ${SITE.url}/resources
Field experience: ${SITE.url}/experience
Newsletter: ${SITE.url}/#newsletter
`.trim();
}
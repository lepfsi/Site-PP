import { getAllArticles } from "./articles";
import { CATEGORIES } from "./categories";
import { getAllExperiences } from "./experiences";
import { translations, type Language } from "./translations";
import { SITE } from "./site";

export function getDailyOpsBrandKnowledge(lang: Language): string {
  const t = translations[lang];
  const domains = CATEGORIES.map((c) => t[c.nameKey as keyof typeof t] as string).join(", ");

  return `
Mission: ${t["about.dailyops_desc"]}
Tagline: ${t["hero.title_main"]} — ${t["hero.title_sub"]}
Pitch: ${t["hero.desc"]}
Founder: ${t["about.author_name"]} — ${t["about.author_role"]}
Founder background: ${t["about.author_bio"]}
Editorial line: ${t["about.mission"]}
Domains covered: ${domains}
`.trim();
}

export function buildCompactKnowledge(lang: Language): string {
  const t = translations[lang];
  const domains = CATEGORIES.map((c) => {
    const name = t[c.nameKey as keyof typeof t] as string;
    return `${name} (/category/${c.slug})`;
  }).join(", ");

  const articleTitles = getAllArticles()
    .map((a) => `${t[a.titleKey as keyof typeof t]} (/articles/${a.slug})`)
    .join("; ");

  const expTitles = getAllExperiences()
    .map((e) => `${t[e.titleKey as keyof typeof t]} (/experience/${e.slug})`)
    .join("; ");

  return `
Identity: DailyOps.Tech — production-first ops knowledge platform. ${t["hero.desc"]}
Founder: ${t["about.author_name"]}, ${t["about.author_role"]}. ${t["about.mission"]}
Domains: ${domains}
Articles: ${articleTitles}
Field experience: ${expTitles}
Pages: /about /articles /experience /resources /about#contact
Contact: ${SITE.contactEmail}
`.trim();
}

export function buildChatSiteContext(lang: Language, compact = true): string {
  if (compact) return buildCompactKnowledge(lang);

  const t = translations[lang];
  const articles = getAllArticles();
  const experiences = getAllExperiences();
  const brand = getDailyOpsBrandKnowledge(lang);

  const categories = CATEGORIES.map((c) => {
    const name = t[c.nameKey as keyof typeof t] as string;
    const desc = t[c.shortDescKey as keyof typeof t] as string;
    return `• ${name} (/category/${c.slug}): ${desc}`;
  }).join("\n");

  const articleList = articles
    .map((a) => {
      const title = t[a.titleKey as keyof typeof t] as string;
      const excerpt = t[a.excerptKey as keyof typeof t] as string;
      return `• ${title} → /articles/${a.slug} — ${excerpt}`;
    })
    .join("\n");

  const experienceList = experiences
    .map((e) => {
      const title = t[e.titleKey as keyof typeof t] as string;
      const desc = t[e.descKey as keyof typeof t] as string;
      return `• ${title} → /experience/${e.slug} — ${desc}`;
    })
    .join("\n");

  return `${brand}\n\nCategories:\n${categories}\n\nArticles:\n${articleList}\n\nExperience:\n${experienceList}`;
}
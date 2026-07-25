import { getAllArticles } from "./articles";
import { CATEGORIES } from "./categories";
import { getAllExperiences } from "./experiences";
import { getAllLabPaths } from "./labs";
import {
  PLATFORM_PRODUCTS,
  ROADMAP_PRODUCTS,
  SOFTWARE_PRODUCTS,
} from "./products";
import { translations, type Language, type TranslationKeys } from "./translations";
import { SITE } from "./site";

function tr(lang: Language, key: keyof TranslationKeys): string {
  return translations[lang][key] ?? String(key);
}

/** Products catalog for the chat (OpsGate, OpsVault, platform, roadmap). */
export function getProductsKnowledge(lang: Language): string {
  const software = SOFTWARE_PRODUCTS.map((p) => {
    const tagline = tr(lang, `products.${p.id}.tagline` as keyof TranslationKeys);
    const desc = tr(lang, `products.${p.id}.desc` as keyof TranslationKeys);
    const article = p.articleSlug ? ` Related article: /articles/${p.articleSlug}` : "";
    const gh = p.github ? ` GitHub: ${p.github}` : "";
    return `• ${p.name} (${p.status}) — ${tagline}. ${desc} Page: ${p.href}.${article}${gh}`;
  }).join("\n");

  const platform = PLATFORM_PRODUCTS.map((p) => {
    const desc = tr(lang, `products.${p.id}.desc` as keyof TranslationKeys);
    return `• ${p.name} — ${desc} → ${p.ctaHref}`;
  }).join("\n");

  const roadmap = ROADMAP_PRODUCTS.map((p) => {
    const desc = tr(lang, `products.${p.id}.desc` as keyof TranslationKeys);
    return `• ${p.name} (planned) — ${desc}`;
  }).join("\n");

  return `
## DailyOps products (FIRST-PARTY — do not confuse with AppGate, OPSWAT, etc.)
OpsGate and OpsVault are DailyOps.Tech software products. They are NOT AppGate, OPSWAT, SecurityGate, or Gatewatcher.

Software suite:
${software}

Knowledge platform:
${platform}

Roadmap (not released):
${roadmap}

Products page: /products
`.trim();
}

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

${getProductsKnowledge(lang)}
`.trim();
}

export function buildCompactKnowledge(lang: Language): string {
  const t = translations[lang];
  const domains = CATEGORIES.map((c) => {
    const name = t[c.nameKey as keyof typeof t] as string;
    return `${name} (/category/${c.slug})`;
  }).join(", ");

  // Keep list short for latency — full titles only for recent slice
  const articleTitles = getAllArticles()
    .slice(0, 12)
    .map((a) => `${t[a.titleKey as keyof typeof t]} (/articles/${a.slug})`)
    .join("; ");

  const expTitles = getAllExperiences()
    .map((e) => `${t[e.titleKey as keyof typeof t]} (/experience/${e.slug})`)
    .join("; ");

  const labTitles = getAllLabPaths()
    .map((p) => `${t[p.titleKey as keyof typeof t]} (/labs/${p.slug})`)
    .join("; ");

  return `
Identity: DailyOps.Tech — production-first ops knowledge platform. ${t["hero.desc"]}
Founder: ${t["about.author_name"]}, ${t["about.author_role"]}. ${t["about.mission"]}
Domains: ${domains}
Articles (sample): ${articleTitles}
Field experience: ${expTitles}
Ops labs (learning paths): ${labTitles}
Pages: /about /articles /labs /products /experience /resources /about#contact
Contact: ${SITE.contactEmail}

${getProductsKnowledge(lang)}
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
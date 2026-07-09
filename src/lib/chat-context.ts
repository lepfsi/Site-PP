import { getAllArticles } from "./articles";
import { CATEGORIES } from "./categories";
import { translations, type Language } from "./translations";
import { SITE } from "./site";
import type { ChatSource } from "./chat-sources";

interface BrandReplyLink {
  label: string;
  href: string;
}

export function getDailyOpsBrandKnowledge(lang: Language): string {
  const t = translations[lang];
  const about = t["about.dailyops_desc"];
  const hero = t["hero.desc"];
  const tagline = `${t["hero.title_main"]} — ${t["hero.title_sub"]}`;

  const domains = CATEGORIES.map((c) => {
    const name = t[c.nameKey as keyof typeof t] as string;
    return name;
  }).join(", ");

  return `
Brand tagline: ${tagline}
Hero summary: ${hero}

About DailyOps (authoritative — use this to answer "what is DailyOps", "who are you", "tell me about the site"):
${about}

Six content domains: ${domains}
Editorial focus: production-ready playbooks, baselines, field experience, troubleshooting — no marketing fluff.
`.trim();
}

export function buildChatSiteContext(lang: Language): string {
  const t = translations[lang];
  const articles = getAllArticles();
  const brand = getDailyOpsBrandKnowledge(lang);

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
About page: /about
About DailyOps section: /about#dailyops
Contact form: /about#contact

=== BRAND KNOWLEDGE (Tier 1 — answer questions about DailyOps itself from this section) ===
${brand}

Categories:
${categories}

Published articles:
${articleList}

Resources: /resources
Field experience: /experience
Newsletter: /#newsletter
`.trim();
}

export function buildAboutBrandReply(lang: Language): {
  reply: string;
  links: BrandReplyLink[];
  sources: ChatSource[];
} {
  const t = translations[lang];
  const intro =
    lang === "FR"
      ? "Voici ce qu'est DailyOps.Tech :\n\n"
      : "Here is what DailyOps.Tech is:\n\n";

  return {
    reply: intro + t["about.dailyops_desc"],
    links: [
      { label: lang === "FR" ? "À propos" : "About", href: "/about" },
      { label: lang === "FR" ? "DailyOps en détail" : "DailyOps details", href: "/about#dailyops" },
      { label: lang === "FR" ? "Articles" : "Articles", href: "/articles" },
      { label: lang === "FR" ? "Retours terrain" : "Field experience", href: "/experience" },
    ],
    sources: [
      {
        tier: "dailyops",
        label: lang === "FR" ? "À propos de DailyOps" : "About DailyOps",
        url: "/about#dailyops",
      },
    ],
  };
}
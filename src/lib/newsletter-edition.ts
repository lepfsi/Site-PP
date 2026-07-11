import { getArticleBySlug, getRecentArticles, type Article } from "./articles";
import {
  buildNewsletterBroadcastEmail,
  type NewsletterArticleItem,
  type NewsletterEditionInput,
} from "./email-templates";
import { SITE } from "./site";
import { translations, type Language, type TranslationKeys } from "./translations";

function tr(lang: Language, key: keyof TranslationKeys): string {
  return translations[lang][key] ?? String(key);
}

function articleToItem(lang: Language, article: Article): NewsletterArticleItem {
  return {
    title: tr(lang, article.titleKey as keyof TranslationKeys),
    category: tr(lang, article.categoryLabelKey as keyof TranslationKeys),
    excerpt: tr(lang, article.excerptKey as keyof TranslationKeys),
    href: `${SITE.url}/articles/${article.slug}`,
    readTime: article.readTime,
  };
}

function formatEditionDate(lang: Language, date = new Date()): string {
  return date.toLocaleDateString(lang === "FR" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function buildSampleNewsletterEdition(
  lang: Language = "FR",
  options?: { articleSlugs?: string[]; editionDate?: Date },
): { subject: string; html: string; edition: NewsletterEditionInput } {
  const articles = options?.articleSlugs?.length
    ? options.articleSlugs
        .map((slug) => getArticleBySlug(slug))
        .filter((article): article is Article => Boolean(article))
    : getRecentArticles(3);

  const editionDate = options?.editionDate ?? new Date();
  const dateLabel = formatEditionDate(lang, editionDate);
  const items = articles.map((article) => articleToItem(lang, article));

  const edition: NewsletterEditionInput = {
    lang,
    editionLabel: lang === "FR" ? `OPS MAIL · ${dateLabel}` : `OPS MAIL · ${dateLabel}`,
    preheader:
      lang === "FR"
        ? "Playbooks, retours terrain et ressources ops de la semaine."
        : "This week's ops playbooks, field notes, and resources.",
    title: lang === "FR" ? "Cette semaine sur DailyOps" : "This week on DailyOps",
    introHtml:
      lang === "FR"
        ? `<p>Voici la sélection ops de la semaine : guides production-ready, runbooks et ressources pour vos shifts.</p>`
        : `<p>Your weekly ops roundup: production-ready guides, runbooks, and resources for your shifts.</p>`,
    articles: items,
    tipHtml:
      lang === "FR"
        ? `<strong>Astuce ops :</strong> gardez un runbook « premier diagnostic » par service critique — MTTR divisé par deux en incident.`
        : `<strong>Ops tip:</strong> keep a "first diagnostic" runbook per critical service — you'll cut MTTR in half during incidents.`,
    cta: {
      label: lang === "FR" ? "Explorer Ops Labs" : "Explore Ops Labs",
      href: `${SITE.url}/labs`,
    },
  };

  const { subject, html } = buildNewsletterBroadcastEmail(edition);
  return { subject, html, edition };
}

export function buildNewsletterEditionFromInput(
  input: NewsletterEditionInput,
): { subject: string; html: string } {
  return buildNewsletterBroadcastEmail(input);
}
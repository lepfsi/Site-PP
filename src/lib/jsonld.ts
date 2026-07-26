import { SITE } from "./site";
import { absoluteUrl, articleLocalePaths, labLocalePaths, tEn, tLang } from "./seo";
import type { Article } from "./articles";
import type { LabPath } from "./labs";
import type { FaqItem } from "./markdown";
import type { Language, TranslationKeys } from "./translations";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/opengraph-image"),
    sameAs: [SITE.linkedin, SITE.x, SITE.facebook, SITE.github].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE.contactEmail,
      contactType: "customer support",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description:
      "Production-ready guides for IT infrastructure professionals — networking, security, cloud and operations.",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    inLanguage: ["en", "fr"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/articles?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(article: Article, lang: Language = "EN") {
  const title = tLang(lang, article.titleKey as keyof TranslationKeys);
  const description = tLang(lang, article.excerptKey as keyof TranslationKeys);
  const paths = articleLocalePaths(article.slug);
  const path = lang === "FR" ? paths.fr : paths.en;
  const url = absoluteUrl(path);
  const category = tLang(lang, article.categoryLabelKey as keyof TranslationKeys);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: lang === "FR" ? "fr" : "en",
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/opengraph-image"),
      },
    },
    articleSection: category,
    image: [absoluteUrl(`/articles/${article.slug}/opengraph-image`)],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(
  items: FaqItem[],
  options: { name: string; description?: string; url: string; lang?: Language }
) {
  if (!items.length) return null;
  const lang = options.lang ?? "EN";
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: options.name,
    description: options.description,
    url: options.url,
    inLanguage: lang === "FR" ? "fr" : "en",
    mainEntity: items.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.a,
      },
    })),
  };
}

/**
 * FAQPage from lab steps (quiz + checklist + lab descriptions).
 */
export function labFaqJsonLd(path: LabPath, lang: Language = "EN") {
  const entities = path.steps
    .filter((s) => s.type === "quiz" || s.type === "checklist" || s.type === "lab")
    .map((s) => {
      const question = tLang(lang, s.titleKey as keyof TranslationKeys);
      const answer = tLang(lang, s.descKey as keyof TranslationKeys)
        .replace(/\n+/g, " ")
        .trim();
      return { q: question, a: answer };
    })
    .filter((q) => q.q && q.a);

  if (entities.length === 0) return null;

  const paths = labLocalePaths(path.slug);
  const urlPath = lang === "FR" ? paths.fr : paths.en;

  return faqPageJsonLd(entities, {
    name: tLang(lang, path.titleKey as keyof TranslationKeys),
    description: tLang(lang, path.descKey as keyof TranslationKeys),
    url: absoluteUrl(urlPath),
    lang,
  });
}

/** Course wrapper for a lab path (complements FAQ). */
export function labCourseJsonLd(path: LabPath, lang: Language = "EN") {
  const paths = labLocalePaths(path.slug);
  const urlPath = lang === "FR" ? paths.fr : paths.en;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: tLang(lang, path.titleKey as keyof TranslationKeys),
    description: tLang(lang, path.descKey as keyof TranslationKeys),
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    url: absoluteUrl(urlPath),
    inLanguage: lang === "FR" ? "fr" : "en",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: tLang(lang, path.durationKey as keyof TranslationKeys),
    },
  };
}

import { SITE } from "./site";
import { absoluteUrl, articleLocalePaths, tEn, tLang } from "./seo";
import type { Article } from "./articles";
import type { LabPath } from "./labs";
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

/**
 * FAQPage from lab steps (quiz + checklist + lab descriptions).
 * Uses EN for stable crawler-facing structured data.
 */
export function labFaqJsonLd(path: LabPath) {
  const entities = path.steps
    .filter((s) => s.type === "quiz" || s.type === "checklist" || s.type === "lab")
    .map((s) => {
      const question = tEn(s.titleKey as keyof TranslationKeys);
      const answer = tEn(s.descKey as keyof TranslationKeys)
        .replace(/\n+/g, " ")
        .trim();
      return {
        "@type": "Question" as const,
        name: question,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: answer,
        },
      };
    })
    .filter((q) => q.name && q.acceptedAnswer.text);

  if (entities.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entities,
    name: tEn(path.titleKey as keyof TranslationKeys),
    description: tEn(path.descKey as keyof TranslationKeys),
    url: absoluteUrl(`/labs/${path.slug}`),
    inLanguage: "en",
  };
}

/** Course/LearningResource wrapper for a lab path (complements FAQ). */
export function labCourseJsonLd(path: LabPath) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: tEn(path.titleKey as keyof TranslationKeys),
    description: tEn(path.descKey as keyof TranslationKeys),
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    url: absoluteUrl(`/labs/${path.slug}`),
    inLanguage: ["en", "fr"],
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: tEn(path.durationKey as keyof TranslationKeys),
    },
  };
}

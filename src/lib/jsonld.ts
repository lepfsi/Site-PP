import { SITE } from "./site";
import { absoluteUrl, tEn } from "./seo";
import type { Article } from "./articles";
import type { TranslationKeys } from "./translations";

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

export function articleJsonLd(article: Article) {
  const title = tEn(article.titleKey as keyof TranslationKeys);
  const description = tEn(article.excerptKey as keyof TranslationKeys);
  const url = absoluteUrl(`/articles/${article.slug}`);
  const category = tEn(article.categoryLabelKey as keyof TranslationKeys);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: ["en", "fr"],
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

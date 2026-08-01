import type { Metadata } from "next";
import { headers } from "next/headers";
import { SITE } from "./site";
import { translations } from "./translations";
import type { Language, TranslationKeys } from "./translations";
import { localeHreflang, localeToLanguage, type Locale, isLocale } from "./i18n";

export function tEn(key: keyof TranslationKeys): string {
  return translations.EN[key];
}

export function tLang(lang: Language, key: keyof TranslationKeys): string {
  return translations[lang][key];
}

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export const DEFAULT_DESCRIPTION =
  "Production-ready guides for IT infrastructure professionals: networking, cybersecurity, cloud, automation, and operations.";

export const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Google Search Console verification meta (set NEXT_PUBLIC_GSC_VERIFICATION). */
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

/** Read locale set by proxy (x-locale header). */
export async function getRequestLocale(): Promise<Locale> {
  try {
    const h = await headers();
    const raw = h.get("x-locale");
    if (raw && isLocale(raw)) return raw;
  } catch {
    /* outside request context */
  }
  return "en";
}

export async function getRequestLanguage(): Promise<Language> {
  return localeToLanguage(await getRequestLocale());
}

export function articleLocalePaths(slug: string) {
  return {
    en: `/en/articles/${slug}`,
    fr: `/fr/articles/${slug}`,
  };
}

export function articleHreflang(slug: string) {
  return localeHreflang(`/articles/${slug}`, absoluteUrl);
}

export function labLocalePaths(slug: string) {
  return {
    en: `/en/labs/${slug}`,
    fr: `/fr/labs/${slug}`,
  };
}

export function labHreflang(slug: string) {
  return localeHreflang(`/labs/${slug}`, absoluteUrl);
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | IT Infrastructure Knowledge Hub`,
    template: `%s | ${SITE.name}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "IT infrastructure",
    "networking",
    "cybersecurity",
    "cloud",
    "automation",
    "DevOps",
    "BGP",
    "Kubernetes",
    "Ansible",
    "Terraform",
    "SOC",
    "runbook",
    "DailyOps",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "fr_FR",
    url: absoluteUrl("/en"),
    siteName: SITE.name,
    title: `${SITE.name} | IT Infrastructure Knowledge Hub`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — IT Infrastructure Knowledge Hub`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DailyOpsTech",
    creator: "@DailyOpsTech",
    title: `${SITE.name} | IT Infrastructure Knowledge Hub`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: absoluteUrl("/en"),
    languages: localeHreflang("/", absoluteUrl),
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: `${SITE.name} RSS` },
        { url: "/rss.xml", title: `${SITE.name} RSS` },
      ],
    },
  },
  category: "technology",
  verification: gscVerification ? { google: gscVerification } : undefined,
};

export function articleMetadata(
  slug: string,
  titleKey: keyof TranslationKeys,
  excerptKey: keyof TranslationKeys,
  options?: { date?: string; category?: string; lang?: Language }
): Metadata {
  const lang = options?.lang ?? "EN";
  const title = tLang(lang, titleKey);
  const description = tLang(lang, excerptKey);
  const paths = articleLocalePaths(slug);
  const path = lang === "FR" ? paths.fr : paths.en;
  const url = absoluteUrl(path);
  const ogImage = `/articles/${slug}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: articleHreflang(slug),
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: SITE.name,
      locale: lang === "FR" ? "fr_FR" : "en_US",
      alternateLocale: lang === "FR" ? "en_US" : "fr_FR",
      publishedTime: options?.date ? `${options.date}T12:00:00.000Z` : undefined,
      modifiedTime: options?.date ? `${options.date}T12:00:00.000Z` : undefined,
      section: options?.category,
      authors: [SITE.name],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function pageMetadata(
  title: string,
  description: string,
  /** Path WITHOUT locale, e.g. `/about` or `/labs` */
  pathWithoutLocale: string,
  options?: { lang?: Language }
): Metadata {
  const lang = options?.lang ?? "EN";
  const locale = lang === "FR" ? "fr" : "en";
  const p =
    pathWithoutLocale === "/"
      ? ""
      : pathWithoutLocale.startsWith("/")
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;
  const path = `/${locale}${p}`;
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: localeHreflang(p || "/", absoluteUrl),
    },
    openGraph: {
      url,
      title,
      description,
      siteName: SITE.name,
      locale: lang === "FR" ? "fr_FR" : "en_US",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function labPathMetadata(
  slug: string,
  titleKey: keyof TranslationKeys,
  descKey: keyof TranslationKeys,
  lang: Language = "EN"
): Metadata {
  const title = tLang(lang, titleKey);
  const description = tLang(lang, descKey);
  return pageMetadata(title, description, `/labs/${slug}`, { lang });
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toRfc822Date(date: string): string {
  return new Date(`${date}T12:00:00Z`).toUTCString();
}

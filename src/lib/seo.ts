import type { Metadata } from "next";
import { SITE } from "./site";
import { translations } from "./translations";
import type { TranslationKeys } from "./translations";

export function tEn(key: keyof TranslationKeys): string {
  return translations.EN[key];
}

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export const DEFAULT_DESCRIPTION =
  "Premium technical knowledge base for IT infrastructure professionals — networking, security, cloud and operations.";

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
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | IT Infrastructure Knowledge Hub`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: "@DailyOpsTech",
    creator: "@DailyOpsTech",
    title: `${SITE.name} | IT Infrastructure Knowledge Hub`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE.url,
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: `${SITE.name} RSS` },
        { url: "/rss.xml", title: `${SITE.name} RSS` },
      ],
    },
  },
};

export function articleMetadata(slug: string, titleKey: keyof TranslationKeys, excerptKey: keyof TranslationKeys): Metadata {
  const title = tEn(titleKey);
  const description = tEn(excerptKey);
  const url = absoluteUrl(`/articles/${slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description, siteName: SITE.name },
    twitter: { card: "summary", title, description },
  };
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
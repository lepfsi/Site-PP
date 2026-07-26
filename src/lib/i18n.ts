import type { Language } from "./translations";

/** URL locale segments (lowercase). */
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localeToLanguage(locale: Locale): Language {
  return locale === "fr" ? "FR" : "EN";
}

export function languageToLocale(lang: Language): Locale {
  return lang === "FR" ? "fr" : "en";
}

/**
 * Prefix a site path with locale.
 * Supports hashes: `/about#contact` → `/en/about#contact`, `/#categories` → `/en#categories`.
 */
export function withLocale(locale: Locale, path: string): string {
  if (!path || path === "/") return `/${locale}`;

  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const pathOnly = hashIdx >= 0 ? path.slice(0, hashIdx) : path;

  if (!pathOnly || pathOnly === "/") {
    return `/${locale}${hash}`;
  }

  const normalized = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  const seg = normalized.split("/").filter(Boolean)[0];
  if (seg && isLocale(seg)) return `${normalized}${hash}`;
  return `/${locale}${normalized}${hash}`;
}

/** Parse `/en/articles/foo` → { locale: 'en', path: '/articles/foo' } */
export function stripLocale(pathname: string): { locale: Locale | null; path: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { locale: null, path: "/" };
  if (isLocale(parts[0])) {
    const rest = parts.slice(1);
    return {
      locale: parts[0],
      path: rest.length ? `/${rest.join("/")}` : "/",
    };
  }
  return { locale: null, path: pathname.startsWith("/") ? pathname : `/${pathname}` };
}

/** Paths that must NOT get a locale prefix (API, feeds, assets, OG). */
export function isLocaleExemptPath(pathname: string): boolean {
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/images")) return true;
  if (pathname === "/feed.xml" || pathname === "/rss.xml") return true;
  if (pathname === "/opengraph-image" || pathname.startsWith("/opengraph-image/")) return true;
  if (pathname === "/favicon.ico" || pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  if (/^\/articles\/[^/]+\/opengraph-image/.test(pathname)) return true;
  if (pathname.startsWith("/newsletter/")) return true;
  if (/\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$/i.test(pathname)) return true;
  return false;
}

export function localeHreflang(
  pathWithoutLocale: string,
  absoluteUrlFn: (path: string) => string
): Record<string, string> {
  const p =
    pathWithoutLocale === "/"
      ? ""
      : pathWithoutLocale.startsWith("/")
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;
  return {
    en: absoluteUrlFn(`/en${p}`),
    fr: absoluteUrlFn(`/fr${p}`),
    "x-default": absoluteUrlFn(`/en${p}`),
  };
}

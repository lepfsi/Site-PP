"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";
import {
  DEFAULT_LOCALE,
  isLocale,
  languageToLocale,
  type Locale,
  withLocale,
} from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Build locale-prefixed paths for links.
 * Prefers URL `[lang]` param; falls back to LanguageContext.
 */
export function useLocalePath() {
  const params = useParams();
  const { lang } = useLanguage();
  const paramLang = typeof params?.lang === "string" ? params.lang : null;
  const locale: Locale = paramLang && isLocale(paramLang) ? paramLang : languageToLocale(lang);

  const lp = useCallback(
    (path: string) => withLocale(locale, path),
    [locale]
  );

  return { locale, lp, lang };
}

export function useLocale(): Locale {
  const params = useParams();
  const { lang } = useLanguage();
  const paramLang = typeof params?.lang === "string" ? params.lang : null;
  if (paramLang && isLocale(paramLang)) return paramLang;
  return languageToLocale(lang) || DEFAULT_LOCALE;
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translations, type Language, type TranslationKeys } from "./translations";
import {
  languageToLocale,
  localeToLanguage,
  stripLocale,
  withLocale,
  type Locale,
} from "./i18n";

const STORAGE_KEY = "dailyops-lang";

const LanguageContext = createContext<
  | {
      lang: Language;
      setLang: (lang: Language) => void;
      t: (key: keyof TranslationKeys | string) => string;
      locale: Locale;
      /** Locale-prefix a path: lp('/articles') → /en/articles */
      lp: (path: string) => string;
      langLocked: boolean;
    }
  | undefined
>(undefined);

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=(en|fr)/);
  return m ? (m[1] as Locale) : null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const pathLocale = stripLocale(pathname).locale;
  const cookieLocale = typeof document !== "undefined" ? readCookieLocale() : null;

  const initialLocale: Locale = pathLocale || cookieLocale || "en";
  const [lang, setLangState] = useState<Language>(() => localeToLanguage(initialLocale));

  // Sync from URL (source of truth for SEO routes)
  useEffect(() => {
    const { locale } = stripLocale(pathname);
    if (locale) {
      setLangState(localeToLanguage(locale));
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "EN" || stored === "FR") setLangState(stored);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = lang === "FR" ? "fr" : "en";
  }, [lang]);

  const locale = languageToLocale(lang);
  const langLocked = Boolean(pathLocale);

  const lp = useCallback((path: string) => withLocale(locale, path), [locale]);

  const setLang = useCallback(
    (newLang: Language) => {
      const nextLocale = languageToLocale(newLang);
      const { path } = stripLocale(pathname);

      // Prefer navigating to the sibling localized URL
      if (pathLocale || pathname.startsWith("/en") || pathname.startsWith("/fr")) {
        const target = withLocale(nextLocale, path === "/" ? "/" : path);
        if (target !== pathname) {
          router.push(target);
          return;
        }
      }

      setLangState(newLang);
      localStorage.setItem(STORAGE_KEY, newLang);
      // Navigate into localized tree so middleware/SEO stay consistent
      router.push(withLocale(nextLocale, path === "/" ? "/" : path));
    },
    [pathname, pathLocale, router]
  );

  const t = (key: keyof TranslationKeys | string) =>
    translations[lang][key as keyof TranslationKeys] ?? String(key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, locale, lp, langLocked }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export type { TranslationKeys, Language };

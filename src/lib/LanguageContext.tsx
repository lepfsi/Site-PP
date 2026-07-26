"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, type Language, type TranslationKeys } from "./translations";

const STORAGE_KEY = "dailyops-lang";

const LanguageContext = createContext<
  | {
      lang: Language;
      setLang: (lang: Language) => void;
      t: (key: keyof TranslationKeys | string) => string;
      /** When true, language is fixed by the route (e.g. /fr/...) */
      langLocked: boolean;
    }
  | undefined
>(undefined);

export function LanguageProvider({
  children,
  defaultLang = "EN",
  forceLang,
}: {
  children: React.ReactNode;
  defaultLang?: Language;
  /** Route-driven locale (SEO /fr/*). Ignores localStorage. */
  forceLang?: Language;
}) {
  const [lang, setLangState] = useState<Language>(forceLang ?? defaultLang);

  useEffect(() => {
    if (forceLang) {
      setLangState(forceLang);
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "EN" || stored === "FR") {
      setLangState(stored);
    }
  }, [forceLang]);

  useEffect(() => {
    document.documentElement.lang = lang === "FR" ? "fr" : "en";
  }, [lang]);

  const setLang = (newLang: Language) => {
    if (forceLang) return; // locked by route
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  const t = (key: keyof TranslationKeys | string) =>
    translations[lang][key as keyof TranslationKeys] ?? String(key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, langLocked: Boolean(forceLang) }}>
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

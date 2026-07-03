"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "FR" | "EN";

interface TranslationKeys {
  "nav.categories": string;
  "nav.articles": string;
  "nav.experience": string;
  "nav.newsletter": string;
  "hero.badge": string;
  "hero.title_top": string;
  "hero.title_bottom": string;
  "hero.desc": string;
  "hero.cta_primary": string;
  "hero.cta_secondary": string;
  "hero.search_placeholder": string;
  "cat.title": string;
  "cat.subtitle": string;
  "exp.title": string;
  "exp.subtitle": string;
  "news.title": string;
  "news.desc": string;
  "news.input": string;
  "news.btn": string;
  "news.feature1": string;
  "news.feature2": string;
  "news.feature3": string;
  "footer.rights": string;
  "footer.made": string;
}

const translations: Record<Language, TranslationKeys> = {
  FR: {
    "nav.categories": "Expertise",
    "nav.articles": "Baseline",
    "nav.experience": "Field Notes",
    "nav.newsletter": "Ops Mail",
    "hero.badge": "v2.4 // STABLE RELEASE",
    "hero.title_top": "Infrastructure",
    "hero.title_bottom": "Operations Excellence",
    "hero.desc": "Le Hub technique pour les Ops modernes. Baselines, RCA et guides sans compromis.",
    "hero.cta_primary": "Accéder aux Nodes",
    "hero.cta_secondary": "Join the NOC",
    "hero.search_placeholder": "Filtrer : BGP, hardening, K8s cluster...",
    "cat.title": "Technical Nodes",
    "cat.subtitle": "Infrastructures et méthodologies de production.",
    "exp.title": "RCA & Field Notes",
    "exp.subtitle": "Analyses d'incidents réels et solutions éprouvées.",
    "news.title": "Production Ready News",
    "news.desc": "L'essentiel de l'infrastructure hebdomadaire.",
    "news.input": "votre.email@ops.tech",
    "news.btn": "Subscribe",
    "news.feature1": "Alertes CVE",
    "news.feature2": "Scripts Sh",
    "news.feature3": "RCA Deep-dive",
    "footer.rights": "Tous droits réservés",
    "footer.made": "Conçu avec passion pour les Ops",
  },
  EN: {
    "nav.categories": "Expertise",
    "nav.articles": "Baseline",
    "nav.experience": "Field Notes",
    "nav.newsletter": "Ops Mail",
    "hero.badge": "v2.4 // STABLE RELEASE",
    "hero.title_top": "Infrastructure",
    "hero.title_bottom": "Operations Excellence",
    "hero.desc": "The technical hub for modern Ops. uncompromising baselines, RCA, and field guides.",
    "hero.cta_primary": "Access Nodes",
    "hero.cta_secondary": "Join the NOC",
    "hero.search_placeholder": "Filter: BGP, hardening, K8s cluster...",
    "cat.title": "Technical Nodes",
    "cat.subtitle": "Production infrastructures and methodologies.",
    "exp.title": "RCA & Field Notes",
    "exp.subtitle": "Real incident analysis and proven solutions.",
    "news.title": "Production Ready News",
    "news.desc": "Weekly infrastructure essentials.",
    "news.input": "your.email@ops.tech",
    "news.btn": "Subscribe",
    "news.feature1": "CVE Alerts",
    "news.feature2": "Sh Scripts",
    "news.feature3": "RCA Deep-dive",
    "footer.rights": "All rights reserved",
    "footer.made": "Designed with passion for Ops",
  }
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
} | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("FR");

  const t = (key: keyof TranslationKeys) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

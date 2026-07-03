"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "FR" | "EN";

interface TranslationKeys {
  "nav.categories": string;
  "nav.articles": string;
  "nav.experience": string;
  "nav.newsletter": string;
  "hero.badge": string;
  "hero.tagline": string;
  "hero.title_part1": string;
  "hero.title_part2": string;
  "hero.desc": string;
  "hero.cta_explore": string;
  "hero.cta_news": string;
  "hero.stat_engineers": string;
  "hero.stat_articles": string;
  "hero.stat_updated": string;
  "hero.monitor_live": string;
  "hero.monitor_network": string;
  "hero.monitor_security": string;
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
    "hero.badge": "v2.4.0 • Base de connaissances active",
    "hero.tagline": "<DailyOps />",
    "hero.title_part1": "L'expertise infrastructure",
    "hero.title_part2": "sans compromis.",
    "hero.desc": "Documentation technique premium, playbooks opérationnels et retours d'expérience terrain pour les ingénieurs système, réseaux et sécurité.",
    "hero.cta_explore": "Explorer les catégories",
    "hero.cta_news": "Newsletter hebdo",
    "hero.stat_engineers": "12K+ Engineers",
    "hero.stat_articles": "450+ Articles",
    "hero.stat_updated": "24/7 Updated",
    "hero.monitor_live": "LIVE MONITORING",
    "hero.monitor_network": "Network Throughput",
    "hero.monitor_security": "Security Events",
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
    "hero.badge": "v2.4.0 • Active Knowledge Base",
    "hero.tagline": "<DailyOps />",
    "hero.title_part1": "Infrastructure expertise",
    "hero.title_part2": "without compromise.",
    "hero.desc": "Premium technical documentation, operational playbooks and field experience for systems, network and security engineers.",
    "hero.cta_explore": "Explore categories",
    "hero.cta_news": "Weekly newsletter",
    "hero.stat_engineers": "12K+ Engineers",
    "hero.stat_articles": "450+ Articles",
    "hero.stat_updated": "24/7 Updated",
    "hero.monitor_live": "LIVE MONITORING",
    "hero.monitor_network": "Network Throughput",
    "hero.monitor_security": "Security Events",
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

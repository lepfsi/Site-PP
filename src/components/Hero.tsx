"use client";

import { ChevronRight, Mail, Code2, Shield, Cloud, Globe, Bug } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const DOMAIN_PILLS = [
  { key: "hero.tag_networking" as const, icon: Globe },
  { key: "hero.tag_cybersecurity" as const, icon: Shield },
  { key: "hero.tag_cloud" as const, icon: Cloud },
  { key: "hero.tag_troubleshooting" as const, icon: Bug },
] as const;

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden noc-grid">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <p className="text-sm font-medium text-turquoise mb-5 tracking-wide">
              {t("hero.badge")}
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] mb-5 max-w-xl">
              <span className="text-text-primary">{t("hero.title_part1")}</span>{" "}
              <span className="text-turquoise">{t("hero.title_part2")}</span>
            </h1>

            <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-lg mb-8">
              {t("hero.desc")}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
              {DOMAIN_PILLS.map(({ key, icon: Icon }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary/80 border border-border-main text-xs font-medium text-text-secondary"
                >
                  <Icon size={13} className="text-turquoise shrink-0" />
                  {t(key)}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                href="#categories"
                className="px-6 py-3 bg-text-primary text-bg-primary text-sm font-semibold rounded-xl flex items-center justify-center transition-colors hover:bg-text-primary/90"
              >
                {t("hero.cta_explore")}
                <ChevronRight size={16} className="ml-1.5" />
              </a>
              <a
                href="#newsletter"
                className="px-6 py-3 bg-bg-secondary border border-border-main text-text-primary text-sm font-semibold rounded-xl flex items-center justify-center transition-colors hover:border-turquoise hover:text-turquoise"
              >
                <Mail size={16} className="mr-2" />
                {t("hero.cta_news")}
              </a>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="rounded-2xl border border-border-main bg-bg-secondary/60 backdrop-blur-sm overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-main bg-navy/40">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs font-mono text-text-secondary/60">dailyops — status</span>
              </div>

              <div className="p-5 font-mono text-sm leading-relaxed space-y-3">
                <div className="flex items-start gap-2 text-text-secondary">
                  <Code2 size={15} className="text-turquoise mt-0.5 shrink-0" />
                  <div>
                    <p className="text-text-primary">{t("hero.status_cmd")}</p>
                    <p className="text-turquoise mt-1">{t("hero.status_line1")}</p>
                    <p className="text-text-secondary/80">{t("hero.status_line2")}</p>
                    <p className="text-text-secondary/80">{t("hero.status_line3")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
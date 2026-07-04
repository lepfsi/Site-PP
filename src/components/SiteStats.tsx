"use client";

import { Users, FileText, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const STATS = [
  { key: "hero.stat_engineers" as const, icon: Users },
  { key: "hero.stat_articles" as const, icon: FileText },
  { key: "hero.stat_updated" as const, icon: RefreshCw },
] as const;

export default function SiteStats() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-border-main bg-bg-secondary/30">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {STATS.map(({ key, icon: Icon }) => (
            <div key={key} className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 rounded-lg bg-turquoise/10 text-turquoise">
                <Icon size={18} />
              </div>
              <span className="text-sm font-semibold text-text-secondary">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import { Download, ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { RESOURCE_SECTIONS } from "@/lib/resources";
import type { LucideIcon } from "lucide-react";

const ACTION_ICONS: Record<string, LucideIcon> = {
  cheatsheets: Download,
  scripts: ExternalLink,
  templates: Download,
  training: Play,
};

export default function ResourcesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-bg-secondary relative overflow-hidden border-t border-border-main">
      <div className="absolute inset-0 tech-grid opacity-[0.04] pointer-events-none"></div>
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-4">
            <span className="text-turquoise">//</span> {t("res.title")}
          </h2>
          <p className="text-text-secondary text-lg font-medium">{t("res.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {RESOURCE_SECTIONS.map((section, index) => {
            const ActionIcon = ACTION_ICONS[section.id] ?? Download;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-xl border border-border-main bg-bg-primary p-6 sm:p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[220px] hover:border-turquoise/40 hover:shadow-lg hover:shadow-turquoise/5"
              >
                <section.icon className="h-10 w-10 text-turquoise mb-6 transition-transform duration-500 group-hover:scale-110" />

                <h3 className="text-lg font-bold text-text-primary mb-2">{t(section.titleKey)}</h3>
                <p className="text-[11px] text-text-secondary font-medium mb-6 leading-relaxed px-2">
                  {t(`res.${index + 1}.desc`)}
                </p>

                <Link
                  href={`/resources#${section.id}`}
                  className="text-turquoise hover:underline text-[11px] font-black uppercase tracking-widest flex items-center mt-auto"
                >
                  {t(section.linkKey)}
                  <ActionIcon size={12} className="ml-1.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
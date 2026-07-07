"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, AlertTriangle, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { getExperiencesForHome } from "@/lib/experiences";
import type { ExperienceCase } from "@/lib/experiences";
import type { LucideIcon } from "lucide-react";

const MUTED_STYLE = {
  color: "border-l-border-main",
  iconColor: "text-turquoise/70",
  bgColor: "bg-bg-primary",
} as const;

const EXP_UI: Record<string, {
  icon: LucideIcon;
  horizontal?: boolean;
  iconContainerColor?: string;
  color?: string;
  iconColor?: string;
  bgColor?: string;
}> = {
  "04": { icon: AlertTriangle, ...MUTED_STYLE },
  "05": { icon: Settings, ...MUTED_STYLE },
  "06": { icon: Shield, ...MUTED_STYLE },
};

function MutedCard({ exp, ui, index }: { exp: ExperienceCase; ui: (typeof EXP_UI)[string]; index: number }) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/experience/${exp.slug}`}
        className={`flex flex-col p-8 ${ui.bgColor} border border-border-main border-l-4 ${ui.color} rounded-r-2xl shadow-lg transition-all hover:border-l-turquoise group h-full`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <ui.icon size={16} className={ui.iconColor} />
          {exp.badgeKey && (
            <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 group-hover:text-turquoise transition-colors">
              {t(exp.badgeKey)}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-4 group-hover:text-turquoise transition-colors">{t(exp.titleKey)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-10 flex-grow font-medium">{t(exp.descKey)}</p>
        {exp.footerKey && (
          <div className="pt-6 border-t border-border-main text-[10px] font-mono text-text-secondary/70 uppercase font-bold tracking-widest flex items-center">
            <Clock size={12} className="mr-1.5" /> {t(exp.footerKey)}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { t } = useLanguage();
  const experiences = getExperiencesForHome(3);

  return (
    <section id="experience" className="py-24 bg-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-5 pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-6"
          >
            {t("exp.title")}
          </motion.h2>
          <div className="flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-text-secondary text-lg max-w-3xl mx-auto font-medium mb-4"
            >
              {t("exp.subtitle")}
            </motion.p>
            <Link
              href="/experience"
              className="flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline group"
            >
              {t("exp.view_all")} <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {experiences.map((exp, index) => (
            <MutedCard key={exp.id} exp={exp} ui={EXP_UI[exp.id]} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
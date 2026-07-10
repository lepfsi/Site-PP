"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Clock, AlertTriangle, Settings, Shield, Network, Move } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { getExperiencesForHome } from "@/lib/experiences";
import SectionHeading from "@/components/SectionHeading";
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
  "01": {
    icon: Network,
    iconContainerColor: "bg-bg-secondary border border-border-main",
    iconColor: "text-turquoise",
    horizontal: true,
  },
  "02": {
    icon: Move,
    iconContainerColor: "bg-bg-secondary border border-border-main",
    iconColor: "text-turquoise",
    horizontal: true,
  },
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

function HorizontalCard({ exp, ui, index }: { exp: ExperienceCase; ui: (typeof EXP_UI)[string]; index: number }) {
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
        className="group flex flex-col md:flex-row items-center p-6 bg-bg-primary border border-border-main rounded-2xl shadow-lg transition-all hover:border-turquoise/30"
      >
        <div className={`flex-shrink-0 w-16 h-16 ${ui.iconContainerColor} rounded-xl flex items-center justify-center ${ui.iconColor} shadow-lg mb-4 md:mb-0 md:mr-8 transition-all group-hover:scale-105`}>
          <ui.icon size={24} />
        </div>

        <div className="flex-grow text-center md:text-left min-w-0">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
            {exp.tagKeys?.map((tagKey) => (
              <span key={tagKey} className="px-2 py-0.5 rounded bg-turquoise/5 text-turquoise text-[9px] font-black uppercase tracking-wider border border-turquoise/10">
                {t(tagKey)}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-turquoise transition-colors">
            {t(exp.titleKey)}
          </h3>
          <p className="text-text-secondary text-sm font-medium leading-relaxed mb-4 line-clamp-2 md:line-clamp-1">
            {t(exp.descKey)}
          </p>

          <div className="flex items-center justify-center md:justify-start space-x-6 text-[10px] font-mono text-text-secondary/70 font-bold uppercase tracking-widest">
            {exp.readTime && (
              <span className="flex items-center"><Clock size={12} className="mr-1.5 text-turquoise" /> {exp.readTime}</span>
            )}
            {exp.views && (
              <span className="flex items-center"><Eye size={12} className="mr-1.5 text-turquoise" /> {exp.views} {t("exp.views")}</span>
            )}
            <span className="hidden md:flex ml-auto items-center text-turquoise group-hover:underline group-hover:translate-x-1 transition-transform">
              {t("exp.read_case")} <ArrowRight size={14} className="ml-1.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { t } = useLanguage();
  const experiences = getExperiencesForHome(5);
  const topCards = experiences.slice(0, 3);
  const horizontalCards = experiences.slice(3, 5);

  return (
    <section id="experience" className="py-16 md:py-20 bg-bg-secondary section-band relative overflow-hidden">
      <div className="absolute inset-0 tech-grid section-grid pointer-events-none" aria-hidden />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <SectionHeading
            subtitle={
              <>
                <p className="text-text-secondary text-base max-w-3xl mx-auto font-medium">{t("exp.subtitle")}</p>
                <Link
                  href="/experience"
                  className="flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline group mt-3"
                >
                  {t("exp.view_all")} <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            }
          >
            {t("exp.title")}
          </SectionHeading>
        </motion.div>

        <div className="flex flex-col space-y-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCards.map((exp, index) => (
              <MutedCard key={exp.id} exp={exp} ui={EXP_UI[exp.id]} index={index} />
            ))}
          </div>

          {horizontalCards.map((exp, index) => (
            <HorizontalCard key={exp.id} exp={exp} ui={EXP_UI[exp.id]} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
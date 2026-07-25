"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Clock, Network, Move } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { getExperiencesForHome } from "@/lib/experiences";
import SectionHeading from "@/components/SectionHeading";
import type { ExperienceCase } from "@/lib/experiences";
import type { LucideIcon } from "lucide-react";

const EXP_ICONS: Record<string, LucideIcon> = {
  "01": Network,
  "02": Move,
  "04": Network,
  "05": Move,
  "06": Network,
};

function ExperienceCard({ exp, index }: { exp: ExperienceCase; index: number }) {
  const { t } = useLanguage();
  const Icon = EXP_ICONS[exp.id] ?? Network;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        href={`/experience/${exp.slug}`}
        className="group flex flex-col h-full rounded-2xl border border-border-main bg-bg-elevated/90 p-6 sm:p-7 shadow-sm transition-colors hover:border-turquoise/35 hover:shadow-[var(--surface-shadow)]"
      >
        {exp.tagKeys && exp.tagKeys.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {exp.tagKeys.map((tagKey) => (
              <span
                key={tagKey}
                className="text-[11px] font-medium text-text-secondary tracking-wide"
              >
                {t(tagKey)}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-main/70 bg-bg-secondary text-turquoise">
            <Icon size={16} strokeWidth={1.75} />
          </div>
          <h3 className="text-[15px] sm:text-base font-semibold text-text-primary leading-snug group-hover:text-turquoise transition-colors">
            {t(exp.titleKey)}
          </h3>
        </div>

        <p className="text-sm text-text-secondary font-normal leading-relaxed mb-5 flex-grow line-clamp-3">
          {t(exp.descKey)}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-border-main/50 text-[12px] font-medium text-text-secondary/70">
          {exp.readTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-turquoise/80" />
              {exp.readTime}
            </span>
          )}
          {exp.views && (
            <span className="inline-flex items-center gap-1.5">
              <Eye size={13} className="text-turquoise/80" />
              {exp.views} {t("exp.views")}
            </span>
          )}
          <span className="inline-flex items-center gap-1 ml-auto text-turquoise text-[12px] font-semibold">
            {t("exp.read_case")}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { t } = useLanguage();
  const experiences = getExperiencesForHome(5);

  return (
    <section id="experience" className="py-16 md:py-24 bg-bg-secondary section-band relative overflow-hidden">
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-12"
        >
          <SectionHeading
            subtitle={
              <>
                <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
                  {t("exp.subtitle")}
                </p>
                <Link
                  href="/experience"
                  className="inline-flex items-center text-[13px] font-semibold text-turquoise hover:underline mt-4"
                >
                  {t("exp.view_all")}
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </>
            }
          >
            {t("exp.title")}
          </SectionHeading>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

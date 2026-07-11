"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Layers, Play } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getAllLabPaths } from "@/lib/labs";
import SectionHeading from "@/components/SectionHeading";

export default function LabsSection() {
  const { t } = useLanguage();
  const paths = getAllLabPaths();

  return (
    <section id="labs" className="py-16 md:py-20 bg-bg-secondary section-band relative overflow-hidden">
      <div className="absolute inset-0 tech-grid section-grid pointer-events-none" />
      <div className="container-custom relative z-10">
        <SectionHeading
          className="mb-10"
          subtitle={<p className="text-text-secondary text-base font-medium">{t("labs.home.subtitle")}</p>}
        >
          {t("labs.home.title")}
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={`/labs/${path.slug}`}
                  className={`group flex flex-col h-full p-6 sm:p-7 rounded-2xl border border-border-main bg-bg-primary transition-all hover:border-turquoise/40 hover:shadow-lg hover:shadow-turquoise/5 ${
                    path.featured ? "ring-1 ring-turquoise/20" : ""
                  }`}
                >
                  {path.featured && (
                    <span className="self-start mb-3 px-2 py-0.5 rounded-md bg-turquoise/10 border border-turquoise/30 text-turquoise text-[8px] font-black uppercase tracking-widest">
                      {t("labs.page.featured")}
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${path.bg} border border-border-main/60 flex items-center justify-center mb-4`}>
                    <Icon size={20} className={path.color} />
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-turquoise transition-colors leading-snug">
                    {t(path.titleKey)}
                  </h3>
                  <p className="text-[11px] text-text-secondary font-medium leading-relaxed mb-4 flex-grow">
                    {t(path.descKey)}
                  </p>
                  <div className="flex items-center gap-3 text-[9px] font-mono text-text-secondary/60 uppercase font-bold tracking-widest pt-4 border-t border-border-main/60">
                    <span className="flex items-center">
                      <Layers size={10} className="mr-1 text-turquoise" />
                      {path.steps.length}
                    </span>
                    <span className="flex items-center">
                      <Clock size={10} className="mr-1 text-turquoise" />
                      {t(path.durationKey)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/labs"
            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline"
          >
            {t("labs.home.view_all")}
            <ArrowRight size={12} className="ml-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
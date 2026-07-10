"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Eye, ArrowRight, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import { useLanguage } from "@/lib/LanguageContext";
import { getAllExperiences } from "@/lib/experiences";
import { CATEGORIES } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";

export default function ExperiencePage() {
  const { t } = useLanguage();
  const allExperiences = getAllExperiences();
  const [filter, setFilter] = useState<CategorySlug | "all">("all");

  const filtered =
    filter === "all"
      ? allExperiences
      : allExperiences.filter((exp) => exp.relatedCategory === filter);

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        <PageHeader
          breadcrumbs={[
            { label: t("catpage.breadcrumb"), href: "/" },
            { label: t("exp.all_title") },
          ]}
          title={t("exp.all_title")}
          subtitle={t("exp.all_subtitle")}
          meta={
            <p className="text-[10px] font-black uppercase tracking-widest text-turquoise">
              {allExperiences.length} {t("exp.all_count")}
            </p>
          }
        />

        <section className="py-8 sm:py-10 bg-bg-primary border-b border-border-main">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === "all"
                    ? "bg-turquoise text-navy"
                    : "bg-bg-secondary border border-border-main text-text-secondary hover:border-turquoise/40"
                }`}
              >
                {t("exp.all_filter_all")}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setFilter(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${
                    filter === cat.slug
                      ? "bg-turquoise text-navy"
                      : "bg-bg-secondary border border-border-main text-text-secondary hover:border-turquoise/40"
                  }`}
                >
                  <cat.icon size={12} className="mr-1.5" />
                  {t(cat.nameKey)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((exp, i) => {
                const category = CATEGORIES.find((c) => c.slug === exp.relatedCategory);
                return (
                  <motion.article
                    key={exp.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={`/experience/${exp.slug}`}
                      className="flex flex-col h-full p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary hover:border-turquoise/40 transition-all group border-l-4 border-l-turquoise/30 hover:border-l-turquoise"
                    >
                      <div className="flex items-center justify-between mb-4 gap-2">
                        {exp.badgeKey ? (
                          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-text-secondary/70 group-hover:text-turquoise transition-colors">
                            <AlertTriangle size={11} />
                            {t(exp.badgeKey)}
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold text-text-secondary/40">#{exp.id}</span>
                        )}
                        {category && (
                          <span className={`px-2 py-0.5 rounded ${category.bg} ${category.color} text-[8px] font-bold uppercase tracking-widest border border-border-main/40`}>
                            {t(category.nameKey)}
                          </span>
                        )}
                      </div>

                      {exp.tagKeys && exp.tagKeys.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {exp.tagKeys.slice(0, 3).map((tagKey) => (
                            <span
                              key={tagKey}
                              className="px-2 py-0.5 rounded bg-turquoise/5 text-turquoise text-[8px] font-black uppercase tracking-wider border border-turquoise/10"
                            >
                              {t(tagKey)}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-lg font-bold text-text-primary mb-3 group-hover:text-turquoise transition-colors leading-tight flex-grow">
                        {t(exp.titleKey)}
                      </h2>
                      <p className="text-text-secondary text-xs mb-6 font-medium leading-relaxed line-clamp-3">
                        {t(exp.descKey)}
                      </p>

                      <div className="flex justify-between items-center pt-4 border-t border-border-main text-[9px] font-mono text-text-secondary/60 font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          {exp.readTime && (
                            <span className="flex items-center">
                              <Clock size={10} className="mr-1" /> {exp.readTime}
                            </span>
                          )}
                          {exp.views && (
                            <span className="flex items-center">
                              <Eye size={10} className="mr-1" /> {exp.views}
                            </span>
                          )}
                          {exp.footerKey && !exp.readTime && (
                            <span className="flex items-center truncate max-w-[140px]">
                              <Clock size={10} className="mr-1 shrink-0" />
                              <span className="truncate">{t(exp.footerKey)}</span>
                            </span>
                          )}
                        </div>
                        <span className="flex items-center text-turquoise group-hover:underline">
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
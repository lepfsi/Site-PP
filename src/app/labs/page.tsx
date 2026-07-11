"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Layers, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import { useLanguage } from "@/lib/LanguageContext";
import { getAllLabPaths } from "@/lib/labs";
import { getCategoryBySlug } from "@/lib/categories";

export default function LabsPage() {
  const { t } = useLanguage();
  const paths = getAllLabPaths();

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        <PageHeader
          grid="tech"
          breadcrumbs={[
            { label: t("catpage.breadcrumb"), href: "/" },
            { label: t("labs.page.title") },
          ]}
          title={t("labs.page.title")}
          subtitle={t("labs.page.subtitle")}
          meta={
            <p className="text-[10px] font-black uppercase tracking-widest text-turquoise">
              {paths.length} {t("labs.page.count")}
            </p>
          }
        />

        <section className="py-10 sm:py-14 bg-bg-primary border-b border-border-main">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {paths.map((path, index) => {
                const category = getCategoryBySlug(path.category);
                const Icon = path.icon;

                return (
                  <motion.article
                    key={path.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`relative flex flex-col rounded-2xl border border-border-main bg-bg-secondary p-6 sm:p-8 transition-all hover:border-turquoise/40 hover:shadow-lg hover:shadow-turquoise/5 ${
                      path.featured ? "ring-1 ring-turquoise/25" : ""
                    }`}
                  >
                    {path.featured && (
                      <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-turquoise/10 border border-turquoise/30 text-turquoise text-[8px] font-black uppercase tracking-widest">
                        {t("labs.page.featured")}
                      </span>
                    )}

                    <div className={`w-12 h-12 rounded-xl ${path.bg} border border-border-main/60 flex items-center justify-center mb-5`}>
                      <Icon size={22} className={path.color} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${path.color}`}>
                        {category ? t(category.nameKey) : ""}
                      </span>
                      <span className="text-text-secondary/40">·</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary/60">
                        {t(path.levelKey)}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-text-primary mb-3 leading-snug">
                      {t(path.titleKey)}
                    </h2>
                    <p className="text-text-secondary text-sm font-medium leading-relaxed mb-6 flex-grow">
                      {t(path.descKey)}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-text-secondary/70 uppercase font-bold tracking-widest mb-6 pt-5 border-t border-border-main/60">
                      <span className="flex items-center">
                        <Layers size={12} className="mr-1.5 text-turquoise" />
                        {path.steps.length} {t("labs.page.steps")}
                      </span>
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1.5 text-turquoise" />
                        {t(path.durationKey)}
                      </span>
                    </div>

                    <Link
                      href={`/labs/${path.slug}`}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-turquoise text-navy text-[10px] font-black uppercase tracking-widest hover:bg-turquoise-dark transition-all group"
                    >
                      <Play size={12} className="mr-2" />
                      {t("labs.page.start")}
                      <ArrowRight size={12} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
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
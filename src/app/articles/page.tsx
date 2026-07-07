"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { CategorySlug } from "@/lib/categories";

export default function ArticlesPage() {
  const { t } = useLanguage();
  const allArticles = getAllArticles();
  const [filter, setFilter] = useState<CategorySlug | "all">("all");

  const filtered =
    filter === "all"
      ? allArticles
      : allArticles.filter((a) => a.category === filter);

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex-grow pt-28">
        <header className="relative py-16 sm:py-20 border-b border-border-main bg-bg-secondary/30 overflow-hidden">
          <div className="absolute inset-0 noc-grid opacity-20 pointer-events-none"></div>
          <div className="container-custom relative z-10">
            <nav className="flex items-center mb-8 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-turquoise transition-colors">{t("catpage.breadcrumb")}</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-text-primary">{t("articles.all_title")}</span>
            </nav>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight code-font mb-4"
            >
              <span className="text-turquoise">//</span> {t("articles.all_title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary text-lg font-medium max-w-2xl mb-6"
            >
              {t("articles.all_subtitle")}
            </motion.p>
            <p className="text-[10px] font-black uppercase tracking-widest text-turquoise">
              {allArticles.length} {t("articles.all_count")}
            </p>
          </div>
        </header>

        <section className="py-12 sm:py-16">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === "all"
                    ? "bg-turquoise text-navy"
                    : "bg-bg-secondary border border-border-main text-text-secondary hover:border-turquoise/40"
                }`}
              >
                {t("nav.articles")}
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
              {filtered.map((article, i) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex flex-col h-full p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary hover:border-turquoise/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-0.5 rounded ${article.bg} ${article.color} text-[9px] font-bold uppercase tracking-widest border border-border-main`}>
                        {t(article.categoryLabelKey)}
                      </span>
                      {article.featured && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-turquoise">★</span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-text-primary mb-3 group-hover:text-turquoise transition-colors leading-tight flex-grow">
                      {t(article.titleKey)}
                    </h2>
                    <p className="text-text-secondary text-xs mb-6 font-medium leading-relaxed line-clamp-3">
                      {t(article.excerptKey)}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-border-main text-[9px] font-mono text-text-secondary/60 font-bold uppercase tracking-widest">
                      <span className="flex items-center">
                        <Clock size={10} className="mr-1" /> {article.readTime}
                      </span>
                      <span className="flex items-center text-turquoise group-hover:underline">
                        <FileText size={10} className="mr-1" />
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
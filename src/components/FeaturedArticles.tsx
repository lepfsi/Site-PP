"use client";

import { Clock, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { getFeaturedArticle, getRecentArticles } from "@/lib/articles";
import ArticleVisual from "@/components/article-visuals/ArticleVisual";
import SectionHeading from "@/components/SectionHeading";

export default function FeaturedArticles() {
  const { t } = useLanguage();
  const featured = getFeaturedArticle();
  const recentArticles = getRecentArticles(6);

  return (
    <section id="articles" className="relative overflow-hidden py-16 md:py-24 section-band">
      {/* Same layered feel as homepage hero */}
      <div className="absolute inset-0 bg-bg-primary" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 15%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%), radial-gradient(ellipse 50% 45% at 90% 80%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 65%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 noc-grid hero-grid opacity-[0.3] dark:opacity-90" aria-hidden />

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
                <p className="text-text-secondary text-base font-medium">{t("articles.featured_subtitle")}</p>
                <Link href="/articles" className="flex items-center text-[13px] font-semibold text-turquoise hover:underline group mt-3">
                  {t("articles.view_all")} <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </>
            }
          >
            {t("articles.featured_title")}
          </SectionHeading>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto surface-card rounded-2xl overflow-hidden mb-16 group hover:border-turquoise/30 transition-all"
        >
          <Link href={`/articles/${featured.slug}`} className="block">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
              <div className="lg:col-span-5 h-56 lg:h-auto border-b lg:border-b-0 lg:border-r border-border-main/50 relative overflow-hidden">
                <ArticleVisual slug={featured.slug} category={featured.category} variant="article" />
              </div>
              
              <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className={`px-2.5 py-0.5 rounded-md ${featured.bg} ${featured.color} text-[11px] font-semibold tracking-wide border border-border-main/30`}>
                    {t(featured.categoryLabelKey)}
                  </span>
                  <span className="text-[12px] text-text-secondary/70 font-medium">
                    {featured.readTime} {t("articles.read_time")}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary mb-4 leading-tight group-hover:text-turquoise transition-colors tracking-tight">
                  {t(featured.titleKey)}
                </h3>
                
                <p className="text-text-secondary text-sm md:text-base mb-8 leading-relaxed font-medium opacity-80">
                  {t(featured.excerptKey)}
                </p>
                
                <div className="flex items-center space-x-3 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-turquoise/10 flex items-center justify-center border border-turquoise/20 font-bold text-[11px] text-turquoise">
                    D
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-text-primary leading-none">{t("articles.author")}</div>
                    <div className="text-[11px] text-text-secondary/50 mt-1">{featured.date}</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {recentArticles.map((article, index) => (
            <motion.article 
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                href={`/articles/${article.slug}`}
                className="p-6 sm:p-8 surface-card rounded-2xl flex flex-col h-full hover:border-turquoise/30 transition-all group relative"
              >
                <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none rounded-2xl"></div>
                
                <div className="mb-4 relative z-10">
                  <span className={`px-2 py-0.5 rounded-md ${article.bg} ${article.color} text-[11px] font-semibold tracking-wide border border-border-main/30`}>
                    {t(article.categoryLabelKey)}
                  </span>
                </div>
                
                <h4 className="text-lg font-semibold text-text-primary mb-3 leading-tight group-hover:text-turquoise transition-colors relative z-10">
                  {t(article.titleKey)}
                </h4>
                
                <p className="text-text-secondary text-sm mb-8 flex-grow font-medium leading-relaxed opacity-80 relative z-10">
                  {t(article.excerptKey)}
                </p>
                
                <div className="flex justify-between items-center pt-5 border-t border-border-main/50 text-[12px] text-text-secondary/60 font-medium relative z-10">
                  <span className="flex items-center"><Clock size={13} className="mr-1.5" /> {article.readTime}</span>
                  <span>{article.date}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
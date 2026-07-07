"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import CategoryVisual from "@/components/category-visuals/CategoryVisual";
import type { Article } from "@/lib/articles";
import type { CategoryConfig } from "@/lib/categories";

interface CategoryFeaturedArticleProps {
  article: Article;
  category: CategoryConfig;
}

export default function CategoryFeaturedArticle({ article, category }: CategoryFeaturedArticleProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-10 rounded-2xl border border-border-main bg-bg-secondary overflow-hidden shadow-2xl hover:border-turquoise/30 transition-all group ${category.border}`}
    >
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[280px]">
          <div className="lg:col-span-5 h-52 lg:h-auto border-b lg:border-b-0 lg:border-r border-border-main/50 relative">
            <CategoryVisual slug={category.slug} variant="article" />
            <span className={`absolute top-4 left-4 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.2em] border border-white/5 ${article.bg} ${article.color}`}>
              {t("catpage.spotlight")}
            </span>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-[9px] font-mono text-text-secondary/50 font-bold uppercase tracking-widest">
              <span className={`px-2 py-0.5 rounded ${article.bg} ${article.color} border border-white/5`}>
                {t(article.categoryLabelKey)}
              </span>
              <span className="flex items-center"><Clock size={10} className="mr-1" /> {article.readTime}</span>
              <span className="flex items-center"><Calendar size={10} className="mr-1" /> {article.date}</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-text-primary leading-tight group-hover:text-turquoise transition-colors tracking-tight">
              {t(article.titleKey)}
            </h3>

            <p className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed mt-4 mb-6 opacity-80 line-clamp-3">
              {t(article.excerptKey)}
            </p>

            <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise group-hover:underline mt-auto">
              {t("catpage.read_node")} <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
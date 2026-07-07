"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import CategoryVisual from "@/components/category-visuals/CategoryVisual";
import type { Article } from "@/lib/articles";
import type { CategoryConfig } from "@/lib/categories";

interface ArticleCategoryCardProps {
  article: Article;
  category: CategoryConfig;
  index: number;
}

export default function ArticleCategoryCard({ article, category, index }: ArticleCategoryCardProps) {
  const { t } = useLanguage();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/articles/${article.slug}`}
        className="block rounded-2xl border border-border-main bg-bg-secondary hover:border-turquoise/40 transition-all group overflow-hidden"
      >
        <div className="relative h-24 sm:h-28 border-b border-border-main/50 overflow-hidden">
          <CategoryVisual slug={category.slug} variant="card" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/90 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black text-text-secondary/30 mb-3 uppercase tracking-[0.2em]">
            <FileText className="h-3 w-3" />
            {article.date} // {t("catpage.stable")}
            <span className="flex items-center ml-auto">
              <Clock size={10} className="mr-1" /> {article.readTime}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-2 group-hover:text-turquoise transition-colors leading-tight line-clamp-2">
            {t(article.titleKey)}
          </h2>
          <p className="text-text-secondary text-sm mb-4 leading-relaxed font-medium line-clamp-2 opacity-80">
            {t(article.excerptKey)}
          </p>
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise group-hover:underline">
            {t("catpage.read_node")} <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
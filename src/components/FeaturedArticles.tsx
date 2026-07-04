"use client";

import { Clock, Calendar, Lock, Box, Network, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const articles = [
  {
    titleKey: "articles.1.title" as const,
    excerptKey: "articles.1.excerpt" as const,
    categoryKey: "articles.1.category" as const,
    date: "15 Jan 2024",
    readTime: "12 min",
    icon: Lock,
  },
  {
    titleKey: "articles.2.title" as const,
    excerptKey: "articles.2.excerpt" as const,
    categoryKey: "articles.2.category" as const,
    date: "12 Jan 2024",
    readTime: "15 min",
    icon: Box,
  },
  {
    titleKey: "articles.3.title" as const,
    excerptKey: "articles.3.excerpt" as const,
    categoryKey: "articles.3.category" as const,
    date: "10 Jan 2024",
    readTime: "18 min",
    icon: Network,
  },
];

export default function FeaturedArticles() {
  const { t } = useLanguage();

  return (
    <section id="articles" className="py-20 bg-deepblue">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-turquoise">// </span>{t("articles.title")}
          </h2>
          <p className="text-foreground/50 text-lg">{t("articles.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {articles.map((article, index) => (
            <motion.div
              key={article.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col rounded-xl border border-bluedark bg-deepblue p-6 group hover:border-turquoise transition-all"
            >
              <div className="w-full h-48 bg-bluedark/30 rounded-lg mb-4 flex items-center justify-center text-turquoise opacity-70 group-hover:opacity-100 transition-opacity">
                <article.icon className="h-16 w-16" />
              </div>

              <div className="mb-3">
                <span className="px-2 py-1 rounded-md bg-turquoise/10 text-turquoise text-[10px] font-bold uppercase tracking-wider">
                  {t(article.categoryKey)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-turquoise transition-colors cursor-pointer">
                {t(article.titleKey)}
              </h3>

              <p className="text-foreground/50 text-sm mb-6 flex-grow leading-relaxed">
                {t(article.excerptKey)}
              </p>

              <div className="flex justify-between items-center text-xs text-foreground/30 border-t border-bluedark pt-4">
                <span className="flex items-center"><Clock className="mr-2 h-3 w-3" /> {article.readTime}</span>
                <span className="flex items-center"><Calendar className="mr-2 h-3 w-3" /> {article.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="#" className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-turquoise to-turquoise-dark text-navy font-bold hover:scale-105 transition-all shadow-lg shadow-turquoise/20">
            {t("articles.view_all")} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
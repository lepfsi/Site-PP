"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import { useLanguage } from "@/lib/LanguageContext";
import { RESOURCE_SECTIONS } from "@/lib/resources";
import { getArticleBySlug } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ResourcesPage() {
  const { t } = useLanguage();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        <PageHeader
          grid="tech"
          breadcrumbs={[
            { label: t("catpage.breadcrumb"), href: "/" },
            { label: t("res.page.title") },
          ]}
          title={t("res.page.title")}
          subtitle={t("res.page.subtitle")}
        />

        <section className="py-10 sm:py-14 bg-bg-primary border-b border-border-main">
          <div className="container-custom space-y-20">
            {RESOURCE_SECTIONS.map((section, index) => {
              const category = section.categorySlug ? getCategoryBySlug(section.categorySlug) : undefined;
              const articles = section.articleSlugs
                .map((slug) => getArticleBySlug(slug))
                .filter(Boolean);

              return (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="scroll-mt-32"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-turquoise/10 border border-turquoise/20 flex items-center justify-center text-turquoise">
                        <section.icon size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-text-primary">{t(section.titleKey)}</h2>
                        <p className="text-text-secondary text-sm font-medium mt-1 max-w-xl">{t(section.descKey)}</p>
                      </div>
                    </div>
                    {category && (
                      <Link
                        href={`/category/${category.slug}`}
                        className="sm:ml-auto text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline flex items-center"
                      >
                        {t("res.page.view_category")} <ArrowRight size={12} className="ml-1.5" />
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map((article) => (
                      <Link
                        key={article!.slug}
                        href={`/articles/${article!.slug}`}
                        className="group p-6 rounded-2xl border border-border-main bg-bg-secondary hover:border-turquoise/40 transition-all"
                      >
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${article!.color}`}>
                          {t(article!.categoryLabelKey)}
                        </span>
                        <h3 className="text-base font-bold text-text-primary group-hover:text-turquoise transition-colors mt-2 leading-snug">
                          {t(article!.titleKey)}
                        </h3>
                        <p className="text-text-secondary text-sm font-medium mt-2 line-clamp-2">
                          {t(article!.excerptKey)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
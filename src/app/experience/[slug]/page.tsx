"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { getExperienceBySlug } from "@/lib/experiences";
import { getArticleBySlug } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, ArrowLeft, Eye, FileText } from "lucide-react";

export default function ExperiencePage() {
  const params = useParams();
  const { t } = useLanguage();
  const slug = params.slug as string;
  const experience = getExperienceBySlug(slug);

  if (!experience) {
    return (
      <main className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-28">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">404</h1>
            <Link href="/experience" className="text-turquoise hover:underline text-sm font-bold uppercase tracking-widest">
              {t("exp.page.back")}
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const relatedArticle = experience.relatedArticleSlug
    ? getArticleBySlug(experience.relatedArticleSlug)
    : undefined;
  const relatedCategory = experience.relatedCategory
    ? getCategoryBySlug(experience.relatedCategory)
    : undefined;

  const bodyParagraphs = t(experience.bodyKey).split("\n\n");

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex-grow pt-28">
        <header className="relative py-10 sm:py-12 border-b border-border-main bg-bg-secondary/30 overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none"></div>
          <div className="scanline"></div>
          <div className="container-custom relative z-10">
            <nav className="flex flex-wrap items-center mb-5 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-turquoise transition-colors">{t("catpage.breadcrumb")}</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <Link href="/experience" className="hover:text-turquoise transition-colors">{t("exp.title")}</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-text-primary truncate max-w-[200px] sm:max-w-none">{t(experience.titleKey)}</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {experience.badgeKey && (
                  <span className="px-3 py-1 rounded-lg bg-turquoise/10 text-turquoise text-[10px] font-black uppercase tracking-[0.2em] border border-turquoise/20">
                    {t(experience.badgeKey)}
                  </span>
                )}
                {experience.tagKeys?.map((tagKey) => (
                  <span
                    key={tagKey}
                    className="px-2 py-0.5 rounded bg-turquoise/5 text-turquoise text-[9px] font-black uppercase tracking-wider border border-turquoise/10"
                  >
                    {t(tagKey)}
                  </span>
                ))}
                {experience.readTime && (
                  <span className="flex items-center text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                    <Clock size={12} className="mr-1.5" /> {experience.readTime}
                  </span>
                )}
                {experience.views && (
                  <span className="flex items-center text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                    <Eye size={12} className="mr-1.5" /> {experience.views} {t("exp.views")}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-black text-text-primary tracking-tight code-font leading-snug mb-4">
                {t(experience.titleKey)}
              </h1>

              <p className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed mb-6 max-w-3xl">
                {t(experience.descKey)}
              </p>

              {experience.footerKey && (
                <div className="text-[10px] font-mono text-text-secondary/70 font-bold uppercase tracking-widest flex items-center">
                  <Clock size={12} className="mr-1.5 text-turquoise" /> {t(experience.footerKey)}
                </div>
              )}
            </motion.div>
          </div>
        </header>

        <section className="py-16 sm:py-20 bg-bg-primary border-b border-border-main">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <article className="lg:col-span-8">
                <div className="prose-custom space-y-6">
                  {bodyParagraphs.map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-text-secondary text-base sm:text-lg leading-relaxed font-medium"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                <Link
                  href="/experience"
                  className="inline-flex items-center mt-12 text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline group"
                >
                  <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  {t("exp.page.back")}
                </Link>
              </article>

              <aside className="lg:col-span-4 space-y-8">
                {relatedArticle && relatedCategory && (
                  <div className="p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/50 mb-6 border-b border-border-main pb-4">
                      {t("exp.page.related")}
                    </h3>
                    <Link href={`/articles/${relatedArticle.slug}`} className="block group">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${relatedArticle.color}`}>
                        {t(relatedArticle.categoryLabelKey)}
                      </span>
                      <h4 className="text-sm font-bold text-text-primary group-hover:text-turquoise transition-colors mt-1 leading-snug">
                        {t(relatedArticle.titleKey)}
                      </h4>
                    </Link>
                    <Link
                      href={`/category/${relatedCategory.slug}`}
                      className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline"
                    >
                      {t("cat.articles")} →
                    </Link>
                  </div>
                )}

                <div className="p-6 sm:p-8 rounded-2xl bg-text-primary text-bg-primary relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-3">{t("catpage.need_expertise")}</h3>
                    <p className="text-sm text-bg-primary/50 mb-6 leading-relaxed">
                      {t("catpage.expertise_desc")}
                    </p>
                    <Link href="/about">
                      <button className="w-full py-3 bg-turquoise text-navy text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
                        {t("catpage.contact_noc")}
                      </button>
                    </Link>
                  </div>
                  <FileText className="absolute -right-6 -bottom-6 h-32 w-32 text-bg-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleMarkdown from "@/components/ArticleMarkdown";
import { useLanguage } from "@/lib/LanguageContext";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Calendar, ArrowLeft, FileText, Share2 } from "lucide-react";

interface ArticlePageClientProps {
  markdownBodies?: { EN: string | null; FR: string | null } | null;
}

export default function ArticlePageClient({ markdownBodies }: ArticlePageClientProps) {
  const params = useParams();
  const { t, lang } = useLanguage();
  const slug = params.slug as string;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <main className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-28">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">404</h1>
            <Link href="/articles" className="text-turquoise hover:underline text-sm font-bold uppercase tracking-widest">
              {t("article.back")}
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const category = getCategoryBySlug(article.category);
  const relatedArticles = getArticlesByCategory(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const markdownBody = markdownBodies?.[lang] ?? null;
  const bodyParagraphs =
    !markdownBody && article.bodyKey ? t(article.bodyKey).split("\n\n") : [];

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex-grow pt-28">
        <header className="relative py-16 sm:py-20 border-b border-border-main bg-bg-secondary/30 overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none"></div>
          <div className="scanline"></div>
          <div className="container-custom relative z-10">
            <nav className="flex flex-wrap items-center mb-8 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-turquoise transition-colors">{t("catpage.breadcrumb")}</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <Link href={`/category/${article.category}`} className="hover:text-turquoise transition-colors">
                {t(category.nameKey)}
              </Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-text-primary truncate max-w-[200px] sm:max-w-none">{t(article.titleKey)}</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-lg ${article.bg} ${article.color} text-[10px] font-black uppercase tracking-[0.2em] border border-white/5`}>
                  {t(article.categoryLabelKey)}
                </span>
                <span className="flex items-center text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                  <Clock size={12} className="mr-1.5" /> {article.readTime} {t("articles.read_time")}
                </span>
                <span className="flex items-center text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                  <FileText size={12} className="mr-1.5" /> {t("catpage.stable")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight code-font leading-tight mb-6">
                {t(article.titleKey)}
              </h1>

              <p className="text-text-secondary text-lg font-medium leading-relaxed mb-8 max-w-3xl">
                {t(article.excerptKey)}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-widest">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-turquoise/10 flex items-center justify-center border border-turquoise/20 font-black text-[10px] text-turquoise mr-3">
                    D
                  </div>
                  <div>
                    <div className="text-text-primary">{t("articles.author")}</div>
                    <div className="flex items-center mt-1">
                      <Calendar size={10} className="mr-1" />
                      {t("article.published")} {article.date}
                    </div>
                  </div>
                </div>
                <button className="flex items-center text-turquoise hover:underline ml-auto">
                  <Share2 size={12} className="mr-1.5" /> {t("article.share")}
                </button>
              </div>
            </motion.div>
          </div>
        </header>

        <section className="py-16 sm:py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <article className="lg:col-span-8">
                {markdownBody ? (
                  <ArticleMarkdown content={markdownBody} />
                ) : (
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
                )}

                <Link
                  href="/articles"
                  className="inline-flex items-center mt-12 text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline group"
                >
                  <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  {t("article.back")}
                </Link>
              </article>

              <aside className="lg:col-span-4 space-y-8">
                <div className={`p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary ${category.color}`}>
                  <category.icon size={32} className="mb-4" />
                  <h3 className="text-xl font-bold text-text-primary mb-2">{t(category.nameKey)}</h3>
                  <p className="text-text-secondary text-sm font-medium leading-relaxed mb-4">
                    {t(category.descKey)}
                  </p>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline"
                  >
                    {t("cat.articles")} →
                  </Link>
                </div>

                {relatedArticles.length > 0 && (
                  <div className="p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/50 mb-6 border-b border-border-main pb-4">
                      {t("article.related")}
                    </h3>
                    <ul className="space-y-4">
                      {relatedArticles.map((related) => (
                        <li key={related.slug}>
                          <Link href={`/articles/${related.slug}`} className="block group">
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${related.color}`}>
                              {t(related.categoryLabelKey)}
                            </span>
                            <h4 className="text-sm font-bold text-text-primary group-hover:text-turquoise transition-colors mt-1 leading-snug">
                              {t(related.titleKey)}
                            </h4>
                          </Link>
                        </li>
                      ))}
                    </ul>
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
                  <category.icon className="absolute -right-6 -bottom-6 h-32 w-32 text-bg-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
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
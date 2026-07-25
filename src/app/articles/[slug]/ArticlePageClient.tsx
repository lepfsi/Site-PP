"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleMarkdown from "@/components/ArticleMarkdown";
import ReadingProgressBar from "@/components/article/ReadingProgressBar";
import ArticleToc from "@/components/article/ArticleToc";
import ArticleToolbar, { type FontScale } from "@/components/article/ArticleToolbar";
import BackToTop from "@/components/article/BackToTop";
import ArticleContinue from "@/components/article/ArticleContinue";
import { useLanguage } from "@/lib/LanguageContext";
import { getAllArticles, getArticleBySlug, getArticlesByCategory } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";
import { extractToc, estimateReadMinutes, formatReadTime } from "@/lib/article-reading";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Calendar, ArrowLeft, FileText, RefreshCw } from "lucide-react";
import ArticleShareButton from "@/components/ArticleShareButton";
import StickySidebar from "@/components/StickySidebar";
import LabArticleNav from "@/components/LabArticleNav";
import { getLabStepNavigation } from "@/lib/labs";

interface ArticlePageClientProps {
  markdownBodies?: { EN: string | null; FR: string | null } | null;
  markdownMeta?: {
    EN: { updated?: string } | null;
    FR: { updated?: string } | null;
  } | null;
  labContext?: { pathSlug: string; stepId: string } | null;
}

const FONT_CLASS: Record<FontScale, string> = {
  sm: "article-font-sm",
  md: "article-font-md",
  lg: "article-font-lg",
};

export default function ArticlePageClient({
  markdownBodies,
  markdownMeta,
  labContext,
}: ArticlePageClientProps) {
  const params = useParams();
  const { t, lang } = useLanguage();
  const slug = params.slug as string;
  const article = getArticleBySlug(slug);
  const [fontScale, setFontScale] = useState<FontScale>("sm");
  const [readingMode, setReadingMode] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const markdownBody = markdownBodies?.[lang] ?? null;
  const toc = useMemo(
    () => (markdownBody ? extractToc(markdownBody) : []),
    [markdownBody]
  );
  const computedMinutes = useMemo(
    () => (markdownBody ? estimateReadMinutes(markdownBody) : null),
    [markdownBody]
  );

  if (!article) {
    return (
      <main className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-28">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">404</h1>
            <Link
              href="/articles"
              className="text-turquoise hover:underline text-sm font-bold uppercase tracking-widest"
            >
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

  // Next article: next in chronological list (ARTICLES is newest-first → previous index), else first related
  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex((a) => a.slug === article.slug);
  const nextArticle =
    (currentIndex >= 0 && currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null) ||
    relatedArticles[0] ||
    null;

  const bodyParagraphs =
    !markdownBody && article.bodyKey ? t(article.bodyKey).split("\n\n") : [];

  const labNav = labContext
    ? getLabStepNavigation(labContext.pathSlug, labContext.stepId)
    : null;

  const readLabel =
    computedMinutes != null
      ? `${formatReadTime(computedMinutes, lang)} ${t("articles.read_time")}`
      : `${article.readTime} ${t("articles.read_time")}`;

  const updated = markdownMeta?.[lang]?.updated;

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <ReadingProgressBar targetId="article-body" />
      <Navbar />
      <div className="flex-grow pt-28">
        <header className="relative py-10 sm:py-12 border-b border-border-main surface-header overflow-hidden print:border-0">
          <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none print:hidden" />
          <div className="scanline print:hidden" />
          <div className="container-custom relative z-10">
            <nav className="flex flex-wrap items-center mb-5 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em] print:hidden">
              <Link href="/" className="hover:text-turquoise transition-colors">
                {t("catpage.breadcrumb")}
              </Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              {labNav ? (
                <>
                  <Link href="/labs" className="hover:text-turquoise transition-colors">
                    {t("labs.page.title")}
                  </Link>
                  <ChevronRight className="mx-2 h-3 w-3" />
                  <Link
                    href={`/labs/${labNav.path.slug}`}
                    className="hover:text-turquoise transition-colors truncate max-w-[140px] sm:max-w-none"
                  >
                    {t(labNav.path.titleKey)}
                  </Link>
                </>
              ) : (
                <Link
                  href={`/category/${article.category}`}
                  className="hover:text-turquoise transition-colors"
                >
                  {t(category.nameKey)}
                </Link>
              )}
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-text-primary truncate max-w-[200px] sm:max-w-none">
                {t(article.titleKey)}
              </span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-lg ${article.bg} ${article.color} text-[10px] font-black uppercase tracking-[0.2em] border border-border-main/40`}
                >
                  {t(article.categoryLabelKey)}
                </span>
                <span className="flex items-center text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                  <Clock size={12} className="mr-1.5" /> {readLabel}
                </span>
                <span className="flex items-center text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                  <FileText size={12} className="mr-1.5" /> {t("catpage.stable")}
                </span>
                {updated ? (
                  <span className="flex items-center text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                    <RefreshCw size={12} className="mr-1.5" /> {t("article.updated")} {updated}
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-black text-text-primary tracking-tight code-font leading-snug mb-4">
                {t(article.titleKey)}
              </h1>

              <p className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed mb-6 max-w-3xl">
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
                <ArticleShareButton slug={slug} title={t(article.titleKey)} />
              </div>
            </motion.div>
          </div>
        </header>

        <section className="py-12 sm:py-16 bg-bg-primary border-b border-border-main">
          <div className="container-custom">
            <div
              className={`grid grid-cols-1 gap-12 lg:gap-16 lg:items-start ${
                readingMode ? "lg:grid-cols-1" : "lg:grid-cols-12"
              }`}
            >
              <article
                id="article-body"
                className={`${readingMode ? "max-w-[42rem] mx-auto w-full" : "lg:col-span-8 max-w-[42rem] lg:max-w-none"} ${FONT_CLASS[fontScale]}`}
              >
                {markdownBody ? (
                  <>
                    <ArticleToolbar
                      fontScale={fontScale}
                      onFontScale={setFontScale}
                      readingMode={readingMode}
                      onReadingMode={setReadingMode}
                      onOpenToc={toc.length >= 2 ? () => setMobileTocOpen((v) => !v) : undefined}
                      labels={{
                        smaller: t("article.font_smaller"),
                        larger: t("article.font_larger"),
                        readingMode: readingMode
                          ? t("article.exit_focus")
                          : t("article.reading_mode"),
                        toc: t("article.toc"),
                      }}
                    />

                    {mobileTocOpen && toc.length >= 2 ? (
                      <div className="mb-8 lg:hidden">
                        <ArticleToc items={toc} title={t("article.toc")} />
                      </div>
                    ) : null}

                    <ArticleMarkdown content={markdownBody} />
                  </>
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

                {nextArticle && !labContext ? (
                  <ArticleContinue
                    next={nextArticle}
                    titleLabel={t("article.continue_reading")}
                    ctaLabel={t("article.read_next")}
                    resolveTitle={(a) => t(a.titleKey)}
                    resolveCategory={(a) => t(a.categoryLabelKey)}
                  />
                ) : null}

                {labContext ? (
                  <LabArticleNav
                    pathSlug={labContext.pathSlug}
                    stepId={labContext.stepId}
                    variant="inline"
                  />
                ) : (
                  <Link
                    href="/articles"
                    className="inline-flex items-center mt-8 text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline group print:hidden"
                  >
                    <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    {t("article.back")}
                  </Link>
                )}
              </article>

              {!readingMode && (
                <StickySidebar className="lg:col-span-4 space-y-8 print:hidden">
                  {relatedArticles.length > 0 && (
                    <div className="p-6 sm:p-8 rounded-2xl border border-turquoise/25 bg-bg-secondary">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise mb-6 border-b border-border-main pb-4">
                        {t("article.related")}
                      </h3>
                      <ul className="space-y-4">
                        {relatedArticles.map((related) => (
                          <li key={related.slug}>
                            <Link href={`/articles/${related.slug}`} className="block group">
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wider ${related.color}`}
                              >
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

                  {toc.length >= 2 ? <ArticleToc items={toc} title={t("article.toc")} /> : null}

                  <div
                    className={`p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary ${category.color}`}
                  >
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

                  <div className="p-6 sm:p-8 rounded-2xl bg-text-primary text-bg-primary relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-3">{t("catpage.need_expertise")}</h3>
                      <p className="text-sm text-bg-primary/50 mb-6 leading-relaxed">
                        {t("catpage.expertise_desc")}
                      </p>
                      <Link href="/about#contact">
                        <button className="w-full py-3 bg-turquoise text-navy text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
                          {t("catpage.contact_noc")}
                        </button>
                      </Link>
                    </div>
                    <category.icon className="absolute -right-6 -bottom-6 h-32 w-32 text-bg-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                </StickySidebar>
              )}
            </div>
          </div>
        </section>
      </div>
      {labContext && (
        <>
          <div className="h-20 md:hidden print:hidden" aria-hidden />
          <LabArticleNav
            pathSlug={labContext.pathSlug}
            stepId={labContext.stepId}
            variant="sticky"
          />
        </>
      )}
      <BackToTop label={t("article.back_to_top")} />
      <Footer />
    </main>
  );
}

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import { FileText, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryVisual from "@/components/category-visuals/CategoryVisual";
import CategoryFeaturedArticle from "@/components/CategoryFeaturedArticle";
import ArticleCategoryCard from "@/components/ArticleCategoryCard";
import { motion } from "framer-motion";
import StickySidebar from "@/components/StickySidebar";

export default function CategoryPage() {
  const params = useParams();
  const { t } = useLanguage();
  const slug = params.slug as string;
  const category = getCategoryBySlug(slug);
  const articles = getArticlesByCategory(category.slug);
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const [featuredArticle, ...otherArticles] = sortedArticles;
  const CategoryIcon = category.icon;

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        <PageHeader
          compact
          breadcrumbs={[
            { label: t("catpage.breadcrumb"), href: "/" },
            { label: t(category.nameKey) },
          ]}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative max-w-6xl mx-auto bg-bg-secondary border border-border-main rounded-2xl overflow-hidden shadow-2xl ${category.border}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:h-[260px]">
              <div className="lg:col-span-5 h-44 sm:h-48 lg:h-full border-b lg:border-b-0 lg:border-r border-border-main/50 relative overflow-hidden">
                  <CategoryVisual slug={category.slug} />
                  <div className={`absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0a1628]/80 border border-border-main/50 ${category.color}`}>
                    <CategoryIcon size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{t(category.nameKey)}</span>
                  </div>
                </div>

                <div className="lg:col-span-7 p-5 sm:p-6 md:p-7 flex flex-col justify-center overflow-hidden">
                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="text-2xl sm:text-3xl md:text-[2rem] font-black text-text-primary tracking-tighter code-font leading-tight line-clamp-2"
                  >
                    {t(category.nameKey)}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-3 text-text-secondary text-sm font-medium max-w-xl leading-relaxed opacity-80 line-clamp-2"
                  >
                    {t(category.descKey)}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2.5 mt-4"
                  >
                    <div className="flex items-center px-3 py-1.5 rounded-xl bg-bg-primary/60 border border-border-main">
                      <FileText size={12} className={`mr-2 ${category.color}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-primary">
                        {articles.length} {t("cat.articles")}
                      </span>
                    </div>
                    <div className="flex items-center px-3 py-1.5 rounded-xl bg-bg-primary/60 border border-border-main">
                      <RefreshCw size={12} className={`mr-2 ${category.color}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-primary">
                        {t("catpage.verified")}
                      </span>
                    </div>
                    <div className="flex items-center px-3 py-1.5 rounded-xl bg-bg-primary/60 border border-border-main">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${category.color}`}>
                        {t(category.certKey)}
                      </span>
                    </div>
                  </motion.div>

                  <div className="flex flex-wrap gap-2 mt-3.5">
                    {category.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2.5 py-0.5 rounded-md bg-bg-primary border border-border-main text-[9px] font-bold uppercase tracking-wider ${category.color}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
          </motion.div>
        </PageHeader>

        {/* Category overview — what this domain covers */}
        <section className="py-8 sm:py-10 border-b border-border-main bg-bg-primary">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-6 flex items-center">
                <CategoryIcon size={24} className={`mr-3 ${category.color}`} />
                {t("catpage.overview_title")}
              </h2>
              <div className="space-y-4 mb-8">
                {t(category.overviewKey).split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-text-secondary text-base leading-relaxed font-medium">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/50 mb-4">
                  {t("catpage.topics_title")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-main text-[10px] font-bold uppercase tracking-wider ${category.color}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-8 sm:py-12 bg-bg-primary border-b border-border-main">
          <div className="container-custom">
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-10 flex items-center">
              <FileText size={22} className={`mr-3 ${category.color}`} />
              {t("catpage.articles_section")}
              <span className="ml-3 text-sm font-mono text-text-secondary/50">({articles.length})</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 lg:items-start">
              <div className="lg:col-span-2 space-y-6">
                {articles.length > 0 ? (
                  <>
                    {featuredArticle && (
                      <CategoryFeaturedArticle article={featuredArticle} category={category} />
                    )}
                    {otherArticles.length > 0 && (
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/40 mb-4">
                        {t("catpage.more_articles")}
                      </p>
                    )}
                    {otherArticles.map((article, i) => (
                      <ArticleCategoryCard
                        key={article.slug}
                        article={article}
                        category={category}
                        index={i}
                      />
                    ))}
                  </>
                ) : (
                  <div className="p-8 rounded-2xl border border-border-main bg-bg-secondary text-center">
                    <p className="text-text-secondary font-medium">{t("cat.subtitle")}</p>
                  </div>
                )}
              </div>

              <StickySidebar className="space-y-8">
                <div className="p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/50 mb-6 border-b border-border-main pb-4">
                    {t("catpage.index_nodes")}
                  </h3>
                  <ul className="space-y-4">
                    {CATEGORIES.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/category/${cat.slug}`}
                          className={`flex justify-between items-center group ${cat.slug === category.slug ? "text-turquoise" : ""}`}
                        >
                          <span className="text-sm font-bold text-text-primary group-hover:text-turquoise transition-colors flex items-center">
                            <cat.icon size={14} className="mr-2 opacity-60" />
                            {t(cat.nameKey)}
                          </span>
                          <span className="text-[10px] font-black bg-bg-primary px-2 py-1 rounded border border-border-main text-text-secondary/50 group-hover:border-turquoise group-hover:text-turquoise transition-all">
                            {cat.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 sm:p-8 rounded-2xl bg-text-primary text-bg-primary relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4">{t("catpage.need_expertise")}</h3>
                    <p className="text-sm text-bg-primary/50 mb-8 leading-relaxed">
                      {t("catpage.expertise_desc")}
                    </p>
                    <Link href="/about">
                      <button className="w-full py-4 bg-turquoise text-navy text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
                        {t("catpage.contact_noc")}
                      </button>
                    </Link>
                  </div>
                  <CategoryIcon className="absolute -right-8 -bottom-8 h-40 w-40 text-bg-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </StickySidebar>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
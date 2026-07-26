import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarkdownBodies, getMarkdownMetas } from "@/lib/markdown";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";
import {
  absoluteUrl,
  articleLocalePaths,
  articleMetadata,
  getRequestLanguage,
  tLang,
} from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import type { TranslationKeys } from "@/lib/translations";
import JsonLd from "@/components/JsonLd";
import ArticlePageClient from "./ArticlePageClient";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  const lang = await getRequestLanguage();

  return articleMetadata(
    article.slug,
    article.titleKey as keyof TranslationKeys,
    article.excerptKey as keyof TranslationKeys,
    {
      date: article.date,
      category: tLang(lang, article.categoryLabelKey as keyof TranslationKeys),
      lang,
    }
  );
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ fromLab?: string; step?: string }>;
}) {
  const { slug } = await params;
  const { fromLab, step } = await searchParams;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const lang = await getRequestLanguage();
  const markdownBodies = getMarkdownBodies(slug);
  const markdownMeta = getMarkdownMetas(slug);
  const labContext = fromLab && step ? { pathSlug: fromLab, stepId: step } : null;

  const categoryName = tLang(lang, article.categoryLabelKey as keyof TranslationKeys);
  const title = tLang(lang, article.titleKey as keyof TranslationKeys);
  const faq = (lang === "FR" ? markdownMeta?.FR?.faq : markdownMeta?.EN?.faq) ?? markdownMeta?.EN?.faq;
  const paths = articleLocalePaths(article.slug);
  const articlePath = lang === "FR" ? paths.fr : paths.en;
  const homeLabel = lang === "FR" ? "Accueil" : "Home";
  const articlesLabel = lang === "FR" ? "Articles" : "Articles";

  return (
    <>
      <JsonLd data={articleJsonLd(article, lang)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: homeLabel, path: lang === "FR" ? "/fr" : "/en" },
          { name: articlesLabel, path: lang === "FR" ? "/fr/articles" : "/en/articles" },
          {
            name: categoryName,
            path: lang === "FR" ? `/fr/category/${article.category}` : `/en/category/${article.category}`,
          },
          { name: title, path: articlePath },
        ])}
      />
      {faq && faq.length > 0 ? (
        <JsonLd
          data={
            faqPageJsonLd(faq, {
              name: title,
              description: tLang(lang, article.excerptKey as keyof TranslationKeys),
              url: absoluteUrl(articlePath),
              lang,
            })!
          }
        />
      ) : null}
      <ArticlePageClient
        markdownBodies={markdownBodies}
        markdownMeta={markdownMeta}
        labContext={labContext}
      />
    </>
  );
}

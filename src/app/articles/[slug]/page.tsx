import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarkdownBodies, getMarkdownMetas } from "@/lib/markdown";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";
import { absoluteUrl, articleLocalePaths, articleMetadata, tEn } from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import type { TranslationKeys } from "@/lib/translations";
import JsonLd from "@/components/JsonLd";
import ArticlePageClient from "./ArticlePageClient";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };

  return articleMetadata(
    article.slug,
    article.titleKey as keyof TranslationKeys,
    article.excerptKey as keyof TranslationKeys,
    {
      date: article.date,
      category: tEn(article.categoryLabelKey as keyof TranslationKeys),
      lang: "EN",
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

  const markdownBodies = getMarkdownBodies(slug);
  const markdownMeta = getMarkdownMetas(slug);
  const labContext =
    fromLab && step ? { pathSlug: fromLab, stepId: step } : null;

  const categoryName = tEn(article.categoryLabelKey as keyof TranslationKeys);
  const title = tEn(article.titleKey as keyof TranslationKeys);
  const faq = markdownMeta?.EN?.faq;
  const articlePath = articleLocalePaths(article.slug).en;

  return (
    <>
      <JsonLd data={articleJsonLd(article, "EN")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: categoryName, path: `/category/${article.category}` },
          { name: title, path: articlePath },
        ])}
      />
      {faq && faq.length > 0 ? (
        <JsonLd
          data={
            faqPageJsonLd(faq, {
              name: title,
              description: tEn(article.excerptKey as keyof TranslationKeys),
              url: absoluteUrl(articlePath),
              lang: "EN",
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
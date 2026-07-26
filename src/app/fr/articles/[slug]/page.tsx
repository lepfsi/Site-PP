import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarkdownBodies, getMarkdownMetas } from "@/lib/markdown";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";
import { articleMetadata, tLang } from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import type { TranslationKeys } from "@/lib/translations";
import JsonLd from "@/components/JsonLd";
import ArticlePageClient from "@/app/articles/[slug]/ArticlePageClient";

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
  if (!article) return { title: "Introuvable" };

  return articleMetadata(
    article.slug,
    article.titleKey as keyof TranslationKeys,
    article.excerptKey as keyof TranslationKeys,
    {
      date: article.date,
      category: tLang("FR", article.categoryLabelKey as keyof TranslationKeys),
      lang: "FR",
    }
  );
}

/** French article URL for SEO: /fr/articles/[slug] with hreflang ↔ EN. */
export default async function FrenchArticlePage({
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
  const labContext = fromLab && step ? { pathSlug: fromLab, stepId: step } : null;

  const categoryName = tLang("FR", article.categoryLabelKey as keyof TranslationKeys);
  const title = tLang("FR", article.titleKey as keyof TranslationKeys);

  return (
    <>
      <JsonLd data={articleJsonLd(article, "FR")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: categoryName, path: `/category/${article.category}` },
          { name: title, path: `/fr/articles/${article.slug}` },
        ])}
      />
      <ArticlePageClient
        markdownBodies={markdownBodies}
        markdownMeta={markdownMeta}
        labContext={labContext}
      />
    </>
  );
}

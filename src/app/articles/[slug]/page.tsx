import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarkdownBodies } from "@/lib/markdown";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";
import { articleMetadata } from "@/lib/seo";
import type { TranslationKeys } from "@/lib/translations";
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
    article.excerptKey as keyof TranslationKeys
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
  const labContext =
    fromLab && step ? { pathSlug: fromLab, stepId: step } : null;

  return <ArticlePageClient markdownBodies={markdownBodies} labContext={labContext} />;
}
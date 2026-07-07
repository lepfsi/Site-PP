import { getMarkdownBodies } from "@/lib/markdown";
import ArticlePageClient from "./ArticlePageClient";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const markdownBodies = getMarkdownBodies(slug);

  return <ArticlePageClient markdownBodies={markdownBodies} />;
}
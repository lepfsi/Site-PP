import type { Metadata } from "next";
import { absoluteUrl, pageMetadata, tLang } from "@/lib/seo";
import ArticlesPage from "@/app/articles/page";

export const metadata: Metadata = pageMetadata(
  tLang("FR", "articles.all_title"),
  tLang("FR", "articles.all_subtitle"),
  "/fr/articles",
  {
    languages: {
      en: absoluteUrl("/articles"),
      fr: absoluteUrl("/fr/articles"),
      "x-default": absoluteUrl("/articles"),
    },
  }
);

/** French articles index — same UI, FR forced by /fr layout. */
export default function FrenchArticlesIndexPage() {
  return <ArticlesPage />;
}

import type { Metadata } from "next";
import { absoluteUrl, pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("articles.all_title"),
  tEn("articles.all_subtitle"),
  "/articles",
  {
    languages: {
      en: absoluteUrl("/articles"),
      fr: absoluteUrl("/fr/articles"),
      "x-default": absoluteUrl("/articles"),
    },
  }
);

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

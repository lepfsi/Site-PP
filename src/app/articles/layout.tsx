import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "articles.all_title"),
    tLang(lang, "articles.all_subtitle"),
    "/articles",
    { lang }
  );
}

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

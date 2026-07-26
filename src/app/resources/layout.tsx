import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "res.page.title"),
    tLang(lang, "res.page.subtitle"),
    "/resources",
    { lang }
  );
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

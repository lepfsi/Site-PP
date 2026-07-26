import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "about.title"),
    tLang(lang, "about.subtitle"),
    "/about",
    { lang }
  );
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

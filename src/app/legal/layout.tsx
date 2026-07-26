import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "legal.title"),
    tLang(lang, "legal.intro"),
    "/legal",
    { lang }
  );
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}

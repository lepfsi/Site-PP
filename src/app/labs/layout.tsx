import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "labs.page.title"),
    tLang(lang, "labs.page.subtitle"),
    "/labs",
    { lang }
  );
}

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "exp.all_title"),
    tLang(lang, "exp.all_subtitle"),
    "/experience",
    { lang }
  );
}

export default function ExperienceIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}

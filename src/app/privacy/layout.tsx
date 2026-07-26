import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "privacy.title"),
    tLang(lang, "privacy.intro"),
    "/privacy",
    { lang }
  );
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "contact.title"),
    tLang(lang, "contact.subtitle"),
    "/contact",
    { lang }
  );
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

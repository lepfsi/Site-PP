import type { Metadata } from "next";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage();
  return pageMetadata(
    tLang(lang, "products.meta_title"),
    tLang(lang, "products.meta_desc"),
    "/products",
    { lang }
  );
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

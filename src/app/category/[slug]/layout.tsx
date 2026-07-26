import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/categories";
import { getRequestLanguage, pageMetadata, tLang } from "@/lib/seo";
import type { TranslationKeys } from "@/lib/translations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getRequestLanguage();
  const category = getCategoryBySlug(slug);
  const name = tLang(lang, category.nameKey as keyof TranslationKeys);
  const desc = tLang(lang, category.descKey as keyof TranslationKeys);
  const suffix = lang === "FR" ? "Guides" : "Guides";
  return pageMetadata(`${name} ${suffix}`, desc, `/category/${category.slug}`, { lang });
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

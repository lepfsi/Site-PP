import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/categories";
import { pageMetadata, tEn } from "@/lib/seo";
import type { TranslationKeys } from "@/lib/translations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const name = tEn(category.nameKey as keyof TranslationKeys);
  const desc = tEn(category.descKey as keyof TranslationKeys);
  return pageMetadata(`${name} Guides`, desc, `/category/${category.slug}`);
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

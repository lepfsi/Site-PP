import type { Metadata } from "next";
import { getExperienceBySlug } from "@/lib/experiences";
import { pageMetadata, tEn } from "@/lib/seo";
import type { TranslationKeys } from "@/lib/translations";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);
  if (!experience) return { title: "Not Found" };

  return pageMetadata(
    tEn(experience.titleKey as keyof TranslationKeys),
    tEn(experience.descKey as keyof TranslationKeys),
    `/experience/${experience.slug}`
  );
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
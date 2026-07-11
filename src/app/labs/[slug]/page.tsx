import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LAB_PATHS, getLabPathBySlug } from "@/lib/labs";
import { pageMetadata, tEn } from "@/lib/seo";
import type { TranslationKeys } from "@/lib/translations";
import LabPathClient from "./LabPathClient";

export function generateStaticParams() {
  return LAB_PATHS.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = getLabPathBySlug(slug);
  if (!path) return { title: "Not Found" };

  return pageMetadata(
    tEn(path.titleKey as keyof TranslationKeys),
    tEn(path.descKey as keyof TranslationKeys),
    `/labs/${slug}`
  );
}

export default async function LabPathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getLabPathBySlug(slug)) notFound();

  return <LabPathClient />;
}
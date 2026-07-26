import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LAB_PATHS, getLabPathBySlug } from "@/lib/labs";
import { labPathMetadata } from "@/lib/seo";
import { labCourseJsonLd, labFaqJsonLd } from "@/lib/jsonld";
import type { TranslationKeys } from "@/lib/translations";
import JsonLd from "@/components/JsonLd";
import LabPathClient from "@/app/labs/[slug]/LabPathClient";

export function generateStaticParams() {
  return LAB_PATHS.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = getLabPathBySlug(slug);
  if (!path) return { title: "Introuvable" };

  return labPathMetadata(
    slug,
    path.titleKey as keyof TranslationKeys,
    path.descKey as keyof TranslationKeys,
    "FR"
  );
}

/** French lab path URL: /fr/labs/[slug] with hreflang ↔ EN. */
export default async function FrenchLabPathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = getLabPathBySlug(slug);
  if (!path) notFound();

  const faq = labFaqJsonLd(path, "FR");

  return (
    <>
      <JsonLd data={labCourseJsonLd(path, "FR")} />
      {faq ? <JsonLd data={faq} /> : null}
      <LabPathClient />
    </>
  );
}

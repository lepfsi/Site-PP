import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LAB_PATHS, getLabPathBySlug } from "@/lib/labs";
import { getRequestLanguage, labPathMetadata } from "@/lib/seo";
import { labCourseJsonLd, labFaqJsonLd } from "@/lib/jsonld";
import type { TranslationKeys } from "@/lib/translations";
import JsonLd from "@/components/JsonLd";
import LabPathClient from "./LabPathClient";

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
  if (!path) return { title: "Not Found" };
  const lang = await getRequestLanguage();

  return labPathMetadata(
    slug,
    path.titleKey as keyof TranslationKeys,
    path.descKey as keyof TranslationKeys,
    lang
  );
}

export default async function LabPathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = getLabPathBySlug(slug);
  if (!path) notFound();
  const lang = await getRequestLanguage();

  const faq = labFaqJsonLd(path, lang);

  return (
    <>
      <JsonLd data={labCourseJsonLd(path, lang)} />
      {faq ? <JsonLd data={faq} /> : null}
      <LabPathClient />
    </>
  );
}

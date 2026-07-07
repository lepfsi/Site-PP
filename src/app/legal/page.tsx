"use client";

import LegalDocument from "@/components/LegalDocument";

const SECTIONS = [
  { titleKey: "legal.s1.title", bodyKey: "legal.s1.body" },
  { titleKey: "legal.s2.title", bodyKey: "legal.s2.body" },
  { titleKey: "legal.s3.title", bodyKey: "legal.s3.body" },
  { titleKey: "legal.s4.title", bodyKey: "legal.s4.body" },
] as const;

export default function LegalPage() {
  return (
    <LegalDocument
      titleKey="legal.title"
      updatedKey="legal.updated"
      introKey="legal.intro"
      sections={SECTIONS}
    />
  );
}
"use client";

import LegalDocument from "@/components/LegalDocument";

const SECTIONS = [
  { titleKey: "privacy.s1.title", bodyKey: "privacy.s1.body" },
  { titleKey: "privacy.s2.title", bodyKey: "privacy.s2.body" },
  { titleKey: "privacy.s3.title", bodyKey: "privacy.s3.body" },
  { titleKey: "privacy.s4.title", bodyKey: "privacy.s4.body", id: "cookies" },
  { titleKey: "privacy.s5.title", bodyKey: "privacy.s5.body" },
] as const;

export default function PrivacyPage() {
  return (
    <LegalDocument
      titleKey="privacy.title"
      updatedKey="privacy.updated"
      introKey="privacy.intro"
      sections={SECTIONS}
    />
  );
}
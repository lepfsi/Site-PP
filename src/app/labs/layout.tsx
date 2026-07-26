import type { Metadata } from "next";
import { absoluteUrl, pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("labs.page.title"),
  tEn("labs.page.subtitle"),
  "/labs",
  {
    languages: {
      en: absoluteUrl("/labs"),
      fr: absoluteUrl("/fr/labs"),
      "x-default": absoluteUrl("/labs"),
    },
  }
);

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

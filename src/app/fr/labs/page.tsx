import type { Metadata } from "next";
import { absoluteUrl, pageMetadata, tLang } from "@/lib/seo";
import LabsPage from "@/app/labs/page";

export const metadata: Metadata = pageMetadata(
  tLang("FR", "labs.page.title"),
  tLang("FR", "labs.page.subtitle"),
  "/fr/labs",
  {
    languages: {
      en: absoluteUrl("/labs"),
      fr: absoluteUrl("/fr/labs"),
      "x-default": absoluteUrl("/labs"),
    },
  }
);

/** French labs index — same UI, FR forced by /fr layout. */
export default function FrenchLabsIndexPage() {
  return <LabsPage />;
}

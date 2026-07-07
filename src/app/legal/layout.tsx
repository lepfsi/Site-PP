import type { Metadata } from "next";
import { pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("legal.title"),
  tEn("legal.intro"),
  "/legal"
);

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
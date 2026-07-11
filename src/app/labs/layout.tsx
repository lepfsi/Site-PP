import type { Metadata } from "next";
import { pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("labs.page.title"),
  tEn("labs.page.subtitle"),
  "/labs"
);

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
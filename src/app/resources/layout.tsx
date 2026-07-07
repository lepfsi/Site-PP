import type { Metadata } from "next";
import { pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("res.page.title"),
  tEn("res.page.subtitle"),
  "/resources"
);

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
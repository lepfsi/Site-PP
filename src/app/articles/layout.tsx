import type { Metadata } from "next";
import { pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("articles.all_title"),
  tEn("articles.all_subtitle"),
  "/articles"
);

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
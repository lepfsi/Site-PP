import type { Metadata } from "next";
import { pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("about.title"),
  tEn("about.subtitle"),
  "/about"
);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
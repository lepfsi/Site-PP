import type { Metadata } from "next";
import { pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("exp.all_title"),
  tEn("exp.all_subtitle"),
  "/experience",
);

export default function ExperienceIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
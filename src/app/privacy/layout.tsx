import type { Metadata } from "next";
import { pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("privacy.title"),
  tEn("privacy.intro"),
  "/privacy"
);

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
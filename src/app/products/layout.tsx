import type { Metadata } from "next";
import { tEn } from "@/lib/seo";

export const metadata: Metadata = {
  title: tEn("products.meta_title"),
  description: tEn("products.meta_desc"),
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
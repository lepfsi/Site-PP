import type { Metadata } from "next";
import { pageMetadata, tEn } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  tEn("products.meta_title"),
  tEn("products.meta_desc"),
  "/products"
);

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { LanguageProvider } from "@/lib/LanguageContext";

/**
 * French locale segment for SEO (/fr/articles/...).
 * Nested LanguageProvider forces FR for all UI + article body under this tree.
 */
export default function FrenchLocaleLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider defaultLang="FR" forceLang="FR">{children}</LanguageProvider>;
}

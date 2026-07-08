"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

interface LegalSection {
  titleKey: string;
  bodyKey: string;
  id?: string;
}

interface LegalDocumentProps {
  titleKey: string;
  updatedKey: string;
  introKey: string;
  sections: readonly LegalSection[];
}

export default function LegalDocument({ titleKey, updatedKey, introKey, sections }: LegalDocumentProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex-grow pt-28">
        <header className="py-12 sm:py-16 border-b border-border-main bg-bg-secondary/30">
          <div className="container-custom max-w-3xl">
            <nav className="flex items-center mb-6 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-turquoise transition-colors">{t("catpage.breadcrumb")}</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-text-primary">{t(titleKey)}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-black text-text-primary code-font mb-3">{t(titleKey)}</h1>
            <p className="text-[10px] font-mono text-text-secondary/50 uppercase tracking-widest">{t(updatedKey)}</p>
          </div>
        </header>

        <section className="py-12 sm:py-16 bg-bg-primary border-b border-border-main">
          <div className="container-custom max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-text-secondary text-base leading-relaxed font-medium mb-10"
            >
              {t(introKey)}
            </motion.p>

            <div className="space-y-10">
              {sections.map((section, i) => (
                <motion.div
                  key={section.titleKey}
                  id={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={section.id ? "scroll-mt-28" : undefined}
                >
                  <h2 className="text-lg font-bold text-text-primary mb-3">{t(section.titleKey)}</h2>
                  <div className="space-y-3">
                    {t(section.bodyKey).split("\n\n").map((paragraph, j) => (
                      <p key={j} className="text-text-secondary text-sm leading-relaxed font-medium">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border-main flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
              <Link href="/privacy" className="text-turquoise hover:underline">{t("footer.privacy")}</Link>
              <Link href="/legal" className="text-turquoise hover:underline">{t("footer.legal")}</Link>
              <Link href="/about" className="text-turquoise hover:underline">{t("footer.contact")}</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
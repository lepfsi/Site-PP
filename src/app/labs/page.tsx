"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import LabPathCard from "@/components/LabPathCard";
import LabSyncPanel from "@/components/LabSyncPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { getAllLabPaths } from "@/lib/labs";

export default function LabsPage() {
  const { t } = useLanguage();
  const paths = getAllLabPaths();

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        <PageHeader
          grid="tech"
          breadcrumbs={[
            { label: t("catpage.breadcrumb"), href: "/" },
            { label: t("labs.page.title") },
          ]}
          title={t("labs.page.title")}
          subtitle={t("labs.page.subtitle")}
          meta={
            <p className="text-[10px] font-black uppercase tracking-widest text-turquoise">
              {paths.length} {t("labs.page.count")}
            </p>
          }
        />

        <section className="py-10 sm:py-14 bg-bg-primary border-b border-border-main">
          <div className="container-custom">
            <Suspense fallback={null}>
              <LabSyncPanel />
            </Suspense>
            <p className="text-text-secondary text-sm font-medium mb-8 max-w-2xl">
              {t("labs.progress.hint")}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {paths.map((path, index) => (
                <motion.div
                  key={path.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <LabPathCard path={path} variant="grid" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
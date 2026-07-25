"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getAllLabPaths } from "@/lib/labs";
import LabPathCard from "@/components/LabPathCard";
import SectionHeading from "@/components/SectionHeading";

export default function LabsSection() {
  const { t } = useLanguage();
  const paths = getAllLabPaths();

  return (
    <section id="labs" className="py-16 md:py-24 bg-bg-primary section-band relative overflow-hidden">
      <div className="container-custom relative z-10">
        <SectionHeading
          className="mb-10 md:mb-12"
          subtitle={<p className="text-text-secondary text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">{t("labs.home.subtitle")}</p>}
        >
          {t("labs.home.title")}
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-8">
          {paths.map((path, index) => (
            <motion.div
              key={path.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <LabPathCard path={path} variant="home" />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/labs"
            className="inline-flex items-center text-[13px] font-semibold text-turquoise hover:underline"
          >
            {t("labs.home.view_all")}
            <ArrowRight size={14} className="ml-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
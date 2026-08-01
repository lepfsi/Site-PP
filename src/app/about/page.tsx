"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import ContactAuthorPanel from "@/components/ContactAuthorPanel";
import ContactForm from "@/components/ContactForm";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { Radio, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AboutPage() {
  const { t } = useLanguage();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        <PageHeader
          grid="tech"
          breadcrumbs={[
            { label: t("catpage.breadcrumb"), href: "/" },
            { label: t("about.title") },
          ]}
          title={t("about.title")}
          subtitle={t("about.subtitle")}
          showPrefix={false}
        />

        <section className="py-8 sm:py-10 bg-bg-primary border-b border-border-main">
          <div className="container-custom max-w-6xl mx-auto space-y-8 lg:space-y-10">
            <motion.div
              id="dailyops"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24 p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary border-l-4 border-l-turquoise"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-turquoise/10 border border-turquoise/30 flex items-center justify-center">
                  <Radio size={18} className="text-turquoise" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">{t("about.dailyops_title")}</h2>
              </div>
              <div className="space-y-4">
                {t("about.dailyops_desc").split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-text-secondary text-sm sm:text-base leading-relaxed font-medium">
                    {paragraph}
                  </p>
                ))}
              </div>
              <p className="mt-6 pt-5 border-t border-border-main/60 text-text-primary text-sm font-bold leading-relaxed">
                {t("about.mission")}
              </p>
            </motion.div>

            <motion.div
              id="opsgate"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-24 py-2"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Shield size={16} className="text-text-secondary" />
                <h2 className="text-lg font-semibold text-text-primary tracking-tight">
                  {t("about.opsgate_title")}
                </h2>
                <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-text-secondary dark:bg-white/[0.06]">
                  {t("about.opsgate_badge")}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
                {t("about.opsgate_desc").split("\n\n")[0]}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
                <Link
                  href="/products"
                  className="font-medium text-turquoise hover:underline underline-offset-4"
                >
                  {t("about.opsgate_cta_products")}
                </Link>
                <Link
                  href="/articles/genai-dlp-sensitive-data-leaks"
                  className="text-text-secondary hover:text-turquoise hover:underline underline-offset-4"
                >
                  {t("about.opsgate_cta_article")}
                </Link>
                <a
                  href="#contact"
                  className="text-text-secondary hover:text-turquoise hover:underline underline-offset-4"
                >
                  {t("about.opsgate_cta_beta")}
                </a>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                id="author"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="scroll-mt-24 p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary"
              >
                <h2 className="text-xl font-bold text-text-primary mb-6">{t("about.author_title")}</h2>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-turquoise/10 border border-turquoise/30 flex items-center justify-center font-black text-turquoise text-base shrink-0">
                    SB
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-text-primary tracking-tight">{t("about.author_name")}</h3>
                    <p className="text-turquoise text-[10px] font-bold uppercase tracking-widest mt-1.5">{t("about.author_role")}</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line">
                  {t("about.author_bio")}
                </p>
              </motion.div>

              <motion.div
                id="methodology"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary scroll-mt-24"
              >
                <h2 className="text-xl font-bold text-text-primary mb-4">{t("about.methodology_title")}</h2>
                <p className="text-text-secondary text-sm leading-relaxed font-medium">
                  {t("about.methodology_desc")}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="py-10 sm:py-14 bg-bg-secondary border-b border-border-main scroll-mt-24"
        >
          <div className="container-custom max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-stretch">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 order-2 lg:order-1"
              >
                <ContactAuthorPanel />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 order-1 lg:order-2"
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
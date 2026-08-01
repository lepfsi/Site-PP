"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import ContactAuthorPanel from "@/components/ContactAuthorPanel";
import ContactForm from "@/components/ContactForm";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        <PageHeader
          grid="tech"
          breadcrumbs={[
            { label: t("catpage.breadcrumb"), href: "/" },
            { label: t("contact.title") },
          ]}
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
          showPrefix={false}
        />

        <section className="py-10 sm:py-14 bg-bg-secondary border-b border-border-main">
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

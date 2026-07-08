"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import ContactAuthorPanel from "@/components/ContactAuthorPanel";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, FileText, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website: formData.get("website"),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSent(false), 5000);
    } catch {
      setError(t("about.form_error"));
    } finally {
      setLoading(false);
    }
  };

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
          <div className="container-custom max-w-6xl mx-auto">
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
                <p className="text-text-secondary/70 text-sm leading-relaxed font-medium border-t border-border-main/60 pt-5 mt-5">
                  {t("about.mission")}
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
                className="lg:col-span-3 order-1 lg:order-2 p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-primary shadow-xl flex flex-col"
              >
              <div className="flex items-center space-x-3 mb-2">
                <Mail className="text-turquoise" size={20} />
                <h2 className="text-xl font-bold text-text-primary">{t("about.contact_title")}</h2>
              </div>
              <p className="text-text-secondary text-sm mb-8 font-medium">{t("about.contact_desc")}</p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle className="text-green-500 mb-4" size={40} />
                  <p className="text-text-primary font-bold">{t("about.form_sent")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />
                  {error && (
                    <p className="text-red-500 text-xs font-medium text-center">{error}</p>
                  )}
                  <div>
                    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
                      <User size={12} className="mr-1.5" /> {t("about.form_name")}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
                      <Mail size={12} className="mr-1.5" /> {t("about.form_email")}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
                      <FileText size={12} className="mr-1.5" /> {t("about.form_subject")}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
                      <MessageSquare size={12} className="mr-1.5" /> {t("about.form_message")}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="w-full min-h-[160px] bg-bg-secondary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all resize-y"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-2 bg-turquoise text-navy font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send size={14} className="mr-2" />
                    {loading ? t("about.form_sending") : t("about.form_send")}
                  </button>
                </form>
              )}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
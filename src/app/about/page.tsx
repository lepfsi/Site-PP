"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
      <div className="flex-grow pt-28">
        <header className="relative py-16 sm:py-20 border-b border-border-main bg-bg-secondary/30 overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none"></div>
          <div className="container-custom relative z-10">
            <nav className="flex items-center mb-8 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-turquoise transition-colors">{t("catpage.breadcrumb")}</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-text-primary">{t("about.title")}</span>
            </nav>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight code-font mb-4"
            >
              {t("about.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary text-lg sm:text-xl font-medium max-w-2xl"
            >
              {t("about.subtitle")}
            </motion.p>
          </div>
        </header>

        <section className="py-16 sm:py-20 bg-bg-primary border-b border-border-main">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
              <div className="space-y-10">
                <motion.div
                  id="author"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="scroll-mt-32 p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary"
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
                  className="p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary scroll-mt-32"
                >
                  <h2 className="text-xl font-bold text-text-primary mb-4">{t("about.methodology_title")}</h2>
                  <p className="text-text-secondary text-sm leading-relaxed font-medium">
                    {t("about.methodology_desc")}
                  </p>
                </motion.div>
              </div>

              <motion.div
                id="contact"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-secondary shadow-xl scroll-mt-32"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="text-turquoise" size={20} />
                  <h2 className="text-xl font-bold text-text-primary">{t("about.contact_title")}</h2>
                </div>
                <p className="text-text-secondary text-sm mb-8 font-medium">{t("about.contact_desc")}</p>

                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="text-green-500 mb-4" size={40} />
                    <p className="text-text-primary font-bold">{t("about.form_sent")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
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
                        className="w-full bg-bg-primary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
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
                        className="w-full bg-bg-primary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
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
                        className="w-full bg-bg-primary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
                        <MessageSquare size={12} className="mr-1.5" /> {t("about.form_message")}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full bg-bg-primary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-turquoise text-navy font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
"use client";

import { Mail, Send, Lock, Users, Newspaper, Bell, Gift } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

export default function NewsletterSection() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lang,
          website: formData.get("website"),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } catch {
      setError(t("news.error"));
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Newspaper, key: "news.feature1" as const },
    { icon: Bell, key: "news.feature2" as const },
    { icon: Gift, key: "news.feature3" as const },
  ];

  return (
    <section id="newsletter" className="py-16 md:py-20 bg-bg-primary overflow-hidden border-t border-border-main">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-bg-secondary border-2 border-turquoise/30 rounded-[2rem] p-7 md:p-9 shadow-xl shadow-turquoise/10 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-turquoise/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-turquoise/15 border border-turquoise/30 text-turquoise mb-4">
                <Mail className="h-5 w-5" />
              </div>

              <SectionHeading className="mb-2">
                {t("news.title")}
              </SectionHeading>

              <p className="text-text-secondary text-sm mb-5 max-w-lg mx-auto font-medium">
                {t("news.desc")}
              </p>

              <div className="flex items-center justify-center space-x-2 text-turquoise font-bold text-xs mb-6">
                <Users size={14} />
                <span className="uppercase tracking-widest text-[9px]">{t("news.subscribers")}</span>
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mb-3">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                {error && (
                  <p className="text-red-500 text-xs font-medium mb-3">{error}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("news.input")}
                    disabled={loading || subscribed}
                    className="flex-grow bg-bg-primary border border-border-main rounded-xl px-5 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:ring-2 focus:ring-turquoise/40 outline-none transition-all disabled:opacity-60"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading || subscribed}
                    className={`px-7 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center transition-all disabled:cursor-not-allowed shrink-0 ${
                      subscribed
                        ? "bg-green-500 text-white"
                        : "bg-turquoise text-navy hover:bg-turquoise-dark hover:scale-[1.03] active:scale-95 shadow-lg shadow-turquoise/25 disabled:opacity-60"
                    }`}
                  >
                    <Send size={14} className="mr-2" />
                    {subscribed
                      ? t("news.subscribed")
                      : loading
                        ? t("news.sending")
                        : t("news.btn")}
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-center space-x-2 text-[8px] text-text-secondary/60 font-bold uppercase tracking-widest mb-8">
                <Lock size={10} />
                <span>{t("news.privacy")}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full pt-6 border-t border-border-main/60">
                {features.map(({ icon: Icon, key }) => (
                  <div key={key} className="flex flex-col items-center">
                    <Icon className="text-turquoise mb-1.5 h-4 w-4" />
                    <h4 className="font-bold text-text-primary text-[10px] uppercase tracking-wider leading-tight">
                      {t(key)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
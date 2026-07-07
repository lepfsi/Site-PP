"use client";

import { Mail, Send, Lock, Users, Newspaper, Bell, Gift } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

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
    <section id="newsletter" className="py-12 bg-bg-secondary overflow-hidden">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-bg-primary border border-border-main rounded-[2.5rem] p-8 md:p-10 shadow-xl text-center overflow-hidden"
          >
            <div className="relative z-10">
              <Mail className="text-text-secondary mx-auto mb-4 h-6 w-6" />

              <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-2 tracking-tight">
                {t("news.title")}
              </h2>

              <p className="text-text-secondary text-sm mb-6 max-w-lg mx-auto">
                {t("news.desc")}
              </p>

              <div className="flex items-center justify-center space-x-2 text-turquoise font-bold text-xs mb-8">
                <Users size={14} />
                <span className="uppercase tracking-widest text-[9px]">{t("news.subscribers")}</span>
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mb-4">
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
                    className="flex-grow bg-bg-secondary border border-border-main rounded-xl px-5 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:ring-1 focus:ring-turquoise outline-none transition-all disabled:opacity-60"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading || subscribed}
                    className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center transition-all disabled:cursor-not-allowed ${
                      subscribed
                        ? "bg-green-500 text-white"
                        : "bg-turquoise text-navy hover:scale-105 active:scale-95 disabled:opacity-60"
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

              <div className="flex items-center justify-center space-x-2 text-[8px] text-text-secondary/60 font-bold uppercase tracking-widest mb-10">
                <Lock size={10} />
                <span>{t("news.privacy")}</span>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full pt-8 border-t border-border-main">
                {features.map(({ icon: Icon, key }) => (
                  <div key={key} className="flex flex-col items-center">
                    <Icon className="text-turquoise/70 mb-2 h-4 w-4" />
                    <h4 className="font-bold text-text-primary text-[10px] uppercase tracking-wider">
                      {t(key)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 tech-grid opacity-[0.04] pointer-events-none"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
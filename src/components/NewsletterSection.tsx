"use client";

import { Send, Bell, Shield, Zap, Lock, MailCheck } from "lucide-react";
import { useState } from "react";
import { useLanguage, type TranslationKeys } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section id="newsletter" className="py-24 bg-bg-primary overflow-hidden">
      <div className="container-custom">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-turquoise/50 via-deepblue/50 to-turquoise/50 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-text-primary rounded-[2.5rem] px-8 py-12 md:px-16 md:py-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-turquoise/20 border border-turquoise/30 rounded-full mb-6">
                <MailCheck size={14} className="text-turquoise" />
                <span className="text-turquoise font-black uppercase tracking-[0.2em] text-[10px]">{t("nav.newsletter")}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-bg-primary mb-4 tracking-tighter leading-none">
                {t("news.title")}
              </h2>
              <p className="text-bg-primary/50 text-base md:text-lg font-medium max-w-md mx-auto lg:mx-0">
                {t("news.desc")}
              </p>
            </div>
            
            <div className="flex-1 w-full max-w-xl">
              <div className="bg-bg-primary/5 p-2 rounded-3xl border border-white/5 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("news.input")}
                    className="flex-grow bg-white/10 border-none rounded-2xl px-6 py-5 text-bg-primary placeholder-white/20 focus:ring-2 focus:ring-turquoise transition-all font-medium"
                    required
                  />
                  <button 
                    disabled={subscribed}
                    className={`px-8 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center transition-all ${
                      subscribed ? "bg-green-500 text-bg-primary" : "bg-turquoise text-navy hover:scale-105 active:scale-95"
                    }`}
                  >
                    {subscribed ? t("news.subscribed") : t("news.btn")} <Send size={18} className="ml-2" />
                  </button>
                </form>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8">
                {([
                  { icon: Bell, key: "news.feature1" },
                  { icon: Shield, key: "news.feature2" },
                  { icon: Zap, key: "news.feature3" },
                ] as { icon: typeof Bell; key: keyof TranslationKeys }[]).map((item) => (
                  <div key={item.key} className="flex items-center space-x-2 text-turquoise/50">
                    <item.icon size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t(item.key)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


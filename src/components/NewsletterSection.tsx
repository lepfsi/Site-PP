"use client";

import { Mail, Send, Bell, Shield, Zap, Lock, Users, Newspaper, Gift } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
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
    <section id="newsletter" className="py-24 bg-[#0a1120] overflow-hidden">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-bg-secondary/5 border-2 border-turquoise rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-turquoise/5 text-center overflow-hidden"
          >
            <div className="relative z-10">
              <div className="inline-block p-4 bg-gradient-to-br from-turquoise to-turquoise-dark rounded-full mb-8 shadow-lg">
                <Mail className="h-8 w-8 text-navy" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                Newsletter Hebdomadaire
              </h2>
              <p className="text-text-secondary text-lg mb-4 max-w-2xl mx-auto">
                Recevez chaque semaine les meilleurs articles, news tech, et astuces infrastructure
              </p>
              <p className="text-turquoise font-black uppercase tracking-widest text-xs flex items-center justify-center mb-10">
                <Users className="mr-2 h-4 w-4" /> +5,000 professionnels IT déjà abonnés
              </p>
              
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@entreprise.com"
                    className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:ring-2 focus:ring-turquoise focus:border-transparent transition-all outline-none"
                    required
                  />
                  <button 
                    disabled={subscribed}
                    className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-xl ${
                      subscribed ? "bg-green-500 text-white" : "bg-turquoise text-navy hover:scale-105 active:scale-95"
                    }`}
                  >
                    {subscribed ? "OK" : "S'abonner"} <Send size={18} className="ml-2" />
                  </button>
                </div>
                <p className="text-[10px] text-text-secondary/40 mt-6 font-bold uppercase tracking-widest flex items-center justify-center">
                  <Lock className="mr-2 h-3 w-3" /> Vos données sont sécurisées. Désabonnement en 1 clic.
                </p>
              </form>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/5">
                <div className="text-center">
                  <Newspaper className="h-6 w-6 text-turquoise mx-auto mb-3 opacity-60" />
                  <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Articles Premium</h4>
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Contenu exclusif chaque semaine</p>
                </div>
                <div className="text-center">
                  <Bell className="h-6 w-6 text-turquoise mx-auto mb-3 opacity-60" />
                  <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Alertes Tech</h4>
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">CVE, updates, breaking news</p>
                </div>
                <div className="text-center">
                  <Gift className="h-6 w-6 text-turquoise mx-auto mb-3 opacity-60" />
                  <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Ressources</h4>
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Cheatsheets, templates, tools</p>
                </div>
              </div>
            </div>

            {/* Decorative background pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none tech-grid"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

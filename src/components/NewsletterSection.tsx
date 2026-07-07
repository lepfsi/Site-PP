"use client";

import { Mail, Send, Lock, Users, Newspaper, Bell, Gift } from "lucide-react";
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
    <section id="newsletter" className="py-12 bg-[#0a1120] overflow-hidden">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-bg-secondary/5 border border-turquoise/40 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-turquoise/5 text-center overflow-hidden"
          >
            <div className="relative z-10">
              <div className="inline-block p-3 bg-gradient-to-br from-turquoise to-turquoise-dark rounded-full mb-6 shadow-lg">
                <Mail className="h-6 w-6 text-navy" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
                Newsletter Hebdomadaire
              </h2>
              <p className="text-text-secondary text-sm mb-6 max-w-lg mx-auto font-medium">
                Recevez chaque semaine les meilleurs articles, news tech, et astuces infrastructure
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto mb-6">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@ops.tech"
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-turquoise outline-none transition-all"
                  required
                />
                <button 
                  disabled={subscribed}
                  className={`px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center transition-all ${
                    subscribed ? "bg-green-500 text-white" : "bg-turquoise text-navy hover:scale-105 active:scale-95"
                  }`}
                >
                  {subscribed ? "OK" : "S'abonner"} <Send size={14} className="ml-2" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-6 text-[9px] font-bold text-text-secondary/40 uppercase tracking-widest">
                <span className="flex items-center"><Users size={12} className="mr-1.5 text-turquoise/40" /> +5,000 abonnés</span>
                <span className="flex items-center"><Lock size={12} className="mr-1.5 text-turquoise/40" /> Désabonnement en 1 clic</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/5">
                <div className="text-center">
                  <Newspaper className="h-4 w-4 text-turquoise mx-auto mb-2 opacity-50" />
                  <h4 className="text-[9px] font-black text-white uppercase tracking-wider">Premium</h4>
                </div>
                <div className="text-center">
                  <Bell className="h-4 w-4 text-turquoise mx-auto mb-2 opacity-50" />
                  <h4 className="text-[9px] font-black text-white uppercase tracking-wider">Alertes</h4>
                </div>
                <div className="text-center">
                  <Gift className="h-4 w-4 text-turquoise mx-auto mb-2 opacity-50" />
                  <h4 className="text-[9px] font-black text-white uppercase tracking-wider">Outils</h4>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


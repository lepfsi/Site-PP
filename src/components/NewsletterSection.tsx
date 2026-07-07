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
    <section id="newsletter" className="py-12 bg-bg-primary overflow-hidden">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#111c44]/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-turquoise/5 text-center overflow-hidden"
          >
            <div className="relative z-10">
              <Mail className="text-white/60 mx-auto mb-4 h-6 w-6" />
              
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                Newsletter Hebdomadaire
              </h2>
              
              <p className="text-text-secondary text-sm mb-6 max-w-lg mx-auto">
                Recevez chaque semaine les meilleurs articles, news tech, et astuces infrastructure
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-turquoise font-bold text-xs mb-8">
                <Users size={14} />
                <span className="uppercase tracking-widest text-[9px]">+5,000 professionnels IT déjà abonnés</span>
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mb-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@entreprise.com"
                    className="flex-grow bg-[#0a1128] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-white/20 focus:ring-1 focus:ring-turquoise outline-none transition-all"
                    required
                  />
                  <button 
                    disabled={subscribed}
                    className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center transition-all ${
                      subscribed ? "bg-green-500 text-white" : "bg-turquoise text-navy hover:scale-105 active:scale-95"
                    }`}
                  >
                    <Send size={14} className="mr-2" />
                    {subscribed ? "OK" : "S'abonner"}
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-center space-x-2 text-[8px] text-text-secondary/40 font-bold uppercase tracking-widest mb-10">
                <Lock size={10} />
                <span>Vos données sont sécurisées. Désabonnement en 1 clic.</span>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full pt-8 border-t border-white/5">
                <div className="flex flex-col items-center">
                  <Newspaper className="text-turquoise/60 mb-2 h-4 w-4" />
                  <h4 className="font-bold text-white text-[10px] uppercase tracking-wider">Premium</h4>
                </div>
                
                <div className="flex flex-col items-center">
                  <Bell className="text-turquoise/60 mb-2 h-4 w-4" />
                  <h4 className="font-bold text-white text-[10px] uppercase tracking-wider">Alertes</h4>
                </div>
                
                <div className="flex flex-col items-center">
                  <Gift className="text-turquoise/60 mb-2 h-4 w-4" />
                  <h4 className="font-bold text-white text-[10px] uppercase tracking-wider">Resources</h4>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 tech-grid opacity-[0.02] pointer-events-none"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

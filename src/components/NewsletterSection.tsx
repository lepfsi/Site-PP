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
    <section id="newsletter" className="py-20 bg-bg-primary">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-[#111c44]/50 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Main Content following the image precisely */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <Mail className="text-white mb-6 h-8 w-8 opacity-90" />
            
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Newsletter Hebdomadaire
            </h2>
            
            <p className="text-text-secondary text-base mb-2 max-w-2xl">
              Recevez chaque semaine les meilleurs articles, news tech, et astuces infrastructure
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-turquoise font-bold text-sm mb-10">
              <Users size={16} />
              <span>+5,000 professionnels IT déjà abonnés</span>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@entreprise.com"
                  className="flex-grow bg-[#0a1128] border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/20 focus:ring-2 focus:ring-turquoise outline-none transition-all"
                  required
                />
                <button 
                  disabled={subscribed}
                  className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center transition-all shadow-lg ${
                    subscribed ? "bg-green-500 text-white" : "bg-turquoise text-navy hover:bg-white"
                  }`}
                >
                  <Send size={16} className="mr-2" />
                  {subscribed ? "OK" : "S'abonner"}
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-text-secondary/50 font-bold uppercase tracking-widest mb-16">
              <Lock size={12} />
              <span>Vos données sont sécurisées. Désabonnement en 1 clic.</span>
            </div>

            {/* Feature Columns precisely like the image */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-12 border-t border-white/5">
              <div className="flex flex-col items-center">
                <Newspaper className="text-turquoise mb-4 h-6 w-6" />
                <h4 className="font-bold text-white text-sm mb-2">Articles Premium</h4>
                <p className="text-[11px] text-text-secondary font-medium leading-relaxed">Contenu exclusif chaque semaine</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Bell className="text-turquoise mb-4 h-6 w-6" />
                <h4 className="font-bold text-white text-sm mb-2">Alertes Tech</h4>
                <p className="text-[11px] text-text-secondary font-medium leading-relaxed">CVE, updates, breaking news</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Gift className="text-turquoise mb-4 h-6 w-6" />
                <h4 className="font-bold text-white text-sm mb-2">Resources</h4>
                <p className="text-[11px] text-text-secondary font-medium leading-relaxed">Cheatsheets, templates, tools</p>
              </div>
            </div>
          </div>

          {/* Background Grid Accent */}
          <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
}

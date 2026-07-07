"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Send, User, MessageSquare, ShieldCheck, Globe, Zap, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      alert("Message envoyé avec succès ! Nous vous recontacterons bientôt.");
    }, 2000);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left side: Information */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-8 tracking-tighter code-font">
                  À propos de <span className="text-turquoise">DailyOps.Tech</span>
                </h1>
                
                <p className="text-text-secondary text-lg mb-8 leading-relaxed font-medium">
                  DailyOps est né de la volonté de partager une expertise terrain concrète dans le domaine de l'infrastructure IT. 
                  Notre mission est de fournir des baselines de configuration, des playbooks et des analyses d'incidents (RCA) 
                  prêts pour la production.
                </p>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start space-x-4 p-4 bg-bg-secondary border border-border-main rounded-2xl">
                    <div className="p-2 bg-turquoise/10 text-turquoise rounded-lg">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary">Sécurité & Hardening</h4>
                      <p className="text-sm text-text-secondary">Des guides axés sur la défense en profondeur.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-bg-secondary border border-border-main rounded-2xl">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary">Infrastructures Réseaux</h4>
                      <p className="text-sm text-text-secondary">Design de protocoles de routage et segmentation.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-bg-secondary border border-border-main rounded-2xl">
                    <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary">Automatisation Ops</h4>
                      <p className="text-sm text-text-secondary">Accélérer la production par l'automatisation fiable.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side: Contact Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-bg-secondary border border-border-main rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Mail size={120} className="text-turquoise" />
                </div>
                
                <h2 className="text-3xl font-black text-text-primary mb-2 tracking-tight">Contactez-nous</h2>
                <p className="text-text-secondary mb-10 font-medium">Une question technique ou un besoin d'expertise ?</p>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Nom complet</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50" size={18} />
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-bg-primary/50 border border-border-main rounded-2xl px-12 py-4 text-text-primary focus:ring-2 focus:ring-turquoise focus:border-transparent outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Email professionnel</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50" size={18} />
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-bg-primary/50 border border-border-main rounded-2xl px-12 py-4 text-text-primary focus:ring-2 focus:ring-turquoise focus:border-transparent outline-none transition-all"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Sujet</label>
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-bg-primary/50 border border-border-main rounded-2xl px-6 py-4 text-text-primary focus:ring-2 focus:ring-turquoise focus:border-transparent outline-none transition-all"
                      placeholder="Consulting, feedback, suggestion d'article..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">Message</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-5 text-text-secondary/50" size={18} />
                      <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={5}
                        className="w-full bg-bg-primary/50 border border-border-main rounded-2xl px-12 py-4 text-text-primary focus:ring-2 focus:ring-turquoise focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Détaillez votre demande ici..."
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    disabled={submitted}
                    className="w-full bg-turquoise text-navy font-black py-5 rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-turquoise/10 flex items-center justify-center space-x-2"
                  >
                    {submitted ? (
                      <span className="flex items-center"><RefreshCw className="animate-spin mr-2" size={20} /> Envoi en cours...</span>
                    ) : (
                      <>
                        <span>Envoyer le message</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

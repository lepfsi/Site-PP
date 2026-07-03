"use client";

import { motion } from "framer-motion";
import { ChevronRight, Mail, Users, FileText, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";

export default function Hero() {
  const { t } = useLanguage();
  const [networkValue, setNetworkValue] = useState(847);
  const [securityValue, setSecurityValue] = useState(12);

  // Simulation of live monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkValue(prev => Math.max(800, Math.min(950, prev + (Math.random() * 20 - 10))));
      setSecurityValue(prev => Math.max(8, Math.min(18, prev + (Math.random() * 2 - 1))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 min-h-[80vh] flex items-center overflow-hidden noc-grid">
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-turquoise/10 border border-turquoise/20 rounded-full mb-4"
            >
              <span className="h-2 w-2 rounded-full bg-turquoise animate-pulse"></span>
              <span className="text-turquoise code-font text-[10px] font-bold uppercase tracking-widest">{t("hero.badge")}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary font-mono text-xs mb-2"
            >
              {t("hero.tagline")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6"
            >
              <span className="text-text-primary block">{t("hero.title_part1")}</span>
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-turquoise italic">{t("hero.title_part2")}</span>
                <span className="absolute inset-0 bg-turquoise/20 blur-3xl rounded-full scale-150 animate-pulse"></span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-text-secondary/80 max-w-xl mb-8 font-medium leading-relaxed"
            >
              {t("hero.desc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <a href="#categories" className="px-7 py-3.5 bg-turquoise text-navy font-black rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-turquoise/20 text-sm">
                {t("hero.cta_explore")} <ChevronRight size={16} className="ml-2" />
              </a>
              <a href="#newsletter" className="px-7 py-3.5 bg-bg-secondary border border-border-main text-text-primary font-bold rounded-xl flex items-center justify-center transition-all hover:bg-turquoise/5 hover:border-turquoise text-sm">
                <Mail size={16} className="mr-2" /> {t("hero.cta_news")}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/40"
            >
              <div className="flex items-center"><Users size={14} className="mr-2" /> {t("hero.stat_engineers")}</div>
              <div className="flex items-center"><FileText size={14} className="mr-2" /> {t("hero.stat_articles")}</div>
              <div className="flex items-center"><RefreshCw size={14} className="mr-2" /> {t("hero.stat_updated")}</div>
            </motion.div>
          </div>

          {/* Right Content - Animated Dashboard */}
          <div className="lg:col-span-5 relative hidden md:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] lg:aspect-square max-w-[440px] ml-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-turquoise/5 to-transparent rounded-[2rem] border border-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col">
                
                {/* Visual Grid / Mesh area */}
                <div className="flex-grow relative p-6">
                  <div className="absolute inset-0 opacity-20 noc-grid"></div>
                  
                  {/* Decorative Mesh Dots */}
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      className="absolute w-1 h-1 bg-turquoise rounded-full"
                      style={{
                        top: `${Math.random() * 80}%`,
                        left: `${Math.random() * 90}%`,
                      }}
                    />
                  ))}
                  
                  <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                    <line x1="20%" y1="20%" x2="40%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-turquoise" />
                    <line x1="40%" y1="50%" x2="80%" y2="30%" stroke="currentColor" strokeWidth="1" className="text-turquoise" />
                    <line x1="10%" y1="70%" x2="40%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-turquoise" />
                  </svg>
                </div>

                {/* Monitoring Section (Bottom Card) */}
                <div className="bg-navy/40 border-t border-white/5 p-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-turquoise uppercase tracking-[0.2em]">{t("hero.monitor_live")}</span>
                    <div className="flex items-center space-x-2">
                      <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">HEALTHY</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Throughput Bar */}
                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-text-secondary/60 mb-1.5 uppercase tracking-widest">
                        <span>{t("hero.monitor_network")}</span>
                        <span className="text-turquoise code-font">{Math.round(networkValue)} Mbps</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${(networkValue / 1000) * 100}%` }}
                          className="h-full bg-gradient-to-r from-turquoise/40 to-turquoise rounded-full"
                        />
                      </div>
                    </div>

                    {/* Security Events Bar */}
                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-text-secondary/60 mb-1.5 uppercase tracking-widest">
                        <span>{t("hero.monitor_security")}</span>
                        <span className="text-pink-500 code-font">{Math.round(securityValue)}/min</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${(securityValue / 20) * 100}%` }}
                          className="h-full bg-gradient-to-r from-pink-500/40 to-pink-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

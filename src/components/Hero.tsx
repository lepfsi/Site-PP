"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronRight, Mail, Users, FileText, RefreshCw, Activity, ShieldAlert, Crown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect, useRef } from "react";

function HeroDashboard({
  networkValue,
  t,
}: {
  networkValue: number;
  t: (key: any) => string;
}) {
  return (
    <div className="relative aspect-square max-w-[380px] ml-auto w-full">
      {/* BACKGROUND STATISTICS BEHIND TERMINAL */}
      <div className="absolute -top-12 -left-12 z-0 opacity-10 pointer-events-none hidden xl:block">
        <div className="space-y-4 font-mono text-[10px] text-turquoise uppercase tracking-[0.2em]">
          <div className="flex items-center space-x-2"><Users size={12} /> <span>{t("hero.stat_engineers")}</span></div>
          <div className="flex items-center space-x-2"><FileText size={12} /> <span>{t("hero.stat_articles")}</span></div>
          <div className="flex items-center space-x-2"><RefreshCw size={12} /> <span>{t("hero.stat_updated")}</span></div>
        </div>
      </div>

      <div className="relative z-10 bg-bg-secondary/40 border border-white/5 backdrop-blur-3xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col h-full">
        {/* Mac Title Bar */}
        <div className="bg-navy/60 border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
          </div>
          <div className="text-[9px] font-mono text-text-secondary/50 uppercase tracking-widest font-bold">
            dailyops — status
          </div>
          <div className="w-10"></div>
        </div>

        {/* Status Terminal View */}
        <div className="flex-grow relative overflow-hidden bg-navy/10 font-mono text-[11px] p-8">
           <div className="flex items-start space-x-3 text-turquoise/90 mb-6">
              <span className="text-turquoise opacity-70">{"</>"}</span>
              <span className="font-bold">$ dailyops --status</span>
           </div>
           
           <div className="space-y-3 pl-8">
              <div className="flex items-center space-x-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-turquoise shadow-[0_0_8px_#2dd4bf]"></span>
                 <span className="text-turquoise">knowledge_base online</span>
              </div>
              <div className="flex items-center space-x-2 text-text-secondary/60">
                 <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/30"></span>
                 <span>playbooks 342 entries</span>
              </div>
              <div className="flex items-center space-x-2 text-text-secondary/60">
                 <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/30"></span>
                 <span>last_sync 2h ago</span>
              </div>
           </div>
        </div>

        {/* Monitoring Section */}
        <div className="bg-navy/80 border-t border-white/5 p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-turquoise/20 rounded-lg text-turquoise">
                <Activity size={12} />
              </div>
              <span className="text-[8px] font-black text-text-primary uppercase tracking-[0.2em]">{t("hero.monitor_live")}</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">LIVE</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[8px] font-bold text-text-secondary/60 mb-1 uppercase tracking-widest">
                <span>{t("hero.monitor_network")}</span>
                <span className="text-turquoise code-font">{Math.round(networkValue)} Mbps</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${(networkValue / 1000) * 100}%` }} className="h-full bg-gradient-to-r from-turquoise/40 to-turquoise rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [networkValue, setNetworkValue] = useState(847);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const metricsInterval = setInterval(() => {
      setNetworkValue(prev => Math.max(820, Math.min(980, prev + (Math.random() * 30 - 15))));
    }, 2000);
    return () => clearInterval(metricsInterval);
  }, [mounted]);

  if (!mounted) return <section className="min-h-[70vh]"></section>;

  const staggeredContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const staggeredItem: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <section className="relative pt-32 pb-8 md:pt-40 md:pb-12 min-h-[75vh] lg:min-h-[85vh] flex items-center overflow-hidden noc-grid">
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-10 w-fit"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-500 code-font text-[9px] font-black uppercase tracking-widest">{t("hero.badge")}</span>
            </motion.div>

            <motion.div 
               variants={staggeredContainer}
               initial="hidden"
               animate="show"
               className="space-y-1 mb-8"
            >
              <motion.h1 variants={staggeredItem} className="text-5xl md:text-7xl lg:text-7xl font-black tracking-tighter text-text-primary code-font">
                {t("hero.title_part1")}
              </motion.h1>
              <motion.h1 variants={staggeredItem} className="text-5xl md:text-7xl lg:text-7xl font-black tracking-tighter text-turquoise italic code-font">
                {t("hero.title_part2")}
              </motion.h1>
              <motion.h1 variants={staggeredItem} className="text-5xl md:text-7xl lg:text-7xl font-black tracking-tighter text-text-primary code-font">
                {t("hero.title_part3")}
              </motion.h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-base md:text-lg text-text-secondary/80 max-w-xl mb-10 font-medium leading-relaxed tracking-tight"
            >
              {t("hero.desc")}
            </motion.p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#categories" className="px-8 py-4 bg-text-primary text-bg-primary font-black rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl text-xs tracking-widest uppercase">
                {t("hero.cta_explore")}
              </a>
              <a href="#articles" className="px-8 py-4 bg-bg-secondary border-2 border-turquoise text-turquoise font-black rounded-xl flex items-center justify-center transition-all hover:bg-turquoise/10 text-xs tracking-widest uppercase shadow-lg shadow-turquoise/5">
                {t("hero.cta_browse")}
              </a>
              <a href="#newsletter" className="px-8 py-4 bg-bg-secondary border border-border-main text-text-secondary hover:text-turquoise hover:border-turquoise font-bold rounded-xl flex items-center justify-center transition-all text-xs tracking-widest uppercase group">
                <Mail size={14} className="mr-2 group-hover:scale-110" />
                {t("hero.cta_news")}
              </a>
            </div>
          </div>

          {/* RIGHT DASHBOARD */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <HeroDashboard 
                networkValue={networkValue}
                t={t}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

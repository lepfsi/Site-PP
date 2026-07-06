"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronRight, Mail, Users, FileText, RefreshCw, Activity, ShieldAlert, Crown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect, useRef } from "react";

const LOG_LINES = [
  "[14:22:01] BGP_SESSION: Peer 10.0.4.1 Established",
  "[14:22:05] FW_BLOCK: Denied inbound from 185.x.x.x",
  "[14:22:12] K8S_NODE: node-04 scaling up...",
  "[14:22:15] MONITOR: Latency spikes detected on AS64496",
  "[14:22:20] SSH_LOGIN: Accepted key for user 'ops'",
  "[14:22:24] BGP_PREFIX: 172.16.0.0/24 advertised",
  "[14:22:28] SSL_CERT: Expiring in 12 days (renewing...)",
  "[14:22:32] OPS: Baseline applied to CORE-SW-01"
];

function HeroDashboard({
  dashboardMode,
  visibleLogs,
  networkValue,
  securityValue,
  t,
}: {
  dashboardMode: "mesh" | "terminal";
  visibleLogs: string[];
  networkValue: number;
  securityValue: number;
  t: (key: any) => string;
}) {
  return (
    <div className="relative aspect-square max-w-[380px] ml-auto w-full">
      {/* FLOATING STATS BLOCK - Shifted further left for visibility */}
      <motion.div 
        animate={{ 
          y: [0, -12, 0],
          x: [0, 8, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-14 -left-28 z-0 opacity-15 pointer-events-none hidden xl:block bg-bg-secondary/20 p-5 rounded-2xl border border-turquoise/20 backdrop-blur-sm shadow-2xl"
      >
        <div className="space-y-4 font-mono text-[9px] text-turquoise uppercase tracking-[0.2em]">
          <div className="flex items-center space-x-2"><Users size={12} /> <span>7K+ Active Ops</span></div>
          <div className="flex items-center space-x-2"><FileText size={12} /> <span>340+ Technical Nodes</span></div>
          <div className="flex items-center space-x-2"><RefreshCw size={12} /> <span>Verified Baselines</span></div>
        </div>
      </motion.div>

      <div className="relative z-10 bg-bg-secondary/40 border border-white/5 backdrop-blur-3xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col h-full">
        {/* Mac Title Bar */}
        <div className="bg-navy/60 border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
          </div>
          <div className="text-[9px] font-mono text-text-secondary/50 uppercase tracking-widest font-bold">
            {dashboardMode === "mesh" ? "topology_viz.sh" : "ops_logs_live.tail"}
          </div>
          <div className="w-10"></div>
        </div>

        {/* Dynamic Animation Area */}
        <div className="flex-grow relative overflow-hidden bg-navy/10">
          <AnimatePresence mode="wait">
            {dashboardMode === "mesh" ? (
              <motion.div key="mesh-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-6 flex items-center justify-center">
                <svg className="w-full h-full text-turquoise/20" viewBox="0 0 100 100">
                  {[...Array(12)].map((_, i) => (
                    <motion.line 
                      key={i} 
                      x1={Math.random() * 100} y1={Math.random() * 100} 
                      x2={Math.random() * 100} y2={Math.random() * 100} 
                      stroke="currentColor" strokeWidth="0.3" 
                      animate={{ opacity: [0.05, 0.2, 0.05] }}
                      transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: i * 0.5 }}
                    />
                  ))}
                  <motion.path 
                    d="M 20 20 L 50 80 L 85 30 L 70 10 L 20 20 M 50 80 L 10 60 L 20 20" 
                    fill="none" stroke="currentColor" strokeWidth="0.8" 
                    strokeDasharray="300"
                    className="text-turquoise"
                    animate={{ strokeDashoffset: [300, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle r="1.5" className="fill-turquoise">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 20 20 L 50 80 L 85 30 L 70 10 L 20 20" />
                  </motion.circle>
                  <circle cx="20" cy="20" r="2" className="fill-turquoise" />
                  <circle cx="50" cy="80" r="2" className="fill-turquoise" />
                  <circle cx="85" cy="30" r="2" className="fill-turquoise" />
                  <circle cx="70" cy="10" r="2" className="fill-turquoise" />
                </svg>
              </motion.div>
            ) : (
              <motion.div key="terminal-mode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute inset-0 p-6 font-mono text-[9px]">
                <div className="space-y-1.5">
                  {visibleLogs.map((log, idx) => (
                    <div key={`${log}-${idx}`} className={log.includes("FW_BLOCK") ? "text-pink-500" : "text-turquoise/90"}>
                      <span className="opacity-30 mr-2">{">"}</span> {log}
                    </div>
                  ))}
                </div>
                <motion.div animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1.5 h-3 bg-turquoise mt-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Monitoring Bottom Section */}
        <div className="bg-navy/80 border-t border-white/5 p-4 md:p-6 backdrop-blur-xl">
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
            
            <div>
              <div className="flex justify-between text-[8px] font-bold text-text-secondary/60 mb-1 uppercase tracking-widest">
                <span>{t("hero.monitor_security")}</span>
                <div className="flex items-center text-pink-500">
                  <ShieldAlert size={10} className="mr-1.5" />
                  <span className="code-font">{Math.round(securityValue)}/min</span>
                </div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${(securityValue / 25) * 100}%` }} className="h-full bg-gradient-to-r from-pink-500/40 to-pink-500 rounded-full" />
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
  const [securityValue, setSecurityValue] = useState(12);
  const [dashboardMode, setDashboardMode] = useState<"mesh" | "terminal">("mesh");
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  
  const logIndexRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const modeInterval = setInterval(() => {
      setDashboardMode(prev => (prev === "mesh" ? "terminal" : "mesh"));
    }, 5000);
    return () => clearInterval(modeInterval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const metricsInterval = setInterval(() => {
      setNetworkValue(prev => Math.max(820, Math.min(980, prev + (Math.random() * 30 - 15))));
      setSecurityValue(prev => Math.max(10, Math.min(22, prev + (Math.random() * 2 - 1))));
    }, 2000);
    return () => clearInterval(metricsInterval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || dashboardMode !== "terminal") {
      setVisibleLogs([]);
      logIndexRef.current = 0;
      return;
    }
    const logInterval = setInterval(() => {
      setVisibleLogs(prev => {
        const nextLog = LOG_LINES[logIndexRef.current % LOG_LINES.length];
        logIndexRef.current++;
        const newList = [...prev, nextLog];
        return newList.length > 7 ? newList.slice(1) : newList;
      });
    }, 800);
    return () => clearInterval(logInterval);
  }, [mounted, dashboardMode]);

  if (!mounted) return <section className="min-h-[70vh]"></section>;

  const staggeredContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const staggeredItem: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="relative pt-28 pb-4 md:pt-32 md:pb-6 min-h-[60vh] lg:min-h-[75vh] flex items-center overflow-hidden noc-grid">
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-10 w-fit"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-500 code-font text-[9px] font-black uppercase tracking-widest">{t("hero.badge")}</span>
            </motion.div>

            <div className="mb-6 lg:mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-text-primary code-font mb-4 whitespace-nowrap"
              >
                Real-World IT Operations
              </motion.h1>
              
              <motion.div 
                variants={staggeredContainer}
                initial="hidden"
                animate="show"
                className="flex items-center space-x-3 text-xl md:text-2xl lg:text-3xl font-black code-font text-text-primary"
              >
                <motion.span variants={staggeredItem}>Operate.</motion.span>
                <motion.span variants={staggeredItem} className="text-turquoise italic">Optimize.</motion.span>
                <motion.span variants={staggeredItem}>Secure.</motion.span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-xs md:text-sm text-text-secondary/80 max-w-xl mb-14 lg:mb-16 font-medium leading-relaxed tracking-tight"
            >
              {t("hero.desc")}
            </motion.p>

            {/* BUTTONS TRIPLET - Shifted down with more margin */}
            <div className="flex flex-wrap gap-3 mt-4">
              <a href="#categories" className="px-5 py-2.5 bg-text-primary text-bg-primary font-black rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl text-[10px] tracking-widest uppercase border border-transparent">
                {t("hero.cta_explore")}
              </a>
              <a href="#articles" className="px-5 py-2.5 bg-bg-secondary border-2 border-turquoise text-turquoise font-black rounded-xl flex items-center justify-center transition-all hover:bg-turquoise/10 text-[10px] tracking-widest uppercase shadow-lg shadow-turquoise/5">
                {t("hero.cta_browse")}
              </a>
              <a href="#newsletter" className="px-5 py-2.5 bg-bg-secondary border border-border-main text-text-secondary font-bold rounded-xl flex items-center justify-center transition-all text-[10px] tracking-widest uppercase group hover:border-turquoise hover:text-turquoise">
                <Mail size={12} className="mr-2 group-hover:scale-110" />
                {t("hero.cta_news")}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Stats block - Shifted left */}
            <motion.div 
              animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-14 -left-28 z-0 opacity-15 pointer-events-none bg-bg-secondary/20 p-5 rounded-2xl border border-turquoise/20 backdrop-blur-sm shadow-2xl"
            >
              <div className="space-y-4 font-mono text-[9px] text-turquoise uppercase tracking-[0.2em]">
                <div className="flex items-center space-x-2"><Users size={12} /> <span>7K+ Active Ops</span></div>
                <div className="flex items-center space-x-2"><FileText size={12} /> <span>340+ Technical Nodes</span></div>
                <div className="flex items-center space-x-2"><RefreshCw size={12} /> <span>Verified Baselines</span></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <HeroDashboard 
                dashboardMode={dashboardMode}
                visibleLogs={visibleLogs}
                networkValue={networkValue}
                securityValue={securityValue}
                t={t}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

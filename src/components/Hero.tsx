"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronRight, Mail, Users, FileText, RefreshCw, Activity, ShieldAlert, Crown, Terminal as TerminalIcon } from "lucide-react";
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
  t,
}: {
  dashboardMode: "mesh" | "terminal";
  visibleLogs: string[];
  networkValue: number;
  t: (key: any) => string;
}) {
  return (
    <div className="relative aspect-square max-w-[400px] ml-auto w-full">
      <div className="absolute inset-0 bg-bg-secondary/40 border border-white/5 backdrop-blur-3xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col h-full">
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

        {/* Animation Area */}
        <div className="flex-grow relative overflow-hidden bg-navy/10">
          <AnimatePresence mode="wait">
            {dashboardMode === "mesh" ? (
              <motion.div key="mesh-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-6 flex items-center justify-center">
                <svg className="w-full h-full text-turquoise/20" viewBox="0 0 100 100">
                  {/* High Complexity Mesh */}
                  {[...Array(10)].map((_, i) => (
                    <motion.line 
                      key={i} 
                      x1={Math.random() * 100} y1={Math.random() * 100} 
                      x2={Math.random() * 100} y2={Math.random() * 100} 
                      stroke="currentColor" strokeWidth="0.5" 
                      animate={{ opacity: [0.05, 0.2, 0.05] }}
                      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i }}
                    />
                  ))}
                  <motion.path d="M 20 20 L 50 80 L 85 30 L 20 20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="200" className="text-turquoise" animate={{ strokeDashoffset: [200, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                  <motion.circle r="1.5" className="fill-turquoise shadow-lg shadow-turquoise">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 20 20 L 50 80 L 85 30 Z" />
                  </motion.circle>
                  <circle cx="20" cy="20" r="2" className="fill-turquoise" />
                  <circle cx="50" cy="80" r="2" className="fill-turquoise" />
                  <circle cx="85" cy="30" r="2" className="fill-turquoise" />
                </svg>
              </motion.div>
            ) : (
              <motion.div key="terminal-mode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute inset-0 p-6 font-mono text-[9px]">
                <div className="space-y-1.5">
                  {visibleLogs.map((log, idx) => (
                    <div key={idx} className={log.includes("FW_BLOCK") ? "text-pink-500" : "text-turquoise/90"}>
                      <span className="opacity-30 mr-2">{">"}</span> {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metrics Section */}
        <div className="bg-navy/80 border-t border-white/5 p-4 md:p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-turquoise/20 rounded-lg text-turquoise">
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

// Floating Stat Component (TikTok author tag style)
function FloatingStat({ text, icon: Icon, delay = 0 }: { text: string; icon: any; delay?: number }) {
  return (
    <motion.div
      initial={{ x: "0%", y: "0%" }}
      animate={{ 
        x: [
          `${Math.random() * 20 - 10}%`, 
          `${Math.random() * 40 - 20}%`, 
          `${Math.random() * 20 - 10}%`
        ],
        y: [
          `${Math.random() * 10 - 5}%`, 
          `${Math.random() * 20 - 10}%`, 
          `${Math.random() * 10 - 5}%`
        ]
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
        delay
      }}
      className="absolute p-3 bg-bg-secondary/5 border border-white/5 backdrop-blur-sm rounded-xl flex items-center space-x-2 text-turquoise/30 select-none z-0"
      style={{
        top: `${20 + Math.random() * 50}%`,
        left: `${40 + Math.random() * 40}%`,
      }}
    >
      <Icon size={12} />
      <span className="font-mono text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">{text}</span>
    </motion.div>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [networkValue, setNetworkValue] = useState(847);
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
    <section className="relative pt-24 pb-8 md:pt-32 md:pb-12 min-h-[65vh] lg:min-h-[80vh] flex items-center overflow-hidden noc-grid">
      
      {/* FLOATING TIKTOK-STYLE STATS BEHIND DASHBOARD */}
      <FloatingStat text={t("hero.stat_engineers")} icon={Users} delay={0} />
      <FloatingStat text={t("hero.stat_articles")} icon={FileText} delay={5} />
      <FloatingStat text={t("hero.stat_updated")} icon={RefreshCw} delay={2} />

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* BADGE ALIGNED WITH DASHBOARD TOP (GREEN) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-10 w-fit"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-500 code-font text-[9px] font-black uppercase tracking-widest">{t("hero.badge")}</span>
            </motion.div>

            {/* NEW HIERARCHICAL TITLE */}
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-text-primary code-font mb-4"
              >
                {t("hero.title_main")}
              </motion.h1>
              
              <motion.div 
                variants={staggeredContainer}
                initial="hidden"
                animate="show"
                className="flex items-center space-x-3 text-2xl md:text-3xl lg:text-4xl font-black code-font text-turquoise italic"
              >
                <motion.span variants={staggeredItem}>Operate.</motion.span>
                <motion.span variants={staggeredItem}>Optimize.</motion.span>
                <motion.span variants={staggeredItem}>Secure.</motion.span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-sm md:text-base text-text-secondary/80 max-w-xl mb-10 font-medium leading-relaxed tracking-tight"
            >
              {t("hero.desc")}
            </motion.p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#categories" className="px-6 py-3 bg-text-primary text-bg-primary font-black rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl text-[10px] tracking-widest uppercase border border-transparent">
                {t("hero.cta_explore")}
              </a>
              <a href="#articles" className="px-6 py-3 bg-bg-secondary border-2 border-turquoise text-turquoise font-black rounded-xl flex items-center justify-center transition-all hover:bg-turquoise/10 text-[10px] tracking-widest uppercase shadow-lg shadow-turquoise/5">
                {t("hero.cta_browse")}
              </a>
              <a href="#newsletter" className="px-6 py-3 bg-bg-secondary border border-border-main text-text-secondary hover:text-turquoise hover:border-turquoise font-bold rounded-xl flex items-center justify-center transition-all text-xs tracking-widest uppercase group">
                <Mail size={12} className="mr-2 group-hover:scale-110" />
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
                dashboardMode={dashboardMode}
                visibleLogs={visibleLogs}
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

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
  "[14:22:32] OPS: Baseline applied to CORE-SW-01",
  "[14:22:35] ALERT: Integrity check successful",
  "[14:22:40] DB_REPL: Primary to secondary sync OK"
];

// Helper to generate random points for the complex mesh
const generateMeshPoints = (count: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: 1 + Math.random() * 1.5,
    speed: 3 + Math.random() * 5
  }));
};

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
  const meshPoints = useRef(generateMeshPoints(18));

  return (
    <div className="relative aspect-square max-w-[420px] ml-auto w-full group">
      
      {/* 1. FLOATING STATS BLOCK (TikTok style) - Shifted left and animated */}
      <motion.div 
        animate={{ 
          y: [0, -15, 5, 0],
          x: [0, 10, -5, 0],
          rotate: [0, 1, -1, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-16 -left-40 z-0 opacity-15 pointer-events-none hidden xl:block bg-bg-secondary/20 p-6 rounded-[2rem] border border-turquoise/20 backdrop-blur-md shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
      >
        <div className="space-y-4 font-mono text-[9px] text-turquoise uppercase tracking-[0.3em]">
          <div className="flex items-center space-x-3"><Users size={12} className="opacity-50" /> <span>7K+ Active Ops</span></div>
          <div className="flex items-center space-x-3"><FileText size={12} className="opacity-50" /> <span>340+ Technical Nodes</span></div>
          <div className="flex items-center space-x-3"><RefreshCw size={12} className="opacity-50" /> <span>Verified Baselines</span></div>
        </div>
      </motion.div>

      <div className="relative z-10 bg-bg-secondary/40 border border-white/5 backdrop-blur-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-full transition-all duration-500 group-hover:shadow-turquoise/5">
        
        {/* MAC TITLE BAR */}
        <div className="bg-navy/60 border-b border-white/5 px-5 py-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-inner shadow-black/20"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-inner shadow-black/20"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-inner shadow-black/20"></div>
          </div>
          <div className="text-[10px] font-mono text-text-secondary/60 uppercase tracking-widest font-black">
            {dashboardMode === "mesh" ? "topology_viz.sh" : "ops_logs_live.tail"}
          </div>
          <div className="w-12"></div>
        </div>

        {/* DYNAMIC ANIMATION AREA (High Complexity) */}
        <div className="flex-grow relative overflow-hidden bg-navy/20 font-mono text-[10px]">
          <AnimatePresence mode="wait">
            {dashboardMode === "mesh" ? (
              <motion.div 
                key="mesh-mode" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.05 }} 
                className="absolute inset-0 p-8 flex items-center justify-center"
              >
                <svg className="w-full h-full text-turquoise/20" viewBox="0 0 100 100">
                  {/* Background complex grid lines */}
                  {meshPoints.current.map((p, i) => (
                    <motion.line 
                      key={i} 
                      x1={p.x} y1={p.y} 
                      x2={meshPoints.current[(i + 1) % meshPoints.current.length].x} 
                      y2={meshPoints.current[(i + 1) % meshPoints.current.length].y} 
                      stroke="currentColor" strokeWidth="0.2" 
                      animate={{ opacity: [0.05, 0.2, 0.05] }}
                      transition={{ duration: p.speed, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                  
                  {/* Main Data Thread */}
                  <motion.path 
                    d="M 10 10 L 40 60 L 80 20 L 90 80 L 20 90 Z" 
                    fill="none" stroke="currentColor" strokeWidth="1" 
                    strokeDasharray="400"
                    className="text-turquoise"
                    animate={{ strokeDashoffset: [400, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Active Nodes */}
                  {meshPoints.current.slice(0, 8).map((p, i) => (
                    <motion.circle 
                      key={`node-${i}`}
                      cx={p.x} cy={p.y} r={p.r} 
                      className="fill-turquoise"
                      animate={{ opacity: [0.3, 1, 0.3], r: [p.r, p.r * 1.5, p.r] }}
                      transition={{ duration: 2 + i % 3, repeat: Infinity }}
                    />
                  ))}
                </svg>
              </motion.div>
            ) : (
              <motion.div 
                key="terminal-mode" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                className="absolute inset-0 p-8 font-mono text-[10px]"
              >
                <div className="space-y-2">
                  {visibleLogs.map((log, idx) => (
                    <div key={`${log}-${idx}`} className="flex items-start">
                      <span className="opacity-30 mr-3 text-turquoise">{">"}</span>
                      <span className={log.includes("FW_BLOCK") ? "text-pink-500" : log.includes("Established") ? "text-green-400" : "text-turquoise/90"}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
                <motion.div 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ duration: 0.6, repeat: Infinity }} 
                  className="w-2 h-4 bg-turquoise mt-4 shadow-[0_0_10px_rgba(45,212,191,0.5)]" 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MONITORING BOTTOM SECTION */}
        <div className="bg-navy/80 border-t border-white/5 p-8 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-turquoise/20 rounded-xl text-turquoise shadow-inner shadow-white/10">
                <Activity size={14} />
              </div>
              <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em]">{t("hero.monitor_live")}</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 shadow-lg shadow-green-500/5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.2em]">{t("hero.monitor_live_badge")}</span>
            </div>
          </div>

          <div className="space-y-5">
            {/* Network Metric */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-text-secondary/60 mb-2 uppercase tracking-widest">
                <span>{t("hero.monitor_network")}</span>
                <span className="text-turquoise code-font font-black">{Math.round(networkValue)} Mbps</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                <motion.div 
                  animate={{ width: `${(networkValue / 1000) * 100}%` }} 
                  className="h-full bg-gradient-to-r from-turquoise/40 via-turquoise to-turquoise-dark rounded-full shadow-[0_0_10px_rgba(45,212,191,0.3)]" 
                />
              </div>
            </div>

            {/* Security Metric (RESTORED) */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-text-secondary/60 mb-2 uppercase tracking-widest">
                <span>{t("hero.monitor_security")}</span>
                <div className="flex items-center text-pink-500">
                  <ShieldAlert size={12} className="mr-2" />
                  <span className="code-font font-black">{Math.round(securityValue)}/min</span>
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                <motion.div 
                  animate={{ width: `${(securityValue / 25) * 100}%` }} 
                  className="h-full bg-gradient-to-r from-pink-500/40 via-pink-500 to-pink-600 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.3)]" 
                />
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

  // DASHBOARD AUTO-SWITCH (Every 5s)
  useEffect(() => {
    if (!mounted) return;
    const modeInterval = setInterval(() => {
      setDashboardMode(prev => (prev === "mesh" ? "terminal" : "mesh"));
    }, 5000);
    return () => clearInterval(modeInterval);
  }, [mounted]);

  // LIVE METRICS LOOP
  useEffect(() => {
    if (!mounted) return;
    const metricsInterval = setInterval(() => {
      setNetworkValue(prev => Math.max(820, Math.min(980, prev + (Math.random() * 40 - 20))));
      setSecurityValue(prev => Math.max(8, Math.min(24, prev + (Math.random() * 2 - 1))));
    }, 1500);
    return () => clearInterval(metricsInterval);
  }, [mounted]);

  // LOG STREAMING
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
        return newList.length > 8 ? newList.slice(1) : newList;
      });
    }, 600);
    return () => clearInterval(logInterval);
  }, [mounted, dashboardMode]);

  if (!mounted) return <section className="min-h-[70vh]"></section>;

  const staggeredContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const staggeredItem: Variants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative pt-28 pb-10 md:pt-32 md:pb-12 min-h-[75vh] lg:min-h-[85vh] flex items-center overflow-hidden noc-grid">
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* BADGE (GREEN) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-10 w-fit shadow-[0_0_20px_rgba(34,197,94,0.1)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-500 code-font text-[10px] font-black uppercase tracking-[0.2em]">{t("hero.badge")}</span>
            </motion.div>

            {/* HIERARCHICAL SLOGAN */}
            <div className="mb-10">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-text-primary code-font mb-4 whitespace-nowrap"
              >
                {t("hero.title_main")}
              </motion.h1>
              
              <motion.div 
                variants={staggeredContainer}
                initial="hidden"
                animate="show"
                className="flex items-center space-x-4 text-xl md:text-2xl lg:text-3xl font-black code-font text-text-primary"
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
              className="text-sm md:text-base text-text-secondary/80 max-w-xl mb-12 font-medium leading-relaxed tracking-tight"
            >
              {t("hero.desc")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <a href="#categories" className="px-8 py-3.5 bg-text-primary text-bg-primary font-black rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl text-[10px] tracking-widest uppercase border border-transparent">
                {t("hero.cta_explore")}
              </a>
              <a href="#articles" className="px-8 py-3.5 bg-bg-secondary border-2 border-turquoise text-turquoise font-black rounded-2xl flex items-center justify-center transition-all hover:bg-turquoise/10 text-[10px] tracking-widest uppercase shadow-lg shadow-turquoise/5">
                {t("hero.cta_browse")}
              </a>
              <a href="#newsletter" className="px-8 py-3.5 bg-bg-secondary border border-border-main text-text-secondary hover:text-turquoise hover:border-turquoise font-bold rounded-2xl flex items-center justify-center transition-all text-xs tracking-widest uppercase group">
                <Mail size={14} className="mr-2 group-hover:scale-110" />
                {t("hero.cta_news")}
              </a>
            </motion.div>
          </div>

          {/* RIGHT CONTENT - HIGH FIDELITY DASHBOARD */}
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

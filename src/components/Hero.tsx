"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Mail, Users, FileText, RefreshCw, Terminal as TerminalIcon, Activity, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";

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

export default function Hero() {
  const { t } = useLanguage();
  const [networkValue, setNetworkValue] = useState(847);
  const [securityValue, setSecurityValue] = useState(12);
  const [dashboardMode, setDashboardMode] = useState<"mesh" | "terminal">("mesh");
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  // Mode alternating
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardMode(prev => prev === "mesh" ? "terminal" : "mesh");
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Live metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkValue(prev => Math.max(800, Math.min(950, prev + (Math.random() * 20 - 10))));
      setSecurityValue(prev => Math.max(8, Math.min(18, prev + (Math.random() * 2 - 1))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Terminal log streaming
  useEffect(() => {
    if (dashboardMode === "terminal") {
      setVisibleLogs([]);
      let i = 0;
      const interval = setInterval(() => {
        if (i < LOG_LINES.length) {
          setVisibleLogs(prev => [...prev.slice(-5), LOG_LINES[i]]);
          i++;
        } else {
          i = 0;
          setVisibleLogs([]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dashboardMode]);

  return (
    <section className="relative pt-16 pb-8 md:pt-20 md:pb-12 min-h-[75vh] lg:min-h-[85vh] flex items-center overflow-hidden noc-grid">
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-turquoise/10 border border-turquoise/20 rounded-full mb-3"
            >
              <span className="h-2 w-2 rounded-full bg-turquoise animate-pulse"></span>
              <span className="text-turquoise code-font text-[10px] font-black uppercase tracking-widest">{t("hero.badge")}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary font-mono text-[10px] mb-1"
            >
              {t("hero.tagline")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1] mb-5"
            >
              <span className="text-text-primary block">{t("hero.title_part1")}</span>
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-turquoise italic">{t("hero.title_part2")}</span>
                <span className="absolute inset-0 bg-turquoise/20 blur-[80px] rounded-full scale-150 animate-pulse"></span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base text-text-secondary/80 max-w-lg mb-6 font-medium leading-relaxed"
            >
              {t("hero.desc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <a href="#categories" className="px-6 py-3 bg-text-primary text-bg-primary font-black rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg text-xs">
                {t("hero.cta_explore")} <ChevronRight size={14} className="ml-2" />
              </a>
              <a href="#newsletter" className="px-6 py-3 bg-bg-secondary border border-border-main text-text-primary font-bold rounded-xl flex items-center justify-center transition-all hover:bg-turquoise/5 hover:border-turquoise text-xs">
                <Mail size={14} className="mr-2" /> {t("hero.cta_news")}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-5 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/40"
            >
              <div className="flex items-center"><Users size={12} className="mr-2" /> {t("hero.stat_engineers")}</div>
              <div className="flex items-center"><FileText size={12} className="mr-2" /> {t("hero.stat_articles")}</div>
              <div className="flex items-center"><RefreshCw size={12} className="mr-2" /> {t("hero.stat_updated")}</div>
            </motion.div>
          </div>

          {/* Right Content - "The Genius" Multi-mode Dashboard */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square max-w-[400px] ml-auto group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-turquoise/10 to-transparent rounded-3xl border border-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col">
                
                {/* Visual Area with Automatic Mode Switching */}
                <div className="flex-grow relative overflow-hidden bg-navy/20 p-5 font-mono text-[10px]">
                  <AnimatePresence mode="wait">
                    {dashboardMode === "mesh" ? (
                      <motion.div
                        key="mesh"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        className="absolute inset-0 p-5"
                      >
                        <div className="flex justify-between items-center mb-4 opacity-40">
                          <span>NODE_TOPOLOGY</span>
                          <span className="text-turquoise font-bold">MODE: ACTIVE</span>
                        </div>
                        {/* Animated Mesh / Network Visualization */}
                        <svg className="w-full h-full opacity-30">
                          <motion.path
                            d="M 20 20 L 150 150 L 300 50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeDasharray="1000"
                            className="text-turquoise"
                            animate={{ strokeDashoffset: [1000, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.circle cx="20" cy="20" r="3" className="fill-turquoise" />
                          <motion.circle cx="150" cy="150" r="3" className="fill-turquoise" />
                          <motion.circle cx="300" cy="50" r="3" className="fill-turquoise" />
                        </svg>
                        
                        {/* Data Packets Moving along lines */}
                        <motion.div 
                          animate={{ 
                            left: ["20%", "40%", "80%"],
                            top: ["20%", "50%", "30%"]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute w-2 h-2 bg-turquoise blur-[2px] rounded-full z-10"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="terminal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="absolute inset-0 p-5 bg-navy/60"
                      >
                        <div className="flex items-center space-x-2 mb-4 text-turquoise/50">
                          <TerminalIcon size={12} />
                          <span className="font-bold tracking-widest">SYSTEM_JOURNAL_STABLE</span>
                        </div>
                        <div className="space-y-2">
                          {visibleLogs.map((log, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={log.includes("FW_BLOCK") ? "text-pink-500" : "text-turquoise/80"}
                            >
                              <span className="opacity-30 mr-2">{">"}</span> {log}
                            </motion.div>
                          ))}
                        </div>
                        <motion.span 
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-2 h-3 bg-turquoise ml-1 mt-2"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Constant Monitoring Section (Bottom) */}
                <div className="bg-navy/80 border-t border-white/5 p-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-turquoise/20 rounded-lg text-turquoise">
                        <Activity size={12} />
                      </div>
                      <span className="text-[9px] font-black text-text-primary uppercase tracking-[0.2em]">{t("hero.monitor_live")}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-500/10 px-2 py-1 rounded-md">
                      <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">STABLE</span>
                    </div>
                  </div>

                  <div className="space-y-4">
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

                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-text-secondary/60 mb-1.5 uppercase tracking-widest">
                        <span>{t("hero.monitor_security")}</span>
                        <div className="flex items-center text-pink-500">
                          <ShieldAlert size={10} className="mr-1" />
                          <span className="code-font">{Math.round(securityValue)} events</span>
                        </div>
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

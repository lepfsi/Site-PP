"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Mail, Users, FileText, RefreshCw, Terminal as TerminalIcon, Activity, ShieldAlert } from "lucide-react";
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

export default function Hero() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [networkValue, setNetworkValue] = useState(847);
  const [securityValue, setSecurityValue] = useState(12);
  const [dashboardMode, setDashboardMode] = useState<"mesh" | "terminal">("mesh");
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  
  const logIndexRef = useRef(0);

  // 1. Initial mount check to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Dashboard mode toggle (5s)
  useEffect(() => {
    if (!mounted) return;
    const modeInterval = setInterval(() => {
      setDashboardMode(prev => (prev === "mesh" ? "terminal" : "mesh"));
    }, 5000);
    return () => clearInterval(modeInterval);
  }, [mounted]);

  // 3. Metrics updates (2s)
  useEffect(() => {
    if (!mounted) return;
    const metricsInterval = setInterval(() => {
      setNetworkValue(prev => {
        const next = prev + (Math.random() * 30 - 15);
        return Math.max(820, Math.min(980, next));
      });
      setSecurityValue(prev => {
        const next = prev + (Math.random() * 2 - 1);
        return Math.max(10, Math.min(22, next));
      });
    }, 2000);
    return () => clearInterval(metricsInterval);
  }, [mounted]);

  // 4. Log streaming (800ms) - Solid implementation
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
        // Keep only last 6 lines
        const newList = [...prev, nextLog];
        return newList.length > 6 ? newList.slice(1) : newList;
      });
    }, 800);

    return () => clearInterval(logInterval);
  }, [mounted, dashboardMode]);

  // Guard: Don't render until client-side hydration is complete
  if (!mounted) {
    return (
      <section className="relative pt-32 pb-12 min-h-[70vh] bg-bg-primary noc-grid">
        <div className="container-custom">
          <div className="h-96 w-full animate-pulse bg-bg-secondary/50 rounded-[2rem]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-32 pb-8 lg:pb-12 min-h-[70vh] lg:min-h-[85vh] flex items-start lg:items-center overflow-hidden noc-grid">
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-turquoise/10 border border-turquoise/20 rounded-full mb-8"
            >
              <span className="h-2 w-2 rounded-full bg-turquoise animate-pulse"></span>
              <span className="text-turquoise code-font text-[10px] font-black uppercase tracking-widest">v2.0 // Production Ready</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-turquoise font-mono text-sm mb-4"
            >
              {t("hero.tagline")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-6 code-font max-w-xl"
            >
              <span className="text-text-primary block">{t("hero.title_part1")}</span>
              <span className="relative inline-block mt-2">
                <span className="relative z-10 text-turquoise italic">{t("hero.title_part2")}</span>
                <span className="absolute inset-0 bg-turquoise/20 blur-[60px] rounded-full scale-125 animate-pulse"></span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base text-text-secondary/80 max-w-lg mb-8 font-mono leading-relaxed"
            >
              {t("hero.desc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <a href="#categories" className="px-6 py-3.5 bg-text-primary text-bg-primary font-black rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg text-xs tracking-widest uppercase">
                {t("hero.cta_explore")} <ChevronRight size={14} className="ml-2" />
              </a>
              <a href="#newsletter" className="px-6 py-3.5 bg-bg-secondary border border-border-main text-text-primary font-bold rounded-xl flex items-center justify-center transition-all hover:bg-turquoise/5 hover:border-turquoise text-xs tracking-widest uppercase">
                <Mail size={14} className="mr-2" /> {t("hero.cta_news")}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/40"
            >
              <div className="flex items-center"><Users size={14} className="mr-2" /> {t("hero.stat_engineers")}</div>
              <div className="flex items-center"><FileText size={14} className="mr-2" /> {t("hero.stat_articles")}</div>
              <div className="flex items-center"><RefreshCw size={14} className="mr-2" /> {t("hero.stat_updated")}</div>
            </motion.div>
          </div>

          {/* RIGHT CONTENT - HYBRID DASHBOARD */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square max-w-[400px] ml-auto"
            >
              <div className="absolute inset-0 bg-bg-secondary/40 border border-white/5 backdrop-blur-3xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col">
                
                {/* MAC TITLE BAR */}
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

                {/* ANIMATION AREA */}
                <div className="flex-grow relative overflow-hidden bg-navy/10">
                  <AnimatePresence mode="wait">
                    {dashboardMode === "mesh" ? (
                      <motion.div
                        key="mesh-mode"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 p-6 flex items-center justify-center"
                      >
                        <svg className="w-full h-full text-turquoise/20" viewBox="0 0 100 100">
                          {/* Static lines for connection background */}
                          <line x1="20" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" />
                          <line x1="50" y1="80" x2="85" y2="30" stroke="currentColor" strokeWidth="0.5" />
                          <line x1="20" y1="20" x2="85" y2="30" stroke="currentColor" strokeWidth="0.5" />
                          
                          {/* Animated Path (The Thread) */}
                          <motion.path
                            d="M 20 20 L 50 80 L 85 30 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeDasharray="200"
                            className="text-turquoise"
                            animate={{ strokeDashoffset: [200, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          />
                          
                          {/* Data Packets (Threads) */}
                          <motion.circle r="1.5" className="fill-turquoise shadow-lg shadow-turquoise">
                            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 20 20 L 50 80 L 85 30 Z" />
                          </motion.circle>
                          <motion.circle r="1.5" className="fill-turquoise opacity-50">
                            <animateMotion dur="2.5s" begin="1.25s" repeatCount="indefinite" path="M 20 20 L 50 80 L 85 30 Z" />
                          </motion.circle>

                          {/* Nodes */}
                          <circle cx="20" cy="20" r="2" className="fill-turquoise" />
                          <circle cx="50" cy="80" r="2" className="fill-turquoise" />
                          <circle cx="85" cy="30" r="2" className="fill-turquoise" />
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="terminal-mode"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute inset-0 p-6 font-mono text-[10px]"
                      >
                        <div className="space-y-2">
                          {visibleLogs.map((log, idx) => (
                            <div key={`${log}-${idx}`} className={log.includes("FW_BLOCK") ? "text-pink-500" : "text-turquoise/90"}>
                              <span className="opacity-30 mr-2">{">"}</span> {log}
                            </div>
                          ))}
                        </div>
                        <motion.div
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-4 bg-turquoise mt-2"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* BOTTOM METRICS SECTION */}
                <div className="bg-navy/80 border-t border-white/5 p-6 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-turquoise/20 rounded-lg text-turquoise">
                        <Activity size={14} />
                      </div>
                      <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">{t("hero.monitor_live")}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                      <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">LIVE_OPS</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Throughput Metric */}
                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-text-secondary/60 mb-1.5 uppercase tracking-widest">
                        <span>{t("hero.monitor_network")}</span>
                        <span className="text-turquoise code-font">{Math.round(networkValue)} Mbps</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${(networkValue / 1000) * 100}%` }}
                          className="h-full bg-gradient-to-r from-turquoise/40 to-turquoise rounded-full"
                        />
                      </div>
                    </div>

                    {/* Security Metric (RESTORED) */}
                    <div>
                      <div className="flex justify-between text-[9px] font-bold text-text-secondary/60 mb-1.5 uppercase tracking-widest">
                        <span>{t("hero.monitor_security")}</span>
                        <div className="flex items-center text-pink-500">
                          <ShieldAlert size={10} className="mr-1.5" />
                          <span className="code-font">{Math.round(securityValue)}/min</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${(securityValue / 25) * 100}%` }}
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

"use client";

import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronRight, Mail, FileText, Layers, Calendar, Activity, ShieldAlert } from "lucide-react";
import { useLanguage, type Language } from "@/lib/LanguageContext";
import { useState, useEffect, useRef, useMemo } from "react";
import ArticleVisual from "@/components/article-visuals/ArticleVisual";
import { getAllArticles, getFeaturedArticle } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import type { Article } from "@/lib/articles";

const LOG_LINES = [
  "[14:22:01] BGP_SESSION: Peer 10.0.4.1 Established",
  "[14:22:05] FW_BLOCK: Denied inbound from 185.x.x.x",
  "[14:22:12] K8S_NODE: node-04 scaling up...",
  "[14:22:15] MONITOR: Latency spikes detected on AS64496",
  "[14:22:20] SSH_LOGIN: Accepted key for user 'ops'",
  "[14:22:24] BGP_PREFIX: 172.16.0.0/24 advertised",
  "[14:22:28] SSL_CERT: Expiring in 12 days (renewing...)",
  "[14:22:32] OPS: Baseline applied to CORE-SW-01",
];

const MODE_TOGGLE_MS = 6000;

function formatHeroDate(date: string, lang: Language): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString(lang === "FR" ? "fr-FR" : "en-US", {
    month: "short",
    year: "numeric",
  });
}

function useHeroStats() {
  return useMemo(() => {
    const articles = getAllArticles();
    const articleCount = articles.length;
    const domainCount = CATEGORIES.length;
    const lastUpdated = articles.reduce(
      (latest, article) => (article.date > latest ? article.date : latest),
      articles[0]?.date ?? "",
    );
    return { articleCount, domainCount, lastUpdated, featured: getFeaturedArticle() };
  }, []);
}

function HeroDashboard({
  dashboardMode,
  visibleLogs,
  featured,
  articleCount,
  domainCount,
  t,
}: {
  dashboardMode: "featured" | "terminal";
  visibleLogs: string[];
  featured: Article;
  articleCount: number;
  domainCount: number;
  t: (key: string) => string;
}) {
  return (
    <Link
      href={`/articles/${featured.slug}`}
      className="group block relative aspect-square max-w-[360px] ml-auto w-full transition-transform hover:scale-[1.02] active:scale-[0.99]"
    >
      <div className="bg-bg-secondary/80 border border-border-main group-hover:border-turquoise/40 border-b-0 px-4 py-3 rounded-t-[1.5rem] flex items-center justify-between backdrop-blur-md transition-colors">
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="text-[9px] font-mono text-text-secondary/50 uppercase tracking-widest font-bold">
          {dashboardMode === "featured" ? t("hero.monitor_featured") : t("hero.monitor_terminal")}
        </div>
        <ChevronRight size={12} className="text-turquoise/50 group-hover:text-turquoise group-hover:translate-x-0.5 transition-all" />
      </div>

      <div className="relative z-10 bg-bg-secondary/60 border border-border-main group-hover:border-turquoise/30 border-t-0 backdrop-blur-3xl rounded-b-[1.5rem] shadow-2xl group-hover:shadow-turquoise/10 overflow-hidden flex flex-col h-[calc(100%-40px)] transition-all">
        <div className="flex-grow relative overflow-hidden bg-bg-primary/30 min-h-[180px]">
          <AnimatePresence mode="wait">
            {dashboardMode === "featured" ? (
              <motion.div
                key="featured-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <ArticleVisual slug={featured.slug} category={featured.category} variant="article" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/95 via-bg-primary/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pointer-events-none">
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-white/5 ${featured.bg} ${featured.color} mb-1.5`}>
                    {t(featured.categoryLabelKey)}
                  </span>
                  <p className="text-[11px] sm:text-xs font-bold text-text-primary leading-snug line-clamp-2 mb-1.5">
                    {t(featured.titleKey)}
                  </p>
                  <span className="inline-flex items-center text-[8px] font-black uppercase tracking-widest text-turquoise group-hover:underline">
                    {t("hero.dashboard_cta")} <ChevronRight size={10} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="terminal-mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0 p-6 font-mono text-[9px]"
              >
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

        <div className="bg-bg-secondary/90 border-t border-border-main p-4 md:p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-turquoise/20 rounded-lg text-turquoise">
                <Activity size={12} />
              </div>
              <span className="text-[8px] font-black text-text-primary uppercase tracking-[0.2em]">{t("hero.monitor_live")}</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">{t("hero.monitor_live_badge")}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[8px] font-bold text-text-secondary/60 mb-1 uppercase tracking-widest">
                <span>{t("hero.monitor_guides")}</span>
                <span className="text-turquoise code-font">{articleCount}/{articleCount}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-turquoise/40 to-turquoise rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[8px] font-bold text-text-secondary/60 mb-1 uppercase tracking-widest">
                <span>{t("hero.monitor_domains")}</span>
                <div className="flex items-center text-pink-500">
                  <ShieldAlert size={10} className="mr-1.5" />
                  <span className="code-font">{domainCount}/{domainCount}</span>
                </div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-pink-500/40 to-pink-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HeroStatCard({
  icon: Icon,
  label,
}: {
  icon: typeof FileText;
  label: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-bg-secondary/60 border border-border-main text-center">
      <Icon size={14} className="mx-auto mb-1.5 text-turquoise" />
      <div className="text-[8px] font-black text-text-primary uppercase tracking-wider leading-tight">{label}</div>
    </div>
  );
}

export default function Hero() {
  const { t, lang } = useLanguage();
  const { articleCount, domainCount, lastUpdated, featured } = useHeroStats();
  const [mounted, setMounted] = useState(false);
  const [dashboardMode, setDashboardMode] = useState<"featured" | "terminal">("featured");
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  const logIndexRef = useRef(0);

  const statGuides = t("hero.stat_guides").replace("{count}", String(articleCount));
  const statDomains = t("hero.stat_domains").replace("{count}", String(domainCount));
  const statUpdated = t("hero.stat_updated").replace("{date}", formatHeroDate(lastUpdated, lang));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const modeInterval = setInterval(() => {
      setDashboardMode((prev) => (prev === "featured" ? "terminal" : "featured"));
    }, MODE_TOGGLE_MS);
    return () => clearInterval(modeInterval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || dashboardMode !== "terminal") {
      setVisibleLogs([]);
      logIndexRef.current = 0;
      return;
    }
    const logInterval = setInterval(() => {
      setVisibleLogs((prev) => {
        const nextLog = LOG_LINES[logIndexRef.current % LOG_LINES.length];
        logIndexRef.current++;
        const newList = [...prev, nextLog];
        return newList.length > 7 ? newList.slice(1) : newList;
      });
    }, 800);
    return () => clearInterval(logInterval);
  }, [mounted, dashboardMode]);

  if (!mounted) return <section className="min-h-[70vh]" />;

  const staggeredContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const staggeredItem: Variants = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { duration: 0.45 } },
  };

  const dashboardProps = {
    dashboardMode,
    visibleLogs,
    featured,
    articleCount,
    domainCount,
    t,
  };

  return (
    <section className="relative pt-28 pb-4 md:pt-32 md:pb-6 min-h-[60vh] lg:min-h-[75vh] flex items-center overflow-hidden noc-grid">
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-7 flex flex-col justify-center gap-5 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full w-fit"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500 code-font text-[9px] font-black uppercase tracking-widest">{t("hero.badge")}</span>
            </motion.div>

            <div className="space-y-3 md:space-y-3.5">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-text-primary code-font leading-[1.05]"
              >
                {t("hero.title_main")}
              </motion.h1>

              <motion.div
                variants={staggeredContainer}
                initial="hidden"
                animate="show"
                className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-lg sm:text-xl md:text-2xl lg:text-[1.65rem] font-black code-font text-text-primary"
              >
                <motion.span variants={staggeredItem}>{t("hero.sub_operate")}</motion.span>
                <motion.span variants={staggeredItem} className="text-turquoise italic">{t("hero.sub_optimize")}</motion.span>
                <motion.span variants={staggeredItem}>{t("hero.sub_secure")}</motion.span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xs md:text-sm text-text-secondary/80 max-w-xl font-medium leading-relaxed"
            >
              {t("hero.desc")}
            </motion.p>

            <div className="flex flex-wrap gap-2.5 md:gap-3">
              <a href="#categories" className="px-5 py-2.5 bg-text-primary text-bg-primary font-black rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl text-[10px] tracking-widest uppercase border border-transparent">
                {t("hero.cta_explore")}
              </a>
              <a href="#articles" className="px-5 py-2.5 bg-bg-secondary border-2 border-turquoise text-turquoise font-black rounded-xl flex items-center justify-center transition-all hover:bg-turquoise/10 text-[10px] tracking-widest uppercase shadow-lg shadow-turquoise/5">
                {t("hero.cta_browse")}
              </a>
              <a href="#newsletter" className="px-5 py-2.5 bg-bg-secondary border border-border-main text-text-secondary hover:text-turquoise hover:border-turquoise font-bold rounded-xl flex items-center justify-center transition-all text-[10px] tracking-widest uppercase group">
                <Mail size={12} className="mr-2 group-hover:scale-110" />
                {t("hero.cta_news")}
              </a>
            </div>

            <div className="lg:hidden grid grid-cols-3 gap-3 pt-1">
              <HeroStatCard icon={FileText} label={statGuides} />
              <HeroStatCard icon={Layers} label={statDomains} />
              <HeroStatCard icon={Calendar} label={statUpdated} />
            </div>
          </div>

          <div className="lg:col-span-5 relative lg:hidden mt-2">
            <HeroDashboard {...dashboardProps} />
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-14 -left-36 z-0 opacity-20 pointer-events-none bg-bg-secondary/20 p-5 rounded-2xl border border-turquoise/20 backdrop-blur-sm shadow-2xl"
            >
              <div className="space-y-4 font-mono text-[9px] text-turquoise uppercase tracking-[0.2em]">
                <div className="flex items-center space-x-2"><FileText size={12} /> <span>{statGuides}</span></div>
                <div className="flex items-center space-x-2"><Layers size={12} /> <span>{statDomains}</span></div>
                <div className="flex items-center space-x-2"><Calendar size={12} /> <span>{statUpdated}</span></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <HeroDashboard {...dashboardProps} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
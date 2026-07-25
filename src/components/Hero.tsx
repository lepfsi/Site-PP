"use client";

import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronRight, FileText, Layers, Calendar, Activity, ShieldAlert } from "lucide-react";
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
      className="group block relative aspect-square max-w-[360px] ml-auto w-full transition-opacity"
    >
      <div className="bg-bg-elevated border border-border-main group-hover:border-turquoise/35 border-b-0 px-4 py-3 rounded-t-2xl flex items-center justify-between transition-colors">
        <div className="flex space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-border-main" />
          <div className="w-2 h-2 rounded-full bg-border-main" />
          <div className="w-2 h-2 rounded-full bg-border-main" />
        </div>
        <div className="text-[10px] text-text-secondary/70 font-medium tracking-wide">
          {dashboardMode === "featured" ? t("hero.monitor_featured") : t("hero.monitor_terminal")}
        </div>
        <ChevronRight size={14} className="text-text-secondary/40 group-hover:text-turquoise transition-colors" />
      </div>

      <div className="relative z-10 bg-bg-elevated border border-border-main group-hover:border-turquoise/25 border-t-0 rounded-b-2xl shadow-[var(--surface-shadow)] overflow-hidden flex flex-col h-[calc(100%-40px)] transition-colors">
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
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border border-border-main/30 ${featured.bg} ${featured.color} mb-1.5`}>
                    {t(featured.categoryLabelKey)}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-text-primary leading-snug line-clamp-2 mb-1.5">
                    {t(featured.titleKey)}
                  </p>
                  <span className="inline-flex items-center text-[11px] font-semibold text-turquoise">
                    {t("hero.dashboard_cta")} <ChevronRight size={12} className="ml-0.5" />
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

        <div className="bg-bg-secondary/80 border-t border-border-main p-4 md:p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-turquoise/15 rounded-md text-turquoise">
                <Activity size={12} />
              </div>
              <span className="text-[11px] font-semibold text-text-primary tracking-wide">{t("hero.monitor_live")}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-turquoise/10 px-2 py-1 rounded-md border border-turquoise/20">
              <span className="h-1.5 w-1.5 rounded-full bg-turquoise" />
              <span className="text-[10px] font-semibold text-turquoise tracking-wide">{t("hero.monitor_live_badge")}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] font-medium text-text-secondary mb-1">
                <span>{t("hero.monitor_guides")}</span>
                <span className="text-turquoise tabular-nums">{articleCount}</span>
              </div>
              <div className="h-1 w-full bg-border-main/40 rounded-full overflow-hidden">
                <div className="h-full w-full bg-turquoise/80 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium text-text-secondary mb-1">
                <span>{t("hero.monitor_domains")}</span>
                <span className="text-text-primary tabular-nums flex items-center gap-1">
                  <ShieldAlert size={11} className="text-turquoise" />
                  {domainCount}
                </span>
              </div>
              <div className="h-1 w-full bg-border-main/40 rounded-full overflow-hidden">
                <div className="h-full w-full bg-turquoise/50 rounded-full" />
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
    <div className="p-3 rounded-xl surface-card text-center">
      <Icon size={14} className="mx-auto mb-1.5 text-turquoise" />
      <div className="text-[10px] font-semibold text-text-primary leading-tight">{label}</div>
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
    <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 min-h-[72vh] lg:min-h-[90vh] flex items-center overflow-hidden border-b border-border-main/60">
      <div className="absolute inset-0 noc-grid hero-grid pointer-events-none" aria-hidden />
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center gap-6 md:gap-7">
            <div className="space-y-4 md:space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight text-text-primary leading-[1.12]"
              >
                {t("hero.title_main")}
              </motion.h1>

              <motion.div
                variants={staggeredContainer}
                initial="hidden"
                animate="show"
                className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-base sm:text-lg md:text-xl font-medium text-text-primary"
              >
                <motion.span variants={staggeredItem}>
                  {t("hero.sub_operate")}
                  <span className="text-turquoise">.</span>
                </motion.span>
                <motion.span variants={staggeredItem}>
                  {t("hero.sub_optimize")}
                  <span className="text-turquoise">.</span>
                </motion.span>
                <motion.span variants={staggeredItem}>
                  {t("hero.sub_secure")}
                  <span className="text-turquoise">.</span>
                </motion.span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-[15px] text-text-secondary max-w-xl font-normal leading-relaxed"
            >
              {t("hero.desc")}
            </motion.p>

            <div className="lg:hidden grid grid-cols-3 gap-3 pt-2">
              <HeroStatCard icon={FileText} label={statGuides} />
              <HeroStatCard icon={Layers} label={statDomains} />
              <HeroStatCard icon={Calendar} label={statUpdated} />
            </div>
          </div>

          <div className="lg:col-span-5 relative lg:hidden mt-2">
            <HeroDashboard {...dashboardProps} />
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="absolute -top-10 -left-28 z-0 opacity-30 pointer-events-none bg-bg-elevated/80 p-4 rounded-xl border border-border-main">
              <div className="space-y-2.5 text-[11px] text-text-secondary font-medium">
                <div className="flex items-center gap-2"><FileText size={12} className="text-turquoise" /> <span>{statGuides}</span></div>
                <div className="flex items-center gap-2"><Layers size={12} className="text-turquoise" /> <span>{statDomains}</span></div>
                <div className="flex items-center gap-2"><Calendar size={12} className="text-turquoise" /> <span>{statUpdated}</span></div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
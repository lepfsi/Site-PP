"use client";

import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronRight, FileText, Layers, Calendar, Activity, ArrowRight } from "lucide-react";
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

/** Classic ops terminal palette: green default, red blocks, amber warnings. */
function terminalLineClass(log: string): string {
  if (log.includes("FW_BLOCK")) return "text-rose-400";
  if (log.includes("MONITOR") || log.includes("SSL_CERT")) return "text-amber-300/90";
  return "text-turquoise";
}

const MODE_TOGGLE_MS = 7000;

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

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-sm" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-sm" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-sm" />
    </div>
  );
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
      className="group block relative w-full max-w-[340px] ml-auto aspect-[4/5] sm:aspect-[5/5.2]"
    >
      {/* Soft glow behind card */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-turquoise/10 blur-2xl dark:bg-turquoise/15"
        aria-hidden
      />

      <div className="relative h-full flex flex-col rounded-2xl border border-border-main bg-bg-elevated shadow-[var(--surface-shadow)] overflow-hidden transition-colors group-hover:border-turquoise/35">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-main bg-bg-secondary/80">
          <WindowDots />
          <span className="text-[10px] font-medium text-text-secondary/80 tracking-wide">
            {dashboardMode === "featured" ? t("hero.monitor_featured") : t("hero.monitor_terminal")}
          </span>
          <ChevronRight
            size={14}
            className="text-text-secondary/40 group-hover:text-turquoise transition-colors"
          />
        </div>

        <div className="relative flex-grow min-h-0 overflow-hidden bg-navy/5 dark:bg-black/20">
          <AnimatePresence mode="wait">
            {dashboardMode === "featured" ? (
              <motion.div
                key="featured-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Visual stays in the upper band only — never under the title */}
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  <div className="absolute inset-0 scale-[0.92] origin-center">
                    <ArticleVisual slug={featured.slug} category={featured.category} variant="card" />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-bg-elevated to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="relative z-10 shrink-0 border-t border-border-main/50 bg-bg-elevated px-4 py-3 sm:px-5 sm:py-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border border-border-main/30 ${featured.bg} ${featured.color} mb-1.5`}
                  >
                    {t(featured.categoryLabelKey)}
                  </span>
                  <p className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 mb-1.5">
                    {t(featured.titleKey)}
                  </p>
                  <span className="inline-flex items-center text-[12px] font-semibold text-turquoise">
                    {t("hero.dashboard_cta")}
                    <ChevronRight size={13} className="ml-0.5" />
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="terminal-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 p-4 sm:p-5 font-mono text-[10px] bg-[#0c1222] text-slate-300"
              >
                <div className="space-y-1.5">
                  {visibleLogs.map((log, idx) => (
                    <div key={`${log}-${idx}`} className={terminalLineClass(log)}>
                      <span className="text-slate-500 mr-1.5">{">"}</span>
                      {log}
                    </div>
                  ))}
                </div>
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.55, repeat: Infinity }}
                  className="mt-2 h-3.5 w-1.5 bg-turquoise"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-border-main bg-bg-secondary/90 px-3.5 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity size={12} className="text-turquoise" />
              <span className="text-[10px] font-semibold text-text-primary">
                {t("hero.monitor_live")}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-turquoise/10 border border-turquoise/20 px-1.5 py-0.5 text-[9px] font-semibold text-turquoise">
              <span className="h-1.5 w-1.5 rounded-full bg-turquoise animate-pulse" />
              {t("hero.monitor_live_badge")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <div className="text-text-secondary mb-0.5">{t("hero.monitor_guides")}</div>
              <div className="font-semibold text-text-primary tabular-nums">{articleCount}</div>
            </div>
            <div>
              <div className="text-text-secondary mb-0.5">{t("hero.monitor_domains")}</div>
              <div className="font-semibold text-text-primary tabular-nums">{domainCount}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FloatingStats({
  guides,
  domains,
  updated,
}: {
  guides: string;
  domains: string;
  updated: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute -left-16 top-12 z-0 hidden xl:block"
      aria-hidden
    >
      <div className="w-[148px] rounded-xl border border-border-main/25 bg-bg-elevated/35 p-3 shadow-none backdrop-blur-[2px] opacity-45">
        <div className="space-y-2 text-[11px] font-medium text-text-secondary/80">
          <div className="flex items-center gap-2">
            <FileText size={12} className="text-turquoise/70 shrink-0" />
            <span className="leading-snug">{guides}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={12} className="text-turquoise/70 shrink-0" />
            <span className="leading-snug">{domains}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-turquoise/70 shrink-0" />
            <span className="leading-snug">{updated}</span>
          </div>
        </div>
      </div>
    </motion.div>
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
  const statUpdated = t("hero.stat_updated").replace(
    "{date}",
    formatHeroDate(lastUpdated, lang),
  );

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

  if (!mounted) {
    return <section className="min-h-[80vh] bg-bg-primary" aria-hidden />;
  }

  const staggeredContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const staggeredItem: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
    <section className="relative flex min-h-[80vh] lg:min-h-[92vh] items-center overflow-hidden border-b border-border-main/50 pt-28 pb-16 md:pt-32 md:pb-24">
      {/* Layered brand background */}
      <div className="absolute inset-0 bg-bg-primary" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 20%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%), radial-gradient(ellipse 50% 45% at 88% 70%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 65%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 noc-grid hero-grid opacity-[0.35] dark:opacity-100" aria-hidden />

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl"
            >
              <h1 className="text-[clamp(1.4rem,4.6vw+0.4rem,3.15rem)] font-semibold tracking-tight text-text-primary leading-[1.15] sm:whitespace-nowrap">
                {t("hero.title_main")}
              </h1>

              <motion.div
                variants={staggeredContainer}
                initial="hidden"
                animate="show"
                className="mt-3 sm:mt-4 flex flex-wrap items-baseline gap-x-1 gap-y-1 text-base sm:text-lg md:text-xl font-medium text-text-primary"
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

              <p className="mt-4 sm:mt-5 max-w-lg text-[14px] sm:text-[15px] text-text-secondary leading-relaxed">
                {t("hero.desc")}
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 dark:bg-turquoise dark:text-navy"
                >
                  {t("hero.cta_browse")}
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border-main bg-bg-elevated/80 px-5 py-2.5 text-[13px] font-semibold text-text-primary transition-colors hover:border-turquoise/40 hover:text-turquoise"
                >
                  {t("nav.products")}
                </Link>
              </div>

              {/* Mobile stats */}
              <div className="mt-8 grid grid-cols-3 gap-2.5 lg:hidden">
                {[
                  { icon: FileText, label: statGuides },
                  { icon: Layers, label: statDomains },
                  { icon: Calendar, label: statUpdated },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border-main bg-bg-elevated/90 px-2 py-3 text-center"
                  >
                    <Icon size={14} className="mx-auto mb-1.5 text-turquoise" />
                    <div className="text-[10px] font-medium text-text-secondary leading-tight">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="relative lg:col-span-6 xl:col-span-5">
            {/* Stats behind terminal */}
            <FloatingStats guides={statGuides} domains={statDomains} updated={statUpdated} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
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

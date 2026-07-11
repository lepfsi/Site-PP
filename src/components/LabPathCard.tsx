"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Layers, Play } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useLabProgress } from "@/hooks/useLabProgress";
import type { LabPath } from "@/lib/labs";
import { getCategoryBySlug } from "@/lib/categories";
import LabProgressBar from "@/components/LabProgressBar";

interface LabPathCardProps {
  path: LabPath;
  variant?: "grid" | "home";
}

export default function LabPathCard({ path, variant = "grid" }: LabPathCardProps) {
  const { t } = useLanguage();
  const { hydrated, getStats } = useLabProgress();
  const stats = hydrated ? getStats(path.slug, path.steps.length) : null;
  const category = getCategoryBySlug(path.category);
  const Icon = path.icon;

  const ctaLabel = stats?.isComplete
    ? t("labs.page.review")
    : stats?.hasStarted
      ? t("labs.page.resume")
      : t("labs.page.start");

  if (variant === "home") {
    return (
      <Link
        href={`/labs/${path.slug}`}
        className={`group flex flex-col h-full p-6 sm:p-7 rounded-2xl border border-border-main bg-bg-primary transition-all hover:border-turquoise/40 hover:shadow-lg hover:shadow-turquoise/5 ${
          path.featured ? "ring-1 ring-turquoise/20" : ""
        }`}
      >
        {path.featured && !stats?.isComplete && (
          <span className="self-start mb-3 px-2 py-0.5 rounded-md bg-turquoise/10 border border-turquoise/30 text-turquoise text-[8px] font-black uppercase tracking-widest">
            {t("labs.page.featured")}
          </span>
        )}
        {stats?.isComplete && (
          <span className="self-start mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30 text-green-500 text-[8px] font-black uppercase tracking-widest">
            <CheckCircle2 size={10} />
            {t("labs.progress.complete_badge")}
          </span>
        )}
        <div className={`w-10 h-10 rounded-xl ${path.bg} border border-border-main/60 flex items-center justify-center mb-4`}>
          <Icon size={20} className={path.color} />
        </div>
        <h3 className="text-base font-bold text-text-primary mb-2 group-hover:text-turquoise transition-colors leading-snug">
          {t(path.titleKey)}
        </h3>
        <p className="text-[11px] text-text-secondary font-medium leading-relaxed mb-4 flex-grow">
          {t(path.descKey)}
        </p>
        {stats && <div className="mb-4"><LabProgressBar stats={stats} size="sm" /></div>}
        <div className="flex items-center gap-3 text-[9px] font-mono text-text-secondary/60 uppercase font-bold tracking-widest pt-4 border-t border-border-main/60">
          <span className="flex items-center">
            <Layers size={10} className="mr-1 text-turquoise" />
            {path.steps.length}
          </span>
          <span className="flex items-center">
            <Clock size={10} className="mr-1 text-turquoise" />
            {t(path.durationKey)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={`relative flex flex-col rounded-2xl border border-border-main bg-bg-secondary p-6 sm:p-8 transition-all hover:border-turquoise/40 hover:shadow-lg hover:shadow-turquoise/5 ${
        path.featured ? "ring-1 ring-turquoise/25" : ""
      }`}
    >
      {path.featured && !stats?.isComplete && (
        <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-turquoise/10 border border-turquoise/30 text-turquoise text-[8px] font-black uppercase tracking-widest">
          {t("labs.page.featured")}
        </span>
      )}
      {stats?.isComplete && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-[8px] font-black uppercase tracking-widest">
          <CheckCircle2 size={10} />
          {t("labs.progress.complete_badge")}
        </span>
      )}

      <div className={`w-12 h-12 rounded-xl ${path.bg} border border-border-main/60 flex items-center justify-center mb-5`}>
        <Icon size={22} className={path.color} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-[9px] font-bold uppercase tracking-wider ${path.color}`}>
          {category ? t(category.nameKey) : ""}
        </span>
        <span className="text-text-secondary/40">·</span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary/60">
          {t(path.levelKey)}
        </span>
      </div>

      <h2 className="text-xl font-black text-text-primary mb-3 leading-snug">{t(path.titleKey)}</h2>
      <p className="text-text-secondary text-sm font-medium leading-relaxed mb-4 flex-grow">{t(path.descKey)}</p>

      {stats && <div className="mb-5"><LabProgressBar stats={stats} /></div>}

      <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-text-secondary/70 uppercase font-bold tracking-widest mb-6 pt-5 border-t border-border-main/60">
        <span className="flex items-center">
          <Layers size={12} className="mr-1.5 text-turquoise" />
          {path.steps.length} {t("labs.page.steps")}
        </span>
        <span className="flex items-center">
          <Clock size={12} className="mr-1.5 text-turquoise" />
          {t(path.durationKey)}
        </span>
      </div>

      <Link
        href={`/labs/${path.slug}`}
        className={`inline-flex items-center justify-center px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group ${
          stats?.isComplete
            ? "bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/15"
            : "bg-turquoise text-navy hover:bg-turquoise-dark"
        }`}
      >
        <Play size={12} className="mr-2" />
        {ctaLabel}
        <ArrowRight size={12} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </article>
  );
}
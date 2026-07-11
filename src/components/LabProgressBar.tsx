"use client";

import { useLanguage } from "@/lib/LanguageContext";
import type { LabProgressStats } from "@/lib/lab-progress";

interface LabProgressBarProps {
  stats: LabProgressStats;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export default function LabProgressBar({ stats, size = "md", showLabel = true }: LabProgressBarProps) {
  const { t } = useLanguage();

  if (!stats.hasStarted) return null;

  const barHeight = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary/70">
            {stats.isComplete ? t("labs.progress.complete_badge") : t("labs.progress.label")}
          </span>
          <span className="text-[9px] font-mono font-bold text-turquoise">
            {stats.completed}/{stats.total}
          </span>
        </div>
      )}
      <div className={`w-full ${barHeight} rounded-full bg-border-main/60 overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            stats.isComplete ? "bg-green-500" : "bg-turquoise"
          }`}
          style={{ width: `${stats.percent}%` }}
          role="progressbar"
          aria-valuenow={stats.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${stats.percent}%`}
        />
      </div>
    </div>
  );
}
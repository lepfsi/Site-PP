"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ListOrdered } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import {
  buildLabArticleHref,
  buildLabPathStepHref,
  getLabStepNavigation,
} from "@/lib/labs";

interface LabArticleNavProps {
  pathSlug: string;
  stepId: string;
  variant?: "inline" | "sticky";
}

export default function LabArticleNav({ pathSlug, stepId, variant = "inline" }: LabArticleNavProps) {
  const { t } = useLanguage();
  const nav = getLabStepNavigation(pathSlug, stepId);

  if (!nav) return null;

  const { path, stepIndex, nextStep } = nav;
  const pathHref = buildLabPathStepHref(path.slug, nav.step.id);

  const nextHref = nextStep
    ? nextStep.articleSlug
      ? buildLabArticleHref(path.slug, nextStep.id, nextStep.articleSlug)
      : buildLabPathStepHref(path.slug, nextStep.id)
    : null;

  const wrapperClass =
    variant === "sticky"
      ? "fixed bottom-0 inset-x-0 z-[90] border-t border-border-main bg-bg-secondary/95 backdrop-blur-xl px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
      : "mt-12 pt-8 border-t border-border-main";

  const innerClass =
    variant === "sticky"
      ? "container-custom max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between"
      : "flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between";

  return (
    <div className={wrapperClass}>
      <div className={innerClass}>
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest text-turquoise mb-1">
            {t("article.lab_badge")} · {t("article.lab_step")} {stepIndex + 1}/{path.steps.length}
          </p>
          <p className="text-sm font-bold text-text-primary truncate">{t(path.titleKey)}</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            href={pathHref}
            className="inline-flex items-center px-4 py-2.5 rounded-xl border border-border-main bg-bg-primary text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-turquoise hover:border-turquoise/40 transition-all"
          >
            <ArrowLeft size={12} className="mr-2" />
            {t("article.lab_back")}
          </Link>
          {nextHref && nextStep ? (
            <Link
              href={nextHref}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-turquoise text-navy text-[10px] font-black uppercase tracking-widest hover:bg-turquoise-dark transition-all"
            >
              {nextStep.articleSlug ? t("article.lab_next_chapter") : t("article.lab_next_step")}
              <ArrowRight size={12} className="ml-2" />
            </Link>
          ) : (
            <Link
              href={buildLabPathStepHref(path.slug, nav.step.id)}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-turquoise text-navy text-[10px] font-black uppercase tracking-widest hover:bg-turquoise-dark transition-all"
            >
              <ListOrdered size={12} className="mr-2" />
              {t("article.lab_finish")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  ListChecks,
  FlaskConical,
  HelpCircle,
  ExternalLink,
  Layers,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LabProgressBar from "@/components/LabProgressBar";
import { useLanguage } from "@/lib/LanguageContext";
import { useLabProgress } from "@/hooks/useLabProgress";
import { getLabPathBySlug, type LabStepType } from "@/lib/labs";
import { getArticleBySlug } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";

const STEP_META: Record<LabStepType, { icon: typeof BookOpen; labelKey: string; color: string }> = {
  read: { icon: BookOpen, labelKey: "labs.step.read", color: "text-blue-500 bg-blue-500/10 border-blue-500/30" },
  checklist: { icon: ListChecks, labelKey: "labs.step.checklist", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" },
  lab: { icon: FlaskConical, labelKey: "labs.step.lab", color: "text-turquoise bg-turquoise/10 border-turquoise/30" },
  quiz: { icon: HelpCircle, labelKey: "labs.step.quiz", color: "text-purple-500 bg-purple-500/10 border-purple-500/30" },
};

export default function LabPathClient() {
  const params = useParams();
  const { t } = useLanguage();
  const slug = params.slug as string;
  const path = getLabPathBySlug(slug);
  const { hydrated, getStats, stepDone, toggleStep, resetPath } = useLabProgress();

  if (!path) {
    return (
      <main className="min-h-screen flex flex-col bg-bg-primary">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-28">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">404</h1>
            <Link href="/labs" className="text-turquoise hover:underline text-sm font-bold uppercase tracking-widest">
              {t("labs.page.back")}
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const category = getCategoryBySlug(path.category);
  const Icon = path.icon;
  const stats = hydrated ? getStats(path.slug, path.steps.length) : { completed: 0, total: path.steps.length, percent: 0, isComplete: false, hasStarted: false };

  const handleReset = () => {
    if (window.confirm(t("labs.progress.reset_confirm"))) {
      resetPath(path.slug);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex-grow pt-28">
        <header className="relative py-10 sm:py-12 border-b border-border-main surface-header overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
          <div className="container-custom relative z-10">
            <nav className="flex flex-wrap items-center mb-5 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-turquoise transition-colors">{t("catpage.breadcrumb")}</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <Link href="/labs" className="hover:text-turquoise transition-colors">{t("labs.page.title")}</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-text-primary truncate max-w-[200px] sm:max-w-none">{t(path.titleKey)}</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${path.bg} border border-border-main/60 mb-4`}>
                <Icon size={22} className={path.color} />
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {category && (
                  <span className={`px-3 py-1 rounded-lg ${path.bg} ${path.color} text-[10px] font-black uppercase tracking-[0.2em] border border-border-main/40`}>
                    {t(category.nameKey)}
                  </span>
                )}
                <span className="text-[10px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                  {t(path.levelKey)}
                </span>
                {stats.isComplete && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-[9px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={11} />
                    {t("labs.progress.complete_badge")}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-4">
                {t(path.titleKey)}
              </h1>
              <p className="text-text-secondary text-base font-medium leading-relaxed mb-6">
                {t(path.descKey)}
              </p>
              <div className="flex flex-wrap gap-4 text-[10px] font-mono text-text-secondary/70 uppercase font-bold tracking-widest mb-5">
                <span className="flex items-center">
                  <Layers size={12} className="mr-1.5 text-turquoise" />
                  {path.steps.length} {t("labs.page.steps")}
                </span>
                <span className="flex items-center">
                  <Clock size={12} className="mr-1.5 text-turquoise" />
                  {t(path.durationKey)}
                </span>
              </div>
              {hydrated && <LabProgressBar stats={stats} />}
            </motion.div>
          </div>
        </header>

        <section className="py-10 sm:py-14 bg-bg-primary">
          <div className="container-custom max-w-3xl">
            <Link
              href="/labs"
              className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-turquoise transition-colors mb-8"
            >
              <ArrowLeft size={12} className="mr-2" />
              {t("labs.page.back")}
            </Link>

            {stats.isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 px-6 py-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-turquoise" />
                  <h2 className="text-base font-black text-text-primary">{t("labs.progress.path_complete_title")}</h2>
                </div>
                <p className="text-sm text-text-secondary font-medium leading-relaxed">
                  {t("labs.progress.path_complete_desc")}
                </p>
              </motion.div>
            )}

            <ol className="space-y-0">
              {path.steps.map((step, index) => {
                const meta = STEP_META[step.type];
                const StepIcon = meta.icon;
                const article = step.articleSlug ? getArticleBySlug(step.articleSlug) : undefined;
                const isLast = index === path.steps.length - 1;
                const done = hydrated && stepDone(path.slug, step.id);
                const prevDone = index === 0 || (hydrated && stepDone(path.slug, path.steps[index - 1].id));
                const bullets = ["checklist", "lab", "quiz"].includes(step.type)
                  ? t(step.descKey).split("\n").filter(Boolean)
                  : [];

                return (
                  <motion.li
                    key={step.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-5 sm:gap-6"
                  >
                    {!isLast && (
                      <div
                        className={`absolute left-[19px] sm:left-[21px] top-12 bottom-0 w-px transition-colors ${
                          done ? "bg-turquoise/50" : "bg-border-main/80"
                        }`}
                        aria-hidden
                      />
                    )}
                    <div
                      className={`relative z-10 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center text-[11px] font-black transition-all ${
                        done
                          ? "bg-green-500/15 border-green-500/50 text-green-500"
                          : prevDone
                            ? "bg-bg-secondary border-turquoise/60 text-turquoise"
                            : "bg-bg-secondary border-turquoise/40 text-turquoise"
                      }`}
                    >
                      {done ? <CheckCircle2 size={18} strokeWidth={2.5} /> : index + 1}
                    </div>
                    <div className="flex-grow pb-10">
                      <div
                        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                          done
                            ? "border-green-500/25 bg-green-500/5"
                            : "border-border-main bg-bg-secondary"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${meta.color}`}>
                            <StepIcon size={11} />
                            {t(meta.labelKey as "labs.step.read")}
                          </span>
                        </div>
                        <h2 className={`text-lg font-bold mb-2 ${done ? "text-text-primary/80" : "text-text-primary"}`}>
                          {t(step.titleKey)}
                        </h2>
                        {step.type === "read" ? (
                          <>
                            <p className="text-text-secondary text-sm font-medium leading-relaxed mb-4">
                              {t(step.descKey)}
                            </p>
                            {article && (
                              <Link
                                href={`/articles/${article.slug}`}
                                className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline mb-4"
                              >
                                {t(article.titleKey)}
                                <ExternalLink size={11} className="ml-1.5" />
                              </Link>
                            )}
                          </>
                        ) : (
                          <ul className="space-y-2 mb-4">
                            {bullets.map((line, i) => (
                              <li key={i} className="flex gap-2 text-sm text-text-secondary font-medium leading-relaxed">
                                <span className="text-turquoise shrink-0 mt-0.5">›</span>
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleStep(path.slug, step.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            done
                              ? "bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/15"
                              : "bg-turquoise/10 border border-turquoise/30 text-turquoise hover:bg-turquoise/20"
                          }`}
                        >
                          {done ? (
                            <>
                              <CheckCircle2 size={13} />
                              {t("labs.progress.mark_undone")}
                            </>
                          ) : (
                            <>
                              <Circle size={13} />
                              {t("labs.progress.mark_done")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>

            {stats.hasStarted && (
              <div className="pt-2 border-t border-border-main/60">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/60 hover:text-red-500 transition-colors"
                >
                  <RotateCcw size={12} />
                  {t("labs.progress.reset")}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
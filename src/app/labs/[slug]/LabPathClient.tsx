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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
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
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-4">
                {t(path.titleKey)}
              </h1>
              <p className="text-text-secondary text-base font-medium leading-relaxed mb-6">
                {t(path.descKey)}
              </p>
              <div className="flex flex-wrap gap-4 text-[10px] font-mono text-text-secondary/70 uppercase font-bold tracking-widest">
                <span className="flex items-center">
                  <Layers size={12} className="mr-1.5 text-turquoise" />
                  {path.steps.length} {t("labs.page.steps")}
                </span>
                <span className="flex items-center">
                  <Clock size={12} className="mr-1.5 text-turquoise" />
                  {t(path.durationKey)}
                </span>
              </div>
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

            <ol className="space-y-0">
              {path.steps.map((step, index) => {
                const meta = STEP_META[step.type];
                const StepIcon = meta.icon;
                const article = step.articleSlug ? getArticleBySlug(step.articleSlug) : undefined;
                const isLast = index === path.steps.length - 1;
                const bullets = ["checklist", "lab", "quiz"].includes(step.type)
                  ? t(step.descKey).split("\n").filter(Boolean)
                  : [];

                return (
                  <motion.li
                    key={step.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-5 sm:gap-6"
                  >
                    {!isLast && (
                      <div className="absolute left-[19px] sm:left-[21px] top-12 bottom-0 w-px bg-border-main/80" aria-hidden />
                    )}
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-bg-secondary border-2 border-turquoise/40 flex items-center justify-center text-[11px] font-black text-turquoise">
                      {index + 1}
                    </div>
                    <div className="flex-grow pb-10">
                      <div className="rounded-2xl border border-border-main bg-bg-secondary p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${meta.color}`}>
                            <StepIcon size={11} />
                            {t(meta.labelKey as "labs.step.read")}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-text-primary mb-2">{t(step.titleKey)}</h2>
                        {step.type === "read" ? (
                          <>
                            <p className="text-text-secondary text-sm font-medium leading-relaxed mb-4">
                              {t(step.descKey)}
                            </p>
                            {article && (
                              <Link
                                href={`/articles/${article.slug}`}
                                className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline"
                              >
                                {t(article.titleKey)}
                                <ExternalLink size={11} className="ml-1.5" />
                              </Link>
                            )}
                          </>
                        ) : (
                          <ul className="space-y-2">
                            {bullets.map((line, i) => (
                              <li key={i} className="flex gap-2 text-sm text-text-secondary font-medium leading-relaxed">
                                <span className="text-turquoise shrink-0 mt-0.5">›</span>
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
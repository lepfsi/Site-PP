"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/articles";
import { useLanguage } from "@/lib/LanguageContext";

interface ArticleContinueProps {
  next: Article;
  titleLabel: string;
  ctaLabel: string;
  resolveTitle: (a: Article) => string;
  resolveCategory: (a: Article) => string;
}

/** Same visual language as sidebar “Need expertise?” — inverted surface, works in light + dark. */
export default function ArticleContinue({
  next,
  titleLabel,
  ctaLabel,
  resolveTitle,
  resolveCategory,
}: ArticleContinueProps) {
  const { lp } = useLanguage();
  return (
    <aside className="mt-12 mb-4 rounded-2xl bg-text-primary text-bg-primary p-5 sm:p-6 not-prose print:hidden relative overflow-hidden shadow-xl">
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-bg-primary/50 mb-2">
          {titleLabel}
        </p>
        <p className="text-[11px] font-bold uppercase tracking-wider text-turquoise mb-1">
          {resolveCategory(next)}
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-bg-primary leading-snug mb-4">
          {resolveTitle(next)}
        </h3>
        <Link
          href={lp(`/articles/${next.slug}`)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-turquoise text-navy text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
        >
          {ctaLabel}
          <ArrowRight size={14} />
        </Link>
      </div>
    </aside>
  );
}

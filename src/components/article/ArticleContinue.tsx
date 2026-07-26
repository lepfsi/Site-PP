"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/articles";

interface ArticleContinueProps {
  next: Article;
  titleLabel: string;
  ctaLabel: string;
  resolveTitle: (a: Article) => string;
  resolveCategory: (a: Article) => string;
}

/** End-of-article “next read” CTA — keeps the reader in the content loop. */
export default function ArticleContinue({
  next,
  titleLabel,
  ctaLabel,
  resolveTitle,
  resolveCategory,
}: ArticleContinueProps) {
  return (
    <aside className="mt-12 mb-4 rounded-2xl border border-teal-200 dark:border-turquoise/20 border-l-4 border-l-teal-600 dark:border-l-turquoise bg-teal-50 dark:bg-turquoise/10 p-5 sm:p-6 not-prose print:hidden shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-800 dark:text-turquoise mb-2">
        {titleLabel}
      </p>
      <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary/50 mb-1">
        {resolveCategory(next)}
      </p>
      <h3 className="text-lg sm:text-xl font-bold text-text-primary leading-snug mb-4">
        {resolveTitle(next)}
      </h3>
      <Link
        href={`/articles/${next.slug}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-turquoise text-navy text-xs font-black uppercase tracking-widest hover:bg-turquoise-dark transition-colors"
      >
        {ctaLabel}
        <ArrowRight size={14} />
      </Link>
    </aside>
  );
}

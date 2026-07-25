"use client";

import { Minus, Plus, BookOpen, ListTree } from "lucide-react";

export type FontScale = "sm" | "md" | "lg";

interface ArticleToolbarProps {
  fontScale: FontScale;
  onFontScale: (s: FontScale) => void;
  readingMode: boolean;
  onReadingMode: (v: boolean) => void;
  onOpenToc?: () => void;
  labels: {
    smaller: string;
    larger: string;
    readingMode: string;
    toc: string;
  };
}

const SCALES: FontScale[] = ["sm", "md", "lg"];

export default function ArticleToolbar({
  fontScale,
  onFontScale,
  readingMode,
  onReadingMode,
  onOpenToc,
  labels,
}: ArticleToolbarProps) {
  const idx = SCALES.indexOf(fontScale);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 print:hidden">
      <div className="inline-flex items-center rounded-xl border border-border-main bg-bg-secondary/60 overflow-hidden">
        <button
          type="button"
          aria-label={labels.smaller}
          disabled={idx <= 0}
          onClick={() => onFontScale(SCALES[Math.max(0, idx - 1)])}
          className="p-2 text-text-secondary hover:text-turquoise disabled:opacity-30 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-text-secondary/60 border-x border-border-main">
          A
        </span>
        <button
          type="button"
          aria-label={labels.larger}
          disabled={idx >= SCALES.length - 1}
          onClick={() => onFontScale(SCALES[Math.min(SCALES.length - 1, idx + 1)])}
          className="p-2 text-text-secondary hover:text-turquoise disabled:opacity-30 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onReadingMode(!readingMode)}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-colors ${
          readingMode
            ? "border-turquoise/50 bg-turquoise/10 text-turquoise"
            : "border-border-main bg-bg-secondary/60 text-text-secondary hover:text-turquoise"
        }`}
      >
        <BookOpen size={14} />
        {labels.readingMode}
      </button>

      {onOpenToc && (
        <button
          type="button"
          onClick={onOpenToc}
          className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border-main bg-bg-secondary/60 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-turquoise transition-colors"
        >
          <ListTree size={14} />
          {labels.toc}
        </button>
      )}
    </div>
  );
}

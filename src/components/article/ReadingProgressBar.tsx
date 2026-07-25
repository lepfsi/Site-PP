"use client";

import { useEffect, useState } from "react";

/** Thin fixed progress bar tied to article scroll depth. */
export default function ReadingProgressBar({ targetId = "article-body" }: { targetId?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) {
        const scrollTop = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docH > 0 ? Math.min(100, (scrollTop / docH) * 100) : 0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const elTop = window.scrollY + rect.top;
      const elH = el.offsetHeight;
      const view = window.innerHeight;
      const scrolled = window.scrollY + view - elTop;
      const pct = Math.min(100, Math.max(0, (scrolled / elH) * 100));
      setProgress(pct);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none print:hidden"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-turquoise shadow-[0_0_8px_rgba(43,217,197,0.45)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

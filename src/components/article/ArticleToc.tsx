"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/article-reading";

interface ArticleTocProps {
  items: TocItem[];
  title: string;
}

export default function ArticleToc({ items, title }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav
      className="rounded-2xl border border-border-main bg-bg-secondary/80 p-5 sm:p-6 print:hidden"
      aria-label={title}
    >
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/50 mb-4 border-b border-border-main pb-3">
        {title}
      </h3>
      <ul className="space-y-1.5 max-h-[min(50vh,22rem)] overflow-y-auto pr-1">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${item.id}`}
                className={`block text-sm leading-snug py-1 transition-colors ${
                  active
                    ? "text-turquoise font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

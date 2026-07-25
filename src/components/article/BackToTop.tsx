"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BTN = 48; // approx button size + padding
const GAP = 16;
const DEFAULT_BOTTOM = 24;

/**
 * Floats near the right edge of the article column.
 * Stops above the site footer (does not overlap footer content).
 */
export default function BackToTop({
  label,
  anchorId = "article-body",
  footerId = "site-footer",
}: {
  label: string;
  anchorId?: string;
  footerId?: string;
}) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ right: number; bottom: number }>({
    right: 24,
    bottom: DEFAULT_BOTTOM,
  });

  useEffect(() => {
    const update = () => {
      setShow(window.scrollY > 480);

      const article = document.getElementById(anchorId);
      const footer = document.getElementById(footerId);

      let right = 24;
      if (article) {
        const rect = article.getBoundingClientRect();
        right = Math.max(12, window.innerWidth - rect.right + 8);
      }

      let bottom = DEFAULT_BOTTOM;
      if (footer) {
        const fTop = footer.getBoundingClientRect().top;
        // Distance from viewport bottom to footer top
        const spaceAboveFooter = window.innerHeight - fTop;
        if (spaceAboveFooter > 0) {
          // Lift the button so it sits GAP px above the footer
          bottom = Math.max(DEFAULT_BOTTOM, spaceAboveFooter + GAP);
        }
      }

      // Cap so the button never sits higher than mid-viewport awkwardly
      bottom = Math.min(bottom, window.innerHeight - BTN - GAP);

      setPos({ right, bottom });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [anchorId, footerId]);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed z-40 p-3 rounded-full border border-border-main bg-bg-secondary/95 text-turquoise shadow-lg hover:bg-turquoise hover:text-navy transition-[right,bottom,background-color,color] duration-150 print:hidden"
      style={{ right: pos.right, bottom: pos.bottom }}
      aria-label={label}
      title={label}
    >
      <ArrowUp size={18} />
    </button>
  );
}

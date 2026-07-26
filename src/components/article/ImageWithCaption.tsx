"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  title?: string;
}

/**
 * Block-level image with caption + lightbox.
 * Uses <div> (not <figure>) so react-markdown can nest it without invalid <p><figure>.
 * Still mark role="group" for accessibility.
 */
export default function ImageWithCaption({ src, alt, title }: ImageWithCaptionProps) {
  const [open, setOpen] = useState(false);
  const caption = title || alt;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="my-8 not-prose" role="group" data-article-figure>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full rounded-xl border border-border-main overflow-hidden bg-bg-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="w-full h-auto max-h-[28rem] object-contain mx-auto" loading="lazy" />
        </button>
        {caption ? (
          <p className="mt-2.5 text-center text-xs sm:text-sm text-text-secondary/80 font-medium leading-relaxed">
            {caption}
          </p>
        ) : null}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/90 p-4 sm:p-8 print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="fixed top-5 right-5 z-[210] p-2.5 rounded-full border border-border-main bg-bg-elevated text-text-primary shadow-xl hover:text-turquoise hover:border-turquoise/40"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="relative z-[205] max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

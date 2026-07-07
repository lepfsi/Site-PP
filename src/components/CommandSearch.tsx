"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, X, CornerDownLeft, FileText, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { searchSite, QUICK_LINKS } from "@/lib/search";

export default function CommandSearch() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchSite(query, t), [query, t]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    setMounted(true);
    setIsMac(typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 sm:px-6"
          onClick={close}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-bg-secondary border border-border-main rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center p-4 border-b border-border-main">
              <Search className="text-turquoise mr-3" size={16} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full bg-transparent border-none focus:ring-0 text-text-primary text-base font-mono placeholder-text-secondary/30"
              />
              <button onClick={close} className="p-1.5 hover:bg-bg-primary rounded-lg transition-colors">
                <X size={14} className="text-text-secondary" />
              </button>
            </div>

            <div className="p-2 max-h-[350px] overflow-y-auto">
              {!query && (
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/30 px-3 py-2">
                    {t("search.quick_links")}
                  </p>
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={close}
                      className="flex items-center justify-between p-3 hover:bg-bg-primary rounded-xl group transition-all"
                    >
                      <div className="flex items-center">
                        <CornerDownLeft size={12} className="text-turquoise mr-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs font-bold text-text-secondary group-hover:text-turquoise">{t(link.key)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {query && results.length === 0 && (
                <p className="text-center text-text-secondary/50 text-xs font-medium py-8">{t("search.no_results")}</p>
              )}

              {query && results.length > 0 && (
                <div className="space-y-1">
                  {results.some((r) => r.type === "article") && (
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/30 px-3 py-2">
                      {t("search.articles")}
                    </p>
                  )}
                  {results
                    .filter((r) => r.type === "article")
                    .map((result) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={close}
                        className="flex items-center p-3 hover:bg-bg-primary rounded-xl group transition-all"
                      >
                        <FileText size={14} className="text-turquoise mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-text-primary group-hover:text-turquoise truncate">
                            {t(result.titleKey)}
                          </div>
                          {result.subtitleKey && (
                            <div className="text-[10px] text-text-secondary/50 truncate">{t(result.subtitleKey)}</div>
                          )}
                        </div>
                      </Link>
                    ))}

                  {results.some((r) => r.type === "category") && (
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/30 px-3 py-2 mt-2">
                      {t("search.categories")}
                    </p>
                  )}
                  {results
                    .filter((r) => r.type === "category")
                    .map((result) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={close}
                        className="flex items-center p-3 hover:bg-bg-primary rounded-xl group transition-all"
                      >
                        <Folder size={14} className="text-turquoise mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-text-primary group-hover:text-turquoise truncate">
                            {t(result.titleKey)}
                          </div>
                          {result.subtitleKey && (
                            <div className="text-[10px] text-text-secondary/50 truncate">{t(result.subtitleKey)}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-bg-primary/50 border-t border-border-main flex items-center justify-between text-[8px] font-bold text-text-secondary/30 uppercase tracking-widest">
              <span>DailyOps Knowledge Search</span>
              <span><kbd className="bg-bg-secondary px-1 rounded border border-border-main">ESC</kbd> {t("search.close")}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-bg-secondary/40 border border-border-main rounded-xl hover:border-turquoise/50 transition-all group min-w-[140px] lg:min-w-[160px]"
      >
        <Search size={12} className="text-turquoise" />
        <span className="text-[11px] font-medium text-text-primary/70 flex-grow text-left">{t("search.label")}</span>
        <div className="flex items-center px-1.5 py-0.5 border border-border-main/50 rounded-lg bg-bg-primary/30">
          <span className="text-[9px] font-mono font-medium text-text-secondary/60">
            {isMac ? "⌘ K" : "Ctrl K"}
          </span>
        </div>
      </button>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
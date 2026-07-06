"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const QUICK_LINK_KEYS = ["search.link1", "search.link2", "search.link3"] as const;

export default function CommandSearch() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-3 px-4 py-2 bg-bg-secondary/40 border border-border-main rounded-xl hover:border-turquoise/50 transition-all group min-w-[160px] lg:min-w-[200px]"
      >
        <Search size={14} className="text-turquoise" />
        <span className="text-sm font-medium text-text-primary/70 flex-grow text-left">Search...</span>
        <div className="flex items-center px-2 py-1 border border-border-main/50 rounded-lg bg-bg-primary/30">
          <span className="text-[10px] font-mono font-medium text-text-secondary/60">
            {isMac ? "⌘ K" : "Ctrl K"}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="relative w-full max-w-lg bg-bg-secondary border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
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
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-bg-primary rounded-lg transition-colors">
                  <X size={14} className="text-text-secondary" />
                </button>
              </div>
              <div className="p-2 max-h-[350px] overflow-y-auto">
                {!query && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/30 px-3 py-2">{t("search.quick_links")}</p>
                    {QUICK_LINK_KEYS.map((linkKey) => (
                      <div key={linkKey} className="flex items-center justify-between p-3 hover:bg-bg-primary rounded-xl cursor-pointer group transition-all">
                        <div className="flex items-center">
                          <CornerDownLeft size={12} className="text-turquoise mr-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-xs font-bold text-text-secondary group-hover:text-turquoise">{t(linkKey)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-bg-primary/50 border-t border-border-main flex items-center justify-between text-[8px] font-bold text-text-secondary/30 uppercase tracking-widest">
                <span>DailyOps Knowledge Search v2.4</span>
                <div className="flex space-x-2">
                  <span><kbd className="bg-bg-secondary px-1 rounded border border-border-main">ESC</kbd> close</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


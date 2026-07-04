"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Command, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const QUICK_LINK_KEYS = ["search.link1", "search.link2", "search.link3"] as const;

export default function CommandSearch() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
        className="flex items-center space-x-3 px-3 py-1.5 bg-bg-secondary/50 border border-border-main rounded-xl hover:border-turquoise/50 transition-all group min-w-[130px]"
      >
        <Search size={12} className="text-text-secondary group-hover:text-turquoise" />
        <span className="text-[9px] font-black text-text-secondary/50 uppercase tracking-[0.2em] flex-grow text-left">{t("search.label")}</span>
        <div className="flex items-center space-x-1 px-1.5 py-0.5 border border-border-main rounded bg-bg-primary/50">
          <Command size={8} className="text-text-secondary/40" />
          <span className="text-[8px] font-mono font-bold text-text-secondary/40">K</span>
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
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-bg-secondary border border-white/5 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center p-6 border-b border-border-main">
                <Search className="text-turquoise mr-4" size={20} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  className="w-full bg-transparent border-none focus:ring-0 text-text-primary text-lg font-mono placeholder-text-secondary/30"
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-bg-primary rounded-xl transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                {!query && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/40 px-4 mb-4">{t("search.quick_links")}</p>
                    {QUICK_LINK_KEYS.map((key) => (
                      <div key={key} className="flex items-center justify-between p-4 hover:bg-bg-primary rounded-2xl cursor-pointer group transition-all">
                        <div className="flex items-center">
                          <CornerDownLeft size={14} className="text-turquoise mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-sm font-bold text-text-secondary group-hover:text-turquoise">{t(key)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
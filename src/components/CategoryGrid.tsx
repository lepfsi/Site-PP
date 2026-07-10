"use client";

import { ArrowRight, Code2, Shield, Cloud, Globe, Wrench, Activity, Brain } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/categories";
import CategoryVisual from "@/components/category-visuals/CategoryVisual";

const TYPING_TAGS = [
  { textKey: "hero.tag_infrastructure" as const, icon: Code2, cmdKey: "hero.term.1.cmd" as const, logKey: "hero.term.1.log" as const },
  { textKey: "hero.tag_cybersecurity" as const, icon: Shield, cmdKey: "hero.term.2.cmd" as const, logKey: "hero.term.2.log" as const },
  { textKey: "hero.tag_cloud" as const, icon: Cloud, cmdKey: "hero.term.3.cmd" as const, logKey: "hero.term.3.log" as const },
  { textKey: "hero.tag_observability" as const, icon: Activity, cmdKey: "hero.term.6.cmd" as const, logKey: "hero.term.6.log" as const },
  { textKey: "hero.tag_networking" as const, icon: Globe, cmdKey: "hero.term.4.cmd" as const, logKey: "hero.term.4.log" as const },
  { textKey: "hero.tag_ai" as const, icon: Brain, cmdKey: "hero.term.7.cmd" as const, logKey: "hero.term.7.log" as const },
  { textKey: "hero.tag_troubleshooting" as const, icon: Wrench, cmdKey: "hero.term.5.cmd" as const, logKey: "hero.term.5.log" as const },
];

function TypewriterTerminal() {
  const { t, lang } = useLanguage();
  const [tagIndex, setTagIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setTagIndex(0);
    setCurrentText("");
    setIsDeleting(false);
  }, [lang]);

  useEffect(() => {
    const fullText = t(TYPING_TAGS[tagIndex].textKey);
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setTagIndex((prev) => (prev + 1) % TYPING_TAGS.length);
      } else {
        const nextChar = isDeleting 
          ? fullText.substring(0, currentText.length - 1)
          : fullText.substring(0, currentText.length + 1);
        setCurrentText(nextChar);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, tagIndex, t]);

  const activeTag = TYPING_TAGS[tagIndex];
  const TagIcon = activeTag.icon;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <motion.div 
        key={tagIndex}
        className="flex items-center space-x-2 px-3 py-1.5 bg-bg-secondary border border-border-main rounded-lg shadow-sm"
      >
        <TagIcon size={14} className="text-turquoise" />
        <div className="flex items-center text-turquoise font-mono text-[11px] font-bold tracking-widest uppercase">
          <span>{currentText}</span>
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1 h-3.5 bg-turquoise ml-1" />
        </div>
      </motion.div>

      <div className="flex flex-col w-full sm:w-48 bg-navy/90 border border-green-500/30 rounded-lg p-2 font-mono text-[8px] shadow-lg shadow-green-500/5 min-h-[40px]">
        <div className="flex space-x-1 mb-1 opacity-50">
          <div className="w-1 h-1 rounded-full bg-[#ff5f57]/60"></div>
          <div className="w-1 h-1 rounded-full bg-[#febc2e]/60"></div>
          <div className="w-1 h-1 rounded-full bg-[#28c840]/60"></div>
        </div>
        <div className="text-green-500/80 leading-tight">
          <div className="truncate">{t(activeTag.cmdKey)}</div>
          <div className="flex items-center">
            <span className="animate-pulse">_</span>
            <span className="ml-1 truncate text-green-400 opacity-70">{t(activeTag.logKey)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="py-16 md:py-20 bg-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 noc-grid opacity-20 pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary code-font mb-2">
              <span className="text-turquoise">//</span> {t("cat.title")}
            </h2>
            <p className="text-text-secondary text-base font-medium">{t("cat.subtitle")}</p>
          </div>
          
          <TypewriterTerminal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link 
                href={`/category/${category.slug}`}
                className={`group flex flex-col h-full overflow-hidden surface-card rounded-2xl transition-all duration-300 ${category.border} hover:border-turquoise/30 relative`}
              >
                <div className="relative h-28 sm:h-32 border-b border-border-main/40 overflow-hidden">
                  <CategoryVisual slug={category.slug} variant="card" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent pointer-events-none" />
                  <div className={`absolute top-3 left-3 p-1.5 rounded-lg ${category.bg} ${category.color} border border-border-main/40 shadow-sm`}>
                    <category.icon size={14} />
                  </div>
                  <span className="absolute top-3 right-3 text-[8px] font-mono text-text-secondary/50 uppercase tracking-widest bg-bg-primary/60 px-2 py-0.5 rounded border border-border-main/50">
                    {category.count} {t("cat.articles")}
                  </span>
                </div>

                <div className="p-6 sm:p-7 flex flex-col flex-grow relative">
                  <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none rounded-b-2xl" />

                  <h3 className="text-lg font-bold text-text-primary mb-2 leading-tight group-hover:text-turquoise transition-colors relative z-10">
                    {t(category.nameKey)}
                  </h3>
                  
                  <p className="text-text-secondary text-xs leading-relaxed mb-5 flex-grow font-medium opacity-70 relative z-10">
                    {t(category.descKey)}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-border-main/50 relative z-10">
                    {category.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`px-2 py-0.5 rounded bg-bg-secondary border border-border-main text-[9px] font-bold uppercase tracking-wider ${category.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                      >
                        {tag}
                      </span>
                    ))}
                    <div className="ml-auto w-6 h-6 rounded-full bg-bg-primary border border-border-main flex items-center justify-center text-text-secondary group-hover:text-turquoise group-hover:border-turquoise transition-all">
                      <ArrowRight size={11} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import { Clock, Calendar, ArrowRight, Network } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { getFeaturedArticle, getRecentArticles } from "@/lib/articles";

function RoutingTopology() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0a1628]">
      <div className="absolute inset-0 tech-grid opacity-10"></div>
      
      <svg className="w-[85%] h-[85%] text-turquoise/20" viewBox="0 0 100 100">
        <path d="M 40 50 L 65 70 L 90 50" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
        
        <motion.path
          d="M 15 50 L 40 50 L 65 30 L 90 50"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="1"
          strokeDasharray="200"
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="opacity-40"
        />

        <motion.circle r="2" className="fill-turquoise shadow-[0_0_10px_#2dd4bf]">
          <animateMotion 
            dur="3s" 
            repeatCount="indefinite" 
            path="M 15 50 L 40 50 L 65 30 L 90 50" 
          />
        </motion.circle>

        <circle cx="15" cy="50" r="2" className="fill-text-secondary/40" />
        
        <foreignObject x="32" y="42" width="16" height="16">
          <div className="w-full h-full flex items-center justify-center bg-bg-secondary rounded-md border border-turquoise/40 shadow-lg">
            <Network size={10} className="text-turquoise" />
          </div>
        </foreignObject>

        <circle cx="65" cy="30" r="2" className="fill-turquoise shadow-[0_0_8px_#2dd4bf]" />
        <circle cx="65" cy="70" r="2" className="fill-text-secondary/20" />
        <circle cx="90" cy="50" r="2.5" className="fill-turquoise shadow-[0_0_12px_#2dd4bf]" />
      </svg>
    </div>
  );
}

export default function FeaturedArticles() {
  const { t } = useLanguage();
  const featured = getFeaturedArticle();
  const recentArticles = getRecentArticles(6);

  return (
    <section id="articles" className="py-24 bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-5 pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4"
          >
            <span className="text-turquoise">//</span> {t("articles.featured_title")}
          </motion.h2>
          <div className="flex flex-col items-center">
            <p className="text-text-secondary text-lg font-medium mb-4">{t("articles.featured_subtitle")}</p>
            <Link href="/articles" className="flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline group">
              {t("articles.view_all")} <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto bg-bg-secondary border border-border-main rounded-2xl overflow-hidden mb-16 group hover:border-turquoise/30 transition-all shadow-2xl"
        >
          <Link href={`/articles/${featured.slug}`} className="block">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
              <div className="lg:col-span-5 h-56 lg:h-auto border-b lg:border-b-0 lg:border-r border-border-main/50 relative overflow-hidden bg-[#0a1628]">
                <RoutingTopology />
              </div>
              
              <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className={`px-2.5 py-0.5 rounded ${featured.bg} ${featured.color} text-[10px] font-black uppercase tracking-[0.2em] border border-white/5`}>
                    {t(featured.categoryLabelKey)}
                  </span>
                  <span className="text-[9px] font-mono text-text-secondary/50 font-bold uppercase tracking-wider">
                    {featured.readTime} {t("articles.read_time")}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-text-primary mb-4 leading-tight group-hover:text-turquoise transition-colors tracking-tight">
                  {t(featured.titleKey)}
                </h3>
                
                <p className="text-text-secondary text-sm md:text-base mb-8 leading-relaxed font-medium opacity-80">
                  {t(featured.excerptKey)}
                </p>
                
                <div className="flex items-center space-x-3 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-turquoise/10 flex items-center justify-center border border-turquoise/20 font-black text-[10px] text-turquoise">
                    D
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-text-primary uppercase tracking-widest leading-none">{t("articles.author")}</div>
                    <div className="text-[9px] font-mono text-text-secondary/40 mt-1">{featured.date}</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {recentArticles.map((article, index) => (
            <motion.article 
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                href={`/articles/${article.slug}`}
                className="p-6 sm:p-8 bg-bg-secondary/40 border border-border-main rounded-2xl flex flex-col h-full hover:border-turquoise/30 transition-all group backdrop-blur-sm relative"
              >
                <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none rounded-2xl"></div>
                
                <div className="mb-4 relative z-10">
                  <span className={`px-2 py-0.5 rounded ${article.bg} ${article.color} text-[9px] font-bold uppercase tracking-widest border border-white/5`}>
                    {t(article.categoryLabelKey)}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-text-primary mb-3 leading-tight group-hover:text-turquoise transition-colors relative z-10">
                  {t(article.titleKey)}
                </h4>
                
                <p className="text-text-secondary text-xs mb-8 flex-grow font-medium leading-relaxed opacity-70 relative z-10">
                  {t(article.excerptKey)}
                </p>
                
                <div className="flex justify-between items-center pt-5 border-t border-border-main/50 text-[9px] font-mono text-text-secondary/40 font-bold uppercase tracking-widest relative z-10">
                  <span className="flex items-center"><Clock size={12} className="mr-1.5" /> {article.readTime}</span>
                  <span>{article.date}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
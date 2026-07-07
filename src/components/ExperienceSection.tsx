"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Clock, AlertTriangle, Settings, Shield, Zap, Move, Gauge, Network } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const experiences = [
  // First 3 (Muted Neutral style)
  {
    id: "04",
    titleKey: "exp.4.title" as const,
    descKey: "exp.4.desc" as const,
    footerKey: "exp.4.footer" as const,
    badgeKey: "exp.badge_incident" as const,
    icon: AlertTriangle,
    color: "border-l-slate-700", // Neutral color
    iconColor: "text-turquoise/50",
    bgColor: "bg-[#0f172a]"
  },
  {
    id: "05",
    titleKey: "exp.5.title" as const,
    descKey: "exp.5.desc" as const,
    footerKey: "exp.5.footer" as const,
    badgeKey: "exp.badge_optimization" as const,
    icon: Settings,
    color: "border-l-slate-700", // Neutral color
    iconColor: "text-turquoise/50",
    bgColor: "bg-[#0f172a]"
  },
  {
    id: "06",
    titleKey: "exp.6.title" as const,
    descKey: "exp.6.desc" as const,
    footerKey: "exp.6.footer" as const,
    badgeKey: "exp.badge_security" as const,
    icon: Shield,
    color: "border-l-slate-700", // Neutral color
    iconColor: "text-turquoise/50",
    bgColor: "bg-[#0f172a]"
  },
  // Last 3 (Horizontal Wide Cards style with Neutral Icons)
  {
    id: "01",
    titleKey: "exp.1.title" as const,
    descKey: "exp.1.desc" as const,
    tags: ["INCIDENT", "PRODUCTION", "NETWORKING"],
    icon: Network,
    iconContainerColor: "bg-bg-secondary border border-white/5", // Neutral background
    iconColor: "text-turquoise",
    readTime: "25 min",
    views: "8.2K",
    horizontal: true
  },
  {
    id: "02",
    titleKey: "exp.2.title" as const,
    descKey: "exp.2.desc" as const,
    tags: ["MIGRATION", "CLOUD", "SUCCESS STORY"],
    icon: Move,
    iconContainerColor: "bg-bg-secondary border border-white/5", // Neutral background
    iconColor: "text-turquoise",
    readTime: "30 min",
    views: "12.5K",
    horizontal: true
  },
  {
    id: "03",
    titleKey: "exp.3.title" as const,
    descKey: "exp.3.desc" as const,
    tags: ["PERFORMANCE", "OPTIMIZATION", "K8S"],
    icon: Gauge,
    iconContainerColor: "bg-bg-secondary border border-white/5", // Neutral background
    iconColor: "text-turquoise",
    readTime: "22 min",
    views: "9.8K",
    horizontal: true
  },
];

export default function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-24 bg-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-5 pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-6"
          >
            {t("exp.title")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-secondary text-lg max-w-3xl mx-auto font-medium"
          >
            {t("exp.subtitle")}
          </motion.p>
        </div>

        <div className="flex flex-col space-y-6 max-w-6xl mx-auto">
          {/* Top 3: Grid - Now with NEUTRAL borders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.slice(0, 3).map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col p-8 ${exp.bgColor} border-l-4 ${exp.color} rounded-r-2xl shadow-xl transition-all hover:border-l-turquoise group`}
              >
                <div className="flex items-center space-x-2 mb-6">
                  {exp.icon && <exp.icon size={16} className={exp.iconColor} />}
                  <span className={`text-[10px] font-black uppercase tracking-widest text-text-secondary/60 group-hover:text-turquoise transition-colors`}>
                    {t(exp.badgeKey as any)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-turquoise transition-colors">{t(exp.titleKey)}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-10 flex-grow font-medium">{t(exp.descKey)}</p>
                <div className="pt-6 border-t border-white/5 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest flex items-center">
                  <Clock size={12} className="mr-1.5" /> {t(exp.footerKey as any)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom 3: Wide Horizontal Style - Now with NEUTRAL icons */}
          {experiences.slice(3, 6).map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col md:flex-row items-center p-6 bg-[#0f172a] border border-white/5 rounded-2xl shadow-xl transition-all hover:border-turquoise/20"
            >
              <div className={`flex-shrink-0 w-16 h-16 ${exp.iconContainerColor} rounded-xl flex items-center justify-center ${exp.iconColor} shadow-lg mb-4 md:mb-0 md:mr-8 transition-all group-hover:scale-105`}>
                {exp.icon && <exp.icon size={24} />}
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                  {exp.tags?.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-turquoise/5 text-turquoise text-[9px] font-black uppercase tracking-wider border border-turquoise/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-turquoise transition-colors">
                  {t(exp.titleKey)}
                </h3>
                <p className="text-slate-400 text-sm font-medium opacity-80 leading-relaxed mb-4 line-clamp-2 md:line-clamp-1">
                  {t(exp.descKey)}
                </p>
                
                <div className="flex items-center justify-center md:justify-start space-x-6 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                  <span className="flex items-center"><Clock size={12} className="mr-1.5 text-turquoise" /> {exp.readTime}</span>
                  <span className="flex items-center"><Eye size={12} className="mr-1.5 text-turquoise" /> {exp.views} views</span>
                  <Link href="#" className="hidden md:flex ml-auto items-center text-turquoise hover:underline group-hover:translate-x-1 transition-transform">
                    {t("exp.read_case")} <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

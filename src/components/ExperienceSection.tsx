"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Clock, AlertTriangle, Settings, Shield, Zap, Flame, CheckCircle2, Monitor, Bug, Globe, Code2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const allExperiences = [
  // THE "NEW" ONES FROM PREVIOUS CAPTURES
  {
    titleKey: "exp.4.title" as const,
    descKey: "exp.4.desc" as const,
    footerKey: "exp.4.footer" as const,
    badgeKey: "exp.badge_incident" as const,
    icon: AlertTriangle,
    color: "border-l-blue-500",
    iconColor: "text-blue-500",
    id: "04"
  },
  {
    titleKey: "exp.5.title" as const,
    descKey: "exp.5.desc" as const,
    footerKey: "exp.5.footer" as const,
    badgeKey: "exp.badge_optimization" as const,
    icon: Settings,
    color: "border-l-orange-500",
    iconColor: "text-orange-500",
    id: "05"
  },
  {
    titleKey: "exp.6.title" as const,
    descKey: "exp.6.desc" as const,
    footerKey: "exp.6.footer" as const,
    badgeKey: "exp.badge_security" as const,
    icon: Shield,
    color: "border-l-red-500",
    iconColor: "text-red-500",
    id: "06"
  },
  // THE "OLD" ONES FROM THE LATEST CAPTURE
  {
    titleKey: "exp.1.title" as const,
    descKey: "exp.1.desc" as const,
    emoji: "🔥",
    color: "border-l-red-500",
    readTime: "25 MIN",
    views: "8.2K",
    id: "01"
  },
  {
    titleKey: "exp.2.title" as const,
    descKey: "exp.2.desc" as const,
    emoji: "✅",
    color: "border-l-green-500",
    readTime: "30 MIN",
    views: "12.5K",
    id: "02"
  },
  {
    titleKey: "exp.3.title" as const,
    descKey: "exp.3.desc" as const,
    emoji: "⚡",
    color: "border-l-yellow-500",
    readTime: "22 MIN",
    views: "9.8K",
    id: "03"
  },
];

export default function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-24 bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-5 pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
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
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-3xl mx-auto font-medium"
          >
            {t("exp.subtitle")}
          </motion.p>
        </div>

        {/* Unified Horizontal Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allExperiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`group flex flex-col p-8 bg-[#0f172a] border-l-4 ${exp.color} rounded-r-2xl shadow-xl transition-all hover:translate-y-[-4px] hover:shadow-turquoise/5`}
            >
              <div className="flex items-center justify-between mb-8">
                {exp.emoji ? (
                  <span className="text-2xl">{exp.emoji}</span>
                ) : exp.icon ? (
                  <exp.icon size={20} className={exp.iconColor} />
                ) : null}
                <span className="text-[10px] font-mono text-text-secondary/40 uppercase font-black tracking-widest">
                  CASE LOG #{exp.id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-turquoise transition-colors leading-tight">
                {t(exp.titleKey)}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-10 flex-grow font-medium opacity-80">
                {t(exp.descKey)}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">
                  {exp.footerKey ? (
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1.5" />
                      {t(exp.footerKey)}
                    </div>
                  ) : (
                    <>
                      <span className="flex items-center"><Clock size={12} className="mr-1.5" /> {exp.readTime}</span>
                      <span className="flex items-center"><Eye size={12} className="mr-1.5" /> {exp.views}</span>
                    </>
                  )}
                </div>
                <Link href="#" className="text-turquoise opacity-50 group-hover:opacity-100 transition-all">
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
